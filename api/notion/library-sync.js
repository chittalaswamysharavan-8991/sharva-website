const {
  createAdminClient,
  getVerifiedOwner,
  refreshNotionToken,
  syncLibraryOS,
  syncNotion
} = require("../_lib/connector-auth");

function normalizeScope(scope) {
  if (Array.isArray(scope)) return scope.filter(Boolean);
  if (typeof scope === "string") return scope.split(" ").filter(Boolean);
  return [];
}

async function syncOwnerWithAdmin(ownerId, client) {
  const { data: tokenRow, error: tokenError } = await client
    .from("connector_tokens")
    .select("access_token,refresh_token,token_type,scope,expires_at,raw_payload,updated_at")
    .eq("owner_id", ownerId)
    .eq("connector_name", "notion")
    .maybeSingle();

  if (tokenError) throw tokenError;
  if (!tokenRow?.access_token) {
    return { ownerId, status: "skipped", summary: "No stored Notion token." };
  }

  let accessToken = tokenRow.access_token;
  let scope = normalizeScope(tokenRow.scope);

  if (tokenRow.expires_at && new Date(tokenRow.expires_at).getTime() <= Date.now()) {
    if (!tokenRow.refresh_token) {
      return { ownerId, status: "skipped", summary: "Notion token expired and no refresh token is available." };
    }

    const refreshed = await refreshNotionToken(tokenRow.refresh_token);
    accessToken = refreshed.access_token;
    scope = normalizeScope(refreshed.scope) || scope;

    const expiresAt = refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString() : null;
    const { error: refreshWriteError } = await client.from("connector_tokens").upsert(
      {
        owner_id: ownerId,
        connector_name: "notion",
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token || tokenRow.refresh_token,
        token_type: refreshed.token_type || tokenRow.token_type || null,
        scope,
        expires_at: expiresAt,
        raw_payload: refreshed
      },
      { onConflict: "owner_id,connector_name" }
    );
    if (refreshWriteError) throw refreshWriteError;
  }

  const librarySync = await syncLibraryOS(ownerId, accessToken);
  const summary = librarySync.summary || "Library sync completed.";

  const { error: accountError } = await client.from("connector_accounts").upsert(
    {
      owner_id: ownerId,
      connector_name: "notion",
      status: "connected",
      scopes: scope.length ? scope : ["buildos_pages", "docs_writeback"],
      token_reference: "notion",
      last_synced_at: new Date().toISOString()
    },
    { onConflict: "owner_id,connector_name" }
  );
  if (accountError) throw accountError;

  const { error: eventError } = await client.from("sync_events").insert({
    owner_id: ownerId,
    connector_name: "notion",
    action: "notion_library_sync",
    privacy_class: "private_summary",
    status: "success",
    summary,
    error_message: null
  });
  if (eventError) throw eventError;

  return {
    ownerId,
    status: "success",
    summary,
    counts: librarySync.librarySync
  };
}

module.exports = async function handler(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const accessToken =
      request.body?.accessToken ||
      request.headers.authorization?.replace(/^Bearer\s+/i, "") ||
      "";

    if (accessToken) {
      const { user } = await getVerifiedOwner(accessToken);
      const result = await syncNotion(user.id, accessToken);
      return response.status(200).json({
        connector: "notion",
        status: "synced",
        mode: "manual",
        ...result
      });
    }

    const client = createAdminClient();
    const { data: owners, error: ownersError } = await client
      .from("cockpit_profiles")
      .select("user_id,email,display_name,is_enabled")
      .eq("is_enabled", true);
    if (ownersError) throw ownersError;

    const results = [];
    for (const owner of owners || []) {
      try {
        results.push(await syncOwnerWithAdmin(owner.user_id, client));
      } catch (ownerError) {
        const { error: eventError } = await client.from("sync_events").insert({
          owner_id: owner.user_id,
          connector_name: "notion",
          action: "notion_library_sync",
          privacy_class: "private_summary",
          status: "error",
          summary: "Library sync failed.",
          error_message: ownerError.message
        });
        if (eventError) throw eventError;
        results.push({
          ownerId: owner.user_id,
          status: "error",
          summary: ownerError.message
        });
      }
    }

    return response.status(200).json({
      connector: "notion",
      status: "synced",
      mode: "automated",
      results
    });
  } catch (error) {
    return response.status(400).json({
      connector: "notion",
      status: "error",
      error: error.message
    });
  }
};
