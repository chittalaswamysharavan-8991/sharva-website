export const PRIVACY_CLASS = {
  PUBLIC: "public",
  PRIVATE_SUMMARY: "private_summary",
  SENSITIVE: "sensitive",
  BLOCKED_PUBLIC: "blocked_public"
};

export const privacyRules = [
  "Public pages can read only approved portfolio records.",
  "Private cockpit summaries require a signed-in, allowlisted owner.",
  "Sensitive connector tokens never enter browser state.",
  "Raw Gmail, money, health, family, address, token, and phone data stays blocked from public routes."
];

export const connectorStages = [
  { key: "supabase_vault", name: "Supabase Vault", stage: "v2", status: "foundation", privacy: PRIVACY_CLASS.SENSITIVE, scopes: ["auth", "database", "rls"] },
  { key: "notion", name: "Notion BuildOS", stage: "v3", status: "planned", privacy: PRIVACY_CLASS.PRIVATE_SUMMARY, scopes: ["buildos_pages", "docs_writeback"] },
  { key: "google_calendar", name: "Google Calendar", stage: "v3", status: "planned", privacy: PRIVACY_CLASS.PRIVATE_SUMMARY, scopes: ["calendar_blocks", "free_busy_summary"] },
  { key: "google_drive", name: "Google Drive", stage: "v4", status: "planned", privacy: PRIVACY_CLASS.PRIVATE_SUMMARY, scopes: ["proof_asset_links"] },
  { key: "make", name: "Make.com", stage: "v4", status: "planned", privacy: PRIVACY_CLASS.PRIVATE_SUMMARY, scopes: ["scenario_run_summaries", "webhook_status"] },
  { key: "gmail", name: "Gmail metadata", stage: "v5", status: "restricted", privacy: PRIVACY_CLASS.SENSITIVE, scopes: ["labels", "counts", "thread_ids", "approved_summaries"] },
  { key: "money", name: "Money connectors", stage: "excluded", status: "manual only", privacy: PRIVACY_CLASS.BLOCKED_PUBLIC, scopes: [] },
  { key: "health", name: "Health connectors", stage: "excluded", status: "manual only", privacy: PRIVACY_CLASS.BLOCKED_PUBLIC, scopes: [] }
];
