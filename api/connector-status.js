const CONNECTORS = [
  "supabase_vault",
  "notion",
  "google_calendar",
  "google_drive",
  "make",
  "gmail"
];

const requiredEnv = {
  supabase_vault: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
  notion: ["NOTION_CLIENT_ID", "NOTION_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"],
  google_calendar: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"],
  google_drive: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"],
  make: ["MAKE_API_TOKEN"],
  gmail: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"]
};

module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const connectors = CONNECTORS.map((name) => {
    const missing = requiredEnv[name].filter((key) => !process.env[key]);
    return {
      name,
      serverConfigured: missing.length === 0,
      missingEnv: missing,
      liveSyncEnabled: name === "supabase_vault" && missing.length === 0
    };
  });

  return response.status(200).json({
    policy: "Supabase public client variables may be exposed to the browser. Connector secrets and the connector state secret stay server-side. Live provider sync remains disabled until explicit OAuth and privacy filters are implemented.",
    connectors
  });
};
