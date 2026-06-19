import { requireSupabase } from "./supabaseClient";
import { PRIVACY_CLASS } from "./privacy";

const itemTypeByKey = {
  captures: "capture",
  todayTasks: "today_task",
  proofChecklist: "proof_item",
  nightClose: "night_close",
  projects: "project",
  bodyLogs: "body_summary",
  invoices: "money_summary"
};

const keyByItemType = Object.fromEntries(
  Object.entries(itemTypeByKey).map(([key, itemType]) => [itemType, key])
);

function titleForItem(item, key) {
  if (item.title) return item.title;
  if (item.label) return item.label;
  if (item.name) return item.name;
  if (item.text) return item.text.slice(0, 72);
  return key;
}

function privacyForItem(item) {
  return item.privacyClass || item.privacy_class || PRIVACY_CLASS.PRIVATE_SUMMARY;
}

export function stateToRows(ownerId, state) {
  return Object.entries(itemTypeByKey).flatMap(([key, itemType]) => {
    const items = Array.isArray(state[key]) ? state[key] : [];
    return items.map((item) => ({
      owner_id: ownerId,
      item_type: itemType,
      external_id: item.id,
      title: titleForItem(item, key),
      payload: item,
      privacy_class: privacyForItem(item),
      public_approved: item.publicApproved === true || item.public_approved === true
    }));
  });
}

export function rowsToState(defaultState, rows) {
  const nextState = { ...defaultState };

  Object.keys(itemTypeByKey).forEach((key) => {
    nextState[key] = [];
  });

  rows.forEach((row) => {
    const key = keyByItemType[row.item_type];
    if (!key) return;
    const payload = row.payload || {};
    nextState[key].push({
      ...payload,
      id: payload.id || row.external_id || row.id,
      privacyClass: payload.privacyClass || row.privacy_class
    });
  });

  Object.keys(itemTypeByKey).forEach((key) => {
    if (!nextState[key].length) {
      nextState[key] = defaultState[key];
    }
  });

  return nextState;
}

export async function loadVaultState(ownerId, defaultState) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("cockpit_items")
    .select("id,item_type,external_id,title,payload,privacy_class,public_approved,updated_at")
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: true });

  if (error) throw error;
  if (!data?.length) return defaultState;
  return rowsToState(defaultState, data);
}

export async function saveVaultState(ownerId, state) {
  const client = requireSupabase();
  const rows = stateToRows(ownerId, state);
  if (!rows.length) return;

  const { error } = await client
    .from("cockpit_items")
    .upsert(rows, { onConflict: "owner_id,item_type,external_id" });

  if (error) throw error;
}

export async function writeSyncEvent(ownerId, event) {
  const client = requireSupabase();
  const { error } = await client.from("sync_events").insert({
    owner_id: ownerId,
    connector_name: event.connectorName || "supabase_vault",
    action: event.action,
    privacy_class: event.privacyClass || PRIVACY_CLASS.PRIVATE_SUMMARY,
    status: event.status,
    summary: event.summary,
    error_message: event.errorMessage || null
  });

  if (error) throw error;
}

export async function loadConnectorAccounts(ownerId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("connector_accounts")
    .select("id,connector_name,status,scopes,last_synced_at,updated_at")
    .eq("owner_id", ownerId)
    .order("connector_name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function upsertConnectorConsent(ownerId, connector) {
  const client = requireSupabase();
  const { error } = await client.from("connector_accounts").upsert(
    {
      owner_id: ownerId,
      connector_name: connector.connectorName,
      status: connector.status,
      scopes: connector.scopes || [],
      token_reference: connector.tokenReference || null
    },
    { onConflict: "owner_id,connector_name" }
  );

  if (error) throw error;
}

export async function loadSyncEvents(ownerId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("sync_events")
    .select("id,connector_name,action,privacy_class,status,summary,error_message,created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) throw error;
  return data || [];
}
