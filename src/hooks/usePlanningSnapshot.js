import { useEffect, useState } from "react";

export const planningSnapshot = {
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

export function usePlanningSnapshot() {
  const [snapshot, setSnapshot] = useState({
    status: "loading",
    error: null,
    data: planningSnapshot
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/v3-feed");
        if (!response.ok) throw new Error(`Planning feed unavailable (${response.status})`);
        const data = await response.json();
        if (!cancelled) {
          setSnapshot({ status: "loaded", error: null, data });
        }
      } catch (error) {
        if (!cancelled) {
          setSnapshot((current) => ({
            ...current,
            status: "fallback",
            error: error.message,
            data: planningSnapshot
          }));
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return snapshot;
}
