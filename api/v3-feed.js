const v3Connectors = [
  {
    key: "google_calendar",
    label: "Google Calendar",
    role: "calendar",
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
  },
  {
    key: "notion",
    label: "Notion BuildOS",
    role: "notion",
    requiredEnv: ["NOTION_CLIENT_ID", "NOTION_CLIENT_SECRET"]
  }
];

const planningSnapshot = {
  todayFocus: {
    label: "Today focus block",
    title: "Make.com Project 3: Error Handling + Failure Alert System",
    meta: "10:00 AM - 9:00 PM / Google Calendar",
    body: "One full-day build block. Keep the monitor route, Telegram alert, Google Sheets log, and clear action note aligned with the proof checklist."
  },
  buildosUpdate: {
    label: "BuildOS note",
    title: "Pablo Cockpit is now on the v3 connector roadmap",
    meta: "Notion / documentation layer",
    body: "The live auth vault is verified, the roadmap is documented, and the next approved connector order is Notion and Calendar before Drive, Make, and Gmail metadata."
  },
  tomorrowFocus: {
    label: "Tomorrow block",
    title: "Make.com Project 4: Invoice / Payment Reminder Tracker",
    meta: "10:00 AM - 9:00 PM / Google Calendar",
    body: "Due-soon reminders, overdue Telegram alerts, and reminder logging become the next proof unit after today's failure monitor is done."
  }
};

module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const connectors = v3Connectors.map((connector) => {
    const missing = connector.requiredEnv.filter((key) => !process.env[key]);
    return {
      key: connector.key,
      label: connector.label,
      role: connector.role,
      serverConfigured: missing.length === 0,
      missingEnv: missing,
      liveSyncEnabled: false
    };
  });

  return response.status(200).json({
    generatedAt: new Date().toISOString(),
    status: "ready",
    connectors,
    sources: [
      {
        type: "calendar",
        label: "Google Calendar",
        title: planningSnapshot.todayFocus.title,
        when: "2026-06-18T10:00:00+05:30 to 2026-06-18T21:00:00+05:30",
        note: planningSnapshot.todayFocus.body
      },
      {
        type: "notion",
        label: "BuildOS",
        title: "Pablo Cockpit - Private Website v1",
        when: "2026-06-18T06:20:34.248Z",
        note: planningSnapshot.buildosUpdate.body
      }
    ],
    ...planningSnapshot
  });
};
