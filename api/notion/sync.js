const { getVerifiedOwner, syncNotion } = require("../_lib/connector-auth");

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
    const result = await syncNotion(user.id, accessToken);
    return response.status(200).json({
      connector: "notion",
      status: "synced",
      ...result
    });
  } catch (error) {
    return response.status(400).json({
      connector: "notion",
      status: "error",
      error: error.message
    });
  }
};
