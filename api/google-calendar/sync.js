const { getVerifiedOwner, syncGoogleCalendar } = require("../_lib/connector-auth");

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
    const { user } = await getVerifiedOwner(accessToken);
    const result = await syncGoogleCalendar(user.id, accessToken);
    return response.status(200).json({
      connector: "google_calendar",
      status: "synced",
      ...result
    });
  } catch (error) {
    return response.status(400).json({
      connector: "google_calendar",
      status: "error",
      error: error.message
    });
  }
};
