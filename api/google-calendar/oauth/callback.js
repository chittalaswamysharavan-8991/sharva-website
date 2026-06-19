const {
  CANONICAL_APP_URL,
  clearConnectorSessionCookie,
  exchangeGoogleCode,
  getVerifiedOwner,
  readConnectorSessionCookie,
  recordSyncEvent,
  syncGoogleCalendar,
  updateConnectorAccount,
  upsertConnectorToken,
  verifyConnectorSession,
  verifyConnectorState
} = require("../../_lib/connector-auth");

function redirectUrl(basePath, params) {
  const url = new URL(`${CANONICAL_APP_URL}${basePath}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

function redirectWithCleanup(response, basePath, params) {
  response.setHeader("Set-Cookie", clearConnectorSessionCookie());
  return response.redirect(redirectUrl(basePath, params));
}

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { code, error, error_description: errorDescription, state } = request.query || {};
  const sessionCookie = readConnectorSessionCookie(request.headers.cookie);

  try {
    const parsedState = verifyConnectorState(state);
    if (parsedState.connectorName !== "google_calendar") {
      throw new Error("Connector state does not match Google Calendar.");
    }

    if (!sessionCookie) {
      throw new Error("Missing connector session.");
    }

    const parsedSession = verifyConnectorSession(sessionCookie);
    if (parsedSession.connectorName !== "google_calendar") {
      throw new Error("Connector session does not match Google Calendar.");
    }
    if (parsedSession.ownerId !== parsedState.ownerId) {
      throw new Error("Connector session owner mismatch.");
    }

    if (error) {
      return redirectWithCleanup(response, parsedState.returnPath || "/sync-settings", {
          connector: "google_calendar",
          status: "error",
          message: errorDescription || error
        });
    }

    if (!code) {
      throw new Error("Missing Google authorization code.");
    }

    const tokenPayload = await exchangeGoogleCode(code);
    await getVerifiedOwner(parsedSession.accessToken);
    const { scope, expiresAt } = await upsertConnectorToken(
      parsedState.ownerId,
      "google_calendar",
      tokenPayload,
      parsedSession.accessToken
    );
    await updateConnectorAccount(
      parsedState.ownerId,
      "google_calendar",
      "connected",
      scope,
      null,
      parsedSession.accessToken
    );

    let syncMessage = "Connected successfully.";
    try {
      const syncResult = await syncGoogleCalendar(parsedState.ownerId, parsedSession.accessToken);
      syncMessage = syncResult.summary;
    } catch (syncError) {
      await recordSyncEvent(
        parsedState.ownerId,
        "google_calendar",
        "google_calendar_sync",
        "error",
        "Connected but initial sync could not finish.",
        syncError.message,
        parsedSession.accessToken
      );
      syncMessage = `Connected, but initial sync needs attention: ${syncError.message}`;
    }

    return redirectWithCleanup(response, parsedState.returnPath || "/sync-settings", {
        connector: "google_calendar",
        status: "connected",
        message: syncMessage,
        expires_at: expiresAt || undefined
      });
  } catch (error) {
    return redirectWithCleanup(response, "/sync-settings", {
        connector: "google_calendar",
        status: "error",
        message: error.message
      });
  }
};
