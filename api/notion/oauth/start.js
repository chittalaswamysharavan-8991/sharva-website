const {
  buildConnectorSessionCookie,
  buildNotionAuthorizationUrl,
  getVerifiedOwner,
  normalizeReturnPath,
  signConnectorSession,
  signConnectorState
} = require("../../_lib/connector-auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const accessToken =
      request.body?.accessToken ||
      request.headers.authorization?.replace(/^Bearer\s+/i, "") ||
      "";
    const returnPath = normalizeReturnPath(request.body?.returnPath);
    const { user } = await getVerifiedOwner(accessToken);

    const state = signConnectorState({
      connectorName: "notion",
      ownerId: user.id,
      returnPath
    });
    const session = signConnectorSession({
      connectorName: "notion",
      ownerId: user.id,
      accessToken,
      returnPath
    });
    response.setHeader("Set-Cookie", buildConnectorSessionCookie(session));

    return response.status(200).json({
      connector: "notion",
      authorizationUrl: buildNotionAuthorizationUrl(state),
      stateExpiresIn: 900
    });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
};
