const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const CANONICAL_APP_URL = "https://pablo-cockpit.vercel.app";
const NOTION_VERSION = "2026-03-11";
const LIBRARY_OS_DATABASE_ID = "3b47af75b0404578814cc3a2564ed13f";
const LIBRARY_OS_DATA_SOURCE_URL = "collection://3ca63b62-460f-4b80-a77e-c48283255a0c";
const LIBRARY_SYNC_PAGE_SIZE = 50;
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.freebusy"
];

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function getSupabaseConfig() {
  return {
    supabaseUrl: requireEnv("VITE_SUPABASE_URL", process.env.VITE_SUPABASE_URL?.trim()),
    supabaseAnonKey: requireEnv("VITE_SUPABASE_ANON_KEY", process.env.VITE_SUPABASE_ANON_KEY?.trim())
  };
}

function getSupabaseServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function getConnectorStateSecret() {
  return requireEnv("CONNECTOR_STATE_SECRET", process.env.CONNECTOR_STATE_SECRET?.trim());
}

function getGoogleConfig() {
  return {
    googleClientId: requireEnv("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID?.trim()),
    googleClientSecret: requireEnv("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET?.trim())
  };
}

function getNotionConfig() {
  return {
    notionClientId: requireEnv("NOTION_CLIENT_ID", process.env.NOTION_CLIENT_ID?.trim()),
    notionClientSecret: requireEnv("NOTION_CLIENT_SECRET", process.env.NOTION_CLIENT_SECRET?.trim())
  };
}

function createAnonClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });
}

function createAuthedClient(accessToken) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });
}

function createAdminClient() {
  const { supabaseUrl } = getSupabaseConfig();
  const supabaseServiceRoleKey = getSupabaseServiceRoleKey();
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });
}

function connectorCallbackPath(connectorName) {
  if (connectorName === "google_calendar") {
    return "/api/google-calendar/oauth/callback";
  }

  if (connectorName === "notion") {
    return "/api/notion/oauth/callback";
  }

  throw new Error(`Unsupported connector: ${connectorName}`);
}

function connectorSyncPath(connectorName) {
  if (connectorName === "google_calendar") {
    return "/api/google-calendar/sync";
  }

  if (connectorName === "notion") {
    return "/api/notion/sync";
  }

  throw new Error(`Unsupported connector: ${connectorName}`);
}

function signConnectorState(payload) {
  const connectorStateSecret = getConnectorStateSecret();
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + 15 * 60 * 1000
    })
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", connectorStateSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function signConnectorSession(payload) {
  return signConnectorState(payload);
}

function normalizeReturnPath(returnPath) {
  if (typeof returnPath !== "string") {
    return "/sync-settings";
  }

  const trimmed = returnPath.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/sync-settings";
  }

  return trimmed;
}

function verifyConnectorState(state) {
  const connectorStateSecret = getConnectorStateSecret();
  if (!state || typeof state !== "string") {
    throw new Error("Missing connector state.");
  }

  const [body, signature] = state.split(".");
  if (!body || !signature) {
    throw new Error("Invalid connector state.");
  }

  const expectedSignature = crypto.createHmac("sha256", connectorStateSecret).update(body).digest("base64url");
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    throw new Error("Invalid connector state signature.");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Date.now()) {
    throw new Error("Connector state expired.");
  }

  return payload;
}

function verifyConnectorSession(value) {
  return verifyConnectorState(value);
}

function buildConnectorSessionCookie(value) {
  const secure = process.env.NODE_ENV === "production";
  const attributes = ["HttpOnly", "SameSite=Lax", "Path=/api", "Max-Age=900"];
  if (secure) {
    attributes.unshift("Secure");
  }
  return `pablo_connector_session=${value}; ${attributes.join("; ")}`;
}

function clearConnectorSessionCookie() {
  const secure = process.env.NODE_ENV === "production";
  const attributes = ["HttpOnly", "SameSite=Lax", "Path=/api", "Max-Age=0"];
  if (secure) {
    attributes.unshift("Secure");
  }
  return `pablo_connector_session=; ${attributes.join("; ")}`;
}

function readConnectorSessionCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)pablo_connector_session=([^;]+)/);
  return match ? match[1] : null;
}

async function getVerifiedOwner(accessToken) {
  if (!accessToken) {
    throw new Error("Missing Supabase access token.");
  }

  const client = createAnonClient();
  const { data, error } = await client.auth.getUser(accessToken);
  if (error) throw error;

  const user = data?.user;
  if (!user) {
    throw new Error("Supabase user session not found.");
  }

  const { data: profile, error: profileError } = await client
    .from("cockpit_profiles")
    .select("user_id,email,display_name,is_enabled,role")
    .eq("user_id", user.id)
    .eq("is_enabled", true)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) {
    throw new Error("This account is not allowlisted for Pablo Cockpit.");
  }

  return { client, user, profile };
}

function buildGoogleAuthorizationUrl(state) {
  const { googleClientId } = getGoogleConfig();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", googleClientId);
  url.searchParams.set("redirect_uri", `${CANONICAL_APP_URL}${connectorCallbackPath("google_calendar")}`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_SCOPES.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);
  return url.toString();
}

function buildNotionAuthorizationUrl(state) {
  const { notionClientId } = getNotionConfig();
  const url = new URL("https://api.notion.com/v1/oauth/authorize");
  url.searchParams.set("owner", "user");
  url.searchParams.set("client_id", notionClientId);
  url.searchParams.set("redirect_uri", `${CANONICAL_APP_URL}${connectorCallbackPath("notion")}`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  return url.toString();
}

async function exchangeGoogleCode(code) {
  const { googleClientId, googleClientSecret } = getGoogleConfig();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: `${CANONICAL_APP_URL}${connectorCallbackPath("google_calendar")}`,
      grant_type: "authorization_code"
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || `Google token exchange failed (${response.status})`);
  }
  return payload;
}

async function refreshGoogleToken(refreshToken) {
  const { googleClientId, googleClientSecret } = getGoogleConfig();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      grant_type: "refresh_token"
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || `Google token refresh failed (${response.status})`);
  }
  return payload;
}

async function exchangeNotionCode(code) {
  const { notionClientId, notionClientSecret } = getNotionConfig();
  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${notionClientId}:${notionClientSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${CANONICAL_APP_URL}${connectorCallbackPath("notion")}`
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || `Notion token exchange failed (${response.status})`);
  }
  return payload;
}

async function refreshNotionToken(refreshToken) {
  const { notionClientId, notionClientSecret } = getNotionConfig();
  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${notionClientId}:${notionClientSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || `Notion token refresh failed (${response.status})`);
  }
  return payload;
}

async function upsertConnectorToken(ownerId, connectorName, tokenPayload, accessToken) {
  const client = createAuthedClient(accessToken);
  const existing = await getConnectorToken(ownerId, connectorName, accessToken);
  const mergedRefreshToken = tokenPayload.refresh_token || existing?.refresh_token || null;
  const mergedScope =
    typeof tokenPayload.scope === "string"
      ? tokenPayload.scope.split(" ").filter(Boolean)
      : Array.isArray(tokenPayload.scope)
        ? tokenPayload.scope
        : existing?.scope || [];
  const expiresAt = tokenPayload.expires_in
    ? new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString()
    : existing?.expires_at || null;

  const { error } = await client.from("connector_tokens").upsert(
    {
      owner_id: ownerId,
      connector_name: connectorName,
      access_token: tokenPayload.access_token,
      refresh_token: mergedRefreshToken,
      token_type: tokenPayload.token_type || existing?.token_type || null,
      scope: mergedScope,
      expires_at: expiresAt,
      raw_payload: tokenPayload
    },
    { onConflict: "owner_id,connector_name" }
  );

  if (error) throw error;
  return { scope: mergedScope, expiresAt };
}

async function updateConnectorAccount(ownerId, connectorName, status, scopes, lastSyncedAt = null, accessToken) {
  const client = createAuthedClient(accessToken);
  const { error } = await client.from("connector_accounts").upsert(
    {
      owner_id: ownerId,
      connector_name: connectorName,
      status,
      scopes: scopes || [],
      token_reference: connectorName,
      last_synced_at: lastSyncedAt
    },
    { onConflict: "owner_id,connector_name" }
  );

  if (error) throw error;
}

async function recordSyncEvent(ownerId, connectorName, action, status, summary, errorMessage = null, accessToken) {
  const client = createAuthedClient(accessToken);
  const { error } = await client.from("sync_events").insert({
    owner_id: ownerId,
    connector_name: connectorName,
    action,
    privacy_class: "private_summary",
    status,
    summary,
    error_message: errorMessage
  });

  if (error) throw error;
}

async function getConnectorToken(ownerId, connectorName, accessToken) {
  const client = createAuthedClient(accessToken);
  const { data, error } = await client
    .from("connector_tokens")
    .select("access_token,refresh_token,token_type,scope,expires_at,raw_payload,updated_at")
    .eq("owner_id", ownerId)
    .eq("connector_name", connectorName)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function ensureGoogleAccessToken(ownerId, accessToken) {
  const token = await getConnectorToken(ownerId, "google_calendar", accessToken);
  if (!token) {
    throw new Error("Google Calendar is not connected yet.");
  }

  if (token.expires_at && new Date(token.expires_at).getTime() <= Date.now()) {
    if (!token.refresh_token) {
      throw new Error("Google Calendar token expired and no refresh token is available.");
    }
    const refreshed = await refreshGoogleToken(token.refresh_token);
    await upsertConnectorToken(ownerId, "google_calendar", {
      ...refreshed,
      refresh_token: token.refresh_token
    }, accessToken);
    return refreshed.access_token;
  }

  return token.access_token;
}

async function ensureNotionAccessToken(ownerId, accessToken) {
  const token = await getConnectorToken(ownerId, "notion", accessToken);
  if (!token) {
    throw new Error("Notion is not connected yet.");
  }

  if (token.expires_at && new Date(token.expires_at).getTime() <= Date.now()) {
    if (!token.refresh_token) {
      throw new Error("Notion token expired and no refresh token is available.");
    }
    const refreshed = await refreshNotionToken(token.refresh_token);
    await upsertConnectorToken(ownerId, "notion", {
      ...refreshed,
      refresh_token: token.refresh_token
    }, accessToken);
    return refreshed.access_token;
  }

  return token.access_token;
}

function extractNotionTitle(item) {
  if (!item || typeof item !== "object") return "Untitled Notion item";
  if (typeof item.title === "string" && item.title.trim()) return item.title.trim();
  if (Array.isArray(item.title)) {
    const joined = item.title.map((part) => part?.plain_text || part?.text?.content || "").join("").trim();
    if (joined) return joined;
  }
  if (item.properties && typeof item.properties === "object") {
    for (const property of Object.values(item.properties)) {
      if (property?.type === "title" && Array.isArray(property.title)) {
        const joined = property.title.map((part) => part?.plain_text || part?.text?.content || "").join("").trim();
        if (joined) return joined;
      }
    }
  }
  return item.id || "Untitled Notion item";
}

function normalizeNotionTimestamp(value) {
  if (!value) return null;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  return null;
}

function extractNotionPersonName(person) {
  if (!person || typeof person !== "object") return "";
  return (
    person.name ||
    person.person?.email ||
    person.person?.name ||
    person.id ||
    person.object ||
    ""
  );
}

function extractNotionPersonIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((person) => (typeof person === "string" ? person : person?.id))
      .filter(Boolean);
  }

  if (typeof value === "object" && value.id) {
    return [value.id];
  }

  return [];
}

function libraryFavoriteSet() {
  return new Set([
    "Sharva OS — Home",
    "🏠 Sharva OS — Home",
    "🛠️ BuildOS",
    "BuildOS",
    "🧠 AI OS",
    "AI OS",
    "🧭 Workspace Truth Map",
    "Workspace Truth Map",
    "Sharva AI Agent Skill OS",
    "Pablo",
    "Sharva OS — Home",
    "🏠 Sharva OS — Home",
    "🛠️ BuildOS",
    "🧠 AI OS",
    "🧭 Workspace Truth Map"
  ]);
}

function titleMatchesAny(title, values) {
  const normalized = (title || "").toLowerCase();
  return values.some((value) => normalized.includes(String(value).toLowerCase()));
}

function deriveLibrarySection(title, item) {
  if (isLibraryFavorite(title)) return "Favorites";
  if (titleMatchesAny(title, ["agent", "automation", "runtime", "loop", "brief", "ai agent"])) return "Agents";
  if (titleMatchesAny(title, ["meeting note", "meeting notes", "meeting recap", "ai meeting"])) return "AI Meeting Notes";
  if (titleMatchesAny(title, ["private"])) return "Private";
  return "Shared";
}

function deriveLibrarySource(title) {
  const normalized = (title || "").toLowerCase();
  if (normalized.includes("pablo")) return "Pablo";
  if (normalized.includes("buildos")) return "BuildOS";
  if (normalized.includes("ai os")) return "AI OS";
  if (normalized.includes("learningos")) return "AI OS";
  if (normalized.includes("portfolioos")) return "PortfolioOS";
  if (normalized.includes("home")) return "Home";
  if (normalized.includes("tasks")) return "System";
  if (normalized.includes("cleanup") || normalized.includes("truth map") || normalized.includes("write-target")) {
    return "System";
  }
  return "System";
}

function deriveLibraryEntryType(item, title) {
  if (item?.object === "database") return "Database";
  const normalized = (title || "").toLowerCase();
  if (normalized.includes("agent")) return "Agent";
  if (normalized.includes("brief")) return "Agent";
  if (normalized.includes("notes")) return "Note";
  return "Page";
}

function isLibraryFavorite(title) {
  if (libraryFavoriteSet().has(title)) {
    return true;
  }

  return titleMatchesAny(title, ["Sharva OS — Home", "BuildOS", "AI OS", "Workspace Truth Map", "Sharva AI Agent Skill OS", "Pablo"]);
}

function readNotionRichTextText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((part) => part?.plain_text || part?.text?.content || "")
      .join("")
      .trim();
  }
  return "";
}

function formatRichText(value) {
  const text = readNotionRichTextText(value).trim();
  return text
    ? [
        {
          type: "text",
          text: { content: text }
        }
      ]
    : [];
}

async function notionApiRequest(token, path, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Notion API request failed (${response.status})`);
  }

  return payload;
}

async function searchNotionWorkspacePages(token, pageSize = LIBRARY_SYNC_PAGE_SIZE) {
  const results = [];
  let startCursor = undefined;

  while (results.length < pageSize) {
    const remaining = pageSize - results.length;
    const payload = await notionApiRequest(token, "/search", {
      method: "POST",
      body: {
        page_size: Math.min(remaining, 100),
        ...(startCursor ? { start_cursor: startCursor } : {})
      }
    });

    const batch = Array.isArray(payload.results) ? payload.results : [];
    results.push(...batch);
    if (!payload.has_more || !payload.next_cursor || !batch.length) {
      break;
    }
    startCursor = payload.next_cursor;
  }

  return results.slice(0, pageSize);
}

function sortNotionWorkspacePagesByRecentActivity(items) {
  return [...items].sort((left, right) => {
    const rightEdited = new Date(right?.last_edited_time || right?.lastEditedTime || right?.timestamp || 0).getTime();
    const leftEdited = new Date(left?.last_edited_time || left?.lastEditedTime || left?.timestamp || 0).getTime();
    if (rightEdited !== leftEdited) {
      return rightEdited - leftEdited;
    }

    const rightCreated = new Date(right?.created_time || right?.createdTime || right?.timestamp || 0).getTime();
    const leftCreated = new Date(left?.created_time || left?.createdTime || left?.timestamp || 0).getTime();
    if (rightCreated !== leftCreated) {
      return rightCreated - leftCreated;
    }

    return String(left?.id || "").localeCompare(String(right?.id || ""));
  });
}

async function findLibraryRow(token, pageUrl) {
  const payload = await notionApiRequest(token, `/databases/${LIBRARY_OS_DATABASE_ID}/query`, {
    method: "POST",
    body: {
      filter: {
        property: "Page URL",
        url: {
          equals: pageUrl
        }
      },
      page_size: 1
    }
  });

  return Array.isArray(payload.results) && payload.results.length ? payload.results[0] : null;
}

function buildLibraryPageProperties(item) {
  const title = extractNotionTitle(item);
  const pageUrl = item.url || `https://app.notion.com/p/${String(item.id || "").replace(/-/g, "")}?pvs=1`;
  const sourceLastEditedTime = normalizeNotionTimestamp(item.last_edited_time || item.lastEditedTime || item.timestamp);
  const sourceCreatedTime = normalizeNotionTimestamp(item.created_time || item.createdTime || item.timestamp);
  const createdByText = extractNotionPersonName(item.created_by || item.createdBy || item.created_by?.person || item.created_by?.user);
  const lastEditedByText = extractNotionPersonName(item.last_edited_by || item.lastEditedBy || item.last_edited_by?.person || item.last_edited_by?.user);
  const section = deriveLibrarySection(title, item);
  const source = deriveLibrarySource(title);
  const entryType = deriveLibraryEntryType(item, title);

  return {
    "Page Name": {
      title: formatRichText(title)
    },
    "Page URL": {
      url: pageUrl
    },
    "Section": {
      select: {
        name: section
      }
    },
    "Source": {
      select: {
        name: source
      }
    },
    "Entry Type": {
      select: {
        name: entryType
      }
    },
    "Favorite": {
      checkbox: isLibraryFavorite(title)
    },
    "Notes": {
      rich_text: formatRichText(
        section === "Private"
          ? "Internal engine or private workspace material."
          : section === "Agents"
            ? "Agent surface used for workspace automation."
            : "Live workspace page indexed from the current Notion workspace."
      )
    },
    ...(sourceCreatedTime ? { "Source Created Time": { date: { start: sourceCreatedTime } } } : {}),
    ...(sourceLastEditedTime ? { "Source Last Edited Time": { date: { start: sourceLastEditedTime } } } : {}),
    ...(createdByText ? { "Source Created By": { rich_text: formatRichText(createdByText) } } : {}),
    ...(lastEditedByText ? { "Source Last Edited By": { rich_text: formatRichText(lastEditedByText) } } : {})
  };
}

async function upsertLibraryRow(token, item) {
  const title = extractNotionTitle(item);
  const pageUrl = item.url || `https://app.notion.com/p/${String(item.id || "").replace(/-/g, "")}?pvs=1`;
  const existing = await findLibraryRow(token, pageUrl);
  const properties = buildLibraryPageProperties(item);

  if (existing?.id) {
    await notionApiRequest(token, `/pages/${existing.id}`, {
      method: "PATCH",
      body: { properties }
    });
    return { action: "updated", title, pageUrl };
  }

  await notionApiRequest(token, "/pages", {
    method: "POST",
    body: {
      parent: { database_id: LIBRARY_OS_DATABASE_ID },
      properties
    }
  });
  return { action: "created", title, pageUrl };
}

async function syncLibraryOS(ownerId, notionAccessToken) {
  const results = await searchNotionWorkspacePages(notionAccessToken, LIBRARY_SYNC_PAGE_SIZE);
  const syncable = sortNotionWorkspacePagesByRecentActivity(
    results.filter((item) => item && (item.object === "page" || item.object === "database"))
  );

  const outcomes = [];
  for (const item of syncable) {
    const outcome = await upsertLibraryRow(notionAccessToken, item);
    outcomes.push(outcome);
  }

  return {
    total: outcomes.length,
    created: outcomes.filter((item) => item.action === "created").length,
    updated: outcomes.filter((item) => item.action === "updated").length,
    summary: `LibraryOS synced ${outcomes.length} page(s) from the live Notion workspace.`
  };
}

async function syncGoogleCalendar(ownerId, accessToken) {
  const calendarAccessToken = await ensureGoogleAccessToken(ownerId, accessToken);
  const calendarResponse = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: {
      Authorization: `Bearer ${calendarAccessToken}`
    }
  });
  const calendarPayload = await calendarResponse.json().catch(() => ({}));
  if (!calendarResponse.ok) {
    throw new Error(calendarPayload.error?.message || `Google Calendar list failed (${calendarResponse.status})`);
  }

  const calendars = Array.isArray(calendarPayload.items) ? calendarPayload.items.filter((item) => item?.id) : [];
  const pickedCalendars = calendars.slice(0, 3).map((item) => ({
    id: item.id,
    summary: item.summary || item.id,
    primary: item.primary === true
  }));

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const freeBusyResponse = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${calendarAccessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: pickedCalendars.length ? pickedCalendars.map((calendar) => ({ id: calendar.id })) : [{ id: "primary" }]
    })
  });
  const freeBusyPayload = await freeBusyResponse.json().catch(() => ({}));
  if (!freeBusyResponse.ok) {
    throw new Error(freeBusyPayload.error?.message || `Google Calendar free/busy failed (${freeBusyResponse.status})`);
  }

  const busyWindows = Object.values(freeBusyPayload.calendars || {}).reduce(
    (count, calendar) => count + (Array.isArray(calendar.busy) ? calendar.busy.length : 0),
    0
  );

  const summary = `Synced ${pickedCalendars.length || 1} calendar(s) and found ${busyWindows} busy window(s) in the next 24 hours.`;
  await updateConnectorAccount(ownerId, "google_calendar", "connected", GOOGLE_SCOPES, new Date().toISOString(), accessToken);
  await recordSyncEvent(ownerId, "google_calendar", "google_calendar_sync", "success", summary, null, accessToken);

  return {
    calendars: pickedCalendars,
    freeBusy: freeBusyPayload,
    summary
  };
}

async function syncNotion(ownerId, accessToken) {
  const notionAccessToken = await ensureNotionAccessToken(ownerId, accessToken);
  const results = await searchNotionWorkspacePages(notionAccessToken, LIBRARY_SYNC_PAGE_SIZE);
  const items = results
    .filter((item) => item && (item.object === "page" || item.object === "database"))
    .map((item) => ({
      id: item.id,
      title: extractNotionTitle(item),
      object: item.object || "page",
      createdTime: normalizeNotionTimestamp(item.created_time || item.createdTime || item.timestamp),
      lastEditedTime: normalizeNotionTimestamp(item.last_edited_time || item.lastEditedTime || item.timestamp)
    }));

  const librarySync = await syncLibraryOS(ownerId, notionAccessToken);
  const summary = `${librarySync.summary} Found ${items.length} page(s) in the workspace sample.`;
  const scopes = items.length ? ["buildos_pages", "docs_writeback"] : ["buildos_pages"];
  await updateConnectorAccount(ownerId, "notion", "connected", scopes, new Date().toISOString(), accessToken);
  await recordSyncEvent(ownerId, "notion", "notion_sync", "success", summary, null, accessToken);

  return {
    items,
    librarySync,
    summary
  };
}

module.exports = {
  CANONICAL_APP_URL,
  LIBRARY_OS_DATABASE_ID,
  LIBRARY_OS_DATA_SOURCE_URL,
  connectorCallbackPath,
  connectorSyncPath,
  buildGoogleAuthorizationUrl,
  buildNotionAuthorizationUrl,
  createAdminClient,
  createAuthedClient,
  buildConnectorSessionCookie,
  clearConnectorSessionCookie,
  exchangeGoogleCode,
  exchangeNotionCode,
  ensureGoogleAccessToken,
  ensureNotionAccessToken,
  getConnectorToken,
  refreshNotionToken,
  getVerifiedOwner,
  recordSyncEvent,
  signConnectorState,
  signConnectorSession,
  normalizeReturnPath,
  syncGoogleCalendar,
  syncNotion,
  syncLibraryOS,
  updateConnectorAccount,
  upsertConnectorToken,
  readConnectorSessionCookie,
  verifyConnectorState
};
