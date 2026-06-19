const allowedConnectors = new Set([
  "notion",
  "google_calendar",
  "google_drive",
  "make",
  "gmail"
]);

module.exports = function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const connector = request.body?.connector;
  if (!allowedConnectors.has(connector)) {
    return response.status(400).json({ error: "Unsupported connector" });
  }

  return response.status(501).json({
    connector,
    status: "not_implemented",
    reason: "Live connector sync is intentionally blocked until OAuth, token storage, provider scopes, and per-connector privacy filters are implemented server-side."
  });
};
