import { useEffect, useRef, useState } from "react";
import {
  loadVaultState,
  saveVaultState,
  writeSyncEvent
} from "../dataVault";
import { PRIVACY_CLASS } from "../privacy";

const STORAGE_VERSION = "pablo-cockpit-v2";

export const defaultState = {
  captures: [
    {
      id: "cap-proof-video",
      text: "Project proof still needs the short walkthrough video.",
      route: "Build Lab",
      status: "open",
      privacyClass: PRIVACY_CLASS.PRIVATE_SUMMARY,
      createdAt: "Today"
    },
    {
      id: "cap-inbox-boundary",
      text: "Inbox can be summarized as pressure only; raw email content stays out.",
      route: "Memory",
      status: "routed",
      privacyClass: PRIVACY_CLASS.SENSITIVE,
      createdAt: "Yesterday"
    }
  ],
  todayTasks: [
    { id: "scenario", label: "Finish failure route", done: false },
    { id: "alert", label: "Capture Telegram alert proof", done: false },
    { id: "log", label: "Confirm error log row", done: false },
    { id: "walkthrough", label: "Record 60-90 second walkthrough", done: false },
    { id: "close", label: "Choose tomorrow's first action", done: false }
  ],
  proofChecklist: [
    { id: "canvas", label: "Scenario canvas screenshot", done: true },
    { id: "input", label: "Input data screenshot", done: true },
    { id: "output", label: "Output result screenshot", done: false },
    { id: "alert", label: "Telegram or Gmail proof", done: false },
    { id: "video", label: "60-90 second demo video", done: false },
    { id: "case", label: "One-page case study", done: false }
  ],
  nightClose: [
    { id: "evidence", label: "Build evidence captured", done: false },
    { id: "loops", label: "Open loops named", done: false },
    { id: "tomorrow", label: "Tomorrow focus chosen", done: false },
    { id: "privacy", label: "Private details protected", done: true }
  ],
  projects: [
    {
      id: "project-3",
      title: "Project 3",
      name: "Error Handling + Failure Alert System",
      status: "Today",
      stage: "Testing",
      privacyClass: PRIVACY_CLASS.PRIVATE_SUMMARY,
      proof: "Failure route, Telegram alert, error log",
      clientValue: "Keeps automations honest when something breaks.",
      proofChecklist: [
        { id: "canvas", label: "Scenario canvas screenshot", done: true },
        { id: "input", label: "Input data screenshot", done: true },
        { id: "output", label: "Output result screenshot", done: false },
        { id: "alert", label: "Telegram or Gmail alert proof", done: false },
        { id: "video", label: "60-90 second demo video", done: false }
      ]
    },
    {
      id: "project-4",
      title: "Project 4",
      name: "Invoice / Payment Reminder Tracker",
      status: "Next",
      stage: "Design",
      privacyClass: PRIVACY_CLASS.PRIVATE_SUMMARY,
      proof: "Due reminders, overdue alerts, reminder log",
      clientValue: "Turns missed follow-ups into visible, timed action.",
      proofChecklist: [
        { id: "due_rem", label: "Due reminders logic check", done: false },
        { id: "tg_alert", label: "Overdue Telegram alert test", done: false },
        { id: "rem_log", label: "Reminder sheet log row check", done: false }
      ]
    },
    {
      id: "project-5",
      title: "Project 5",
      name: "Daily Business Summary Automation",
      status: "Queued",
      stage: "Backlog",
      privacyClass: PRIVACY_CLASS.PRIVATE_SUMMARY,
      proof: "Daily digest, summary log, clean empty states",
      clientValue: "Gives owners one calm operating summary per day.",
      proofChecklist: [
        { id: "digest_trig", label: "Daily digest trigger check", done: false },
        { id: "summary_log", label: "Summary sheet log check", done: false },
        { id: "empty_state", label: "Empty state handler verification", done: false }
      ]
    }
  ],
  bodyLogs: [
    {
      id: "body-today",
      energy: 7,
      sleep: 8,
      water: 3,
      gym: false,
      loggedAt: "Today"
    }
  ],
  invoices: [
    {
      id: "inv-1",
      client: "Acme Corp Automation",
      category: "Make.com Development",
      dueDate: "2026-06-25",
      amountSimulated: 1200,
      status: "Sent"
    },
    {
      id: "inv-2",
      client: "BuildOS Integration Partner",
      category: "API Connector Audit",
      dueDate: "2026-06-12",
      amountSimulated: 850,
      status: "Paid"
    },
    {
      id: "inv-3",
      client: "Sharavan Automates LLC",
      category: "Google Calendar Sync Tool",
      dueDate: "2026-06-18",
      amountSimulated: 450,
      status: "Pending"
    }
  ]
};

export function useCockpitState(auth) {
  const storageOwner = auth.isUnlocked ? auth.user.id : "locked";
  const storageKey = `${STORAGE_VERSION}:${storageOwner}`;
  const vaultEnabled = Boolean(auth.isUnlocked && auth.configured);
  const saveTimer = useRef(null);
  const hydratedOwner = useRef(null);
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setState(raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState);
    } catch {
      setState(defaultState);
    }
  }, [storageKey]);

  useEffect(() => {
    if (storageOwner !== "locked") {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, storageKey, storageOwner]);

  const [syncMeta, setSyncMeta] = useState({
    mode: vaultEnabled ? "supabase" : "local",
    status: vaultEnabled ? "pending" : "local",
    error: null,
    lastSyncedAt: null
  });

  useEffect(() => {
    setSyncMeta((current) => ({
      ...current,
      mode: vaultEnabled ? "supabase" : "local",
      status: vaultEnabled ? "pending" : "local",
      error: null
    }));
  }, [vaultEnabled, storageOwner]);

  useEffect(() => {
    if (!vaultEnabled || !auth.user?.id) return undefined;
    let cancelled = false;
    const ownerId = auth.user.id;

    async function hydrateVault() {
      try {
        setSyncMeta((current) => ({ ...current, status: "loading", error: null }));
        const vaultState = await loadVaultState(ownerId, defaultState);
        if (cancelled) return;
        hydratedOwner.current = ownerId;
        setState(vaultState);
        window.localStorage.setItem(storageKey, JSON.stringify(vaultState));
        setSyncMeta({
          mode: "supabase",
          status: "loaded",
          error: null,
          lastSyncedAt: new Date().toISOString()
        });
        await writeSyncEvent(ownerId, {
          action: "vault_load",
          status: "success",
          summary: "Loaded private cockpit state from Supabase vault."
        });
      } catch (error) {
        if (!cancelled) {
          setSyncMeta({
            mode: "supabase",
            status: "error",
            error: error.message,
            lastSyncedAt: null
          });
        }
      }
    }

    hydrateVault();

    return () => {
      cancelled = true;
    };
  }, [auth.user?.id, storageKey, vaultEnabled]);

  useEffect(() => {
    if (!vaultEnabled || !auth.user?.id || hydratedOwner.current !== auth.user.id) return undefined;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    const ownerId = auth.user.id;

    saveTimer.current = window.setTimeout(async () => {
      try {
        setSyncMeta((current) => ({ ...current, status: "saving", error: null }));
        await saveVaultState(ownerId, state);
        await writeSyncEvent(ownerId, {
          action: "vault_save",
          status: "success",
          summary: "Saved private cockpit state to Supabase vault."
        });
        setSyncMeta({
          mode: "supabase",
          status: "synced",
          error: null,
          lastSyncedAt: new Date().toISOString()
        });
      } catch (error) {
        setSyncMeta((current) => ({
          ...current,
          status: "error",
          error: error.message
        }));
        try {
          await writeSyncEvent(ownerId, {
            action: "vault_save",
            status: "error",
            summary: "Failed saving private cockpit state to Supabase vault.",
            errorMessage: error.message
          });
        } catch {
          // Preserve UI error from the failed save; secondary audit failure is not user-actionable here.
        }
      }
    }, 650);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [auth.user?.id, state, vaultEnabled]);

  function update(key, value) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setState(defaultState);
  }

  return { state, update, reset, syncMeta };
}
