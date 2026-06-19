import { useEffect, useState } from "react";
import {
  loadConnectorAccounts,
  loadSyncEvents,
  upsertConnectorConsent,
  writeSyncEvent
} from "../dataVault";
import { PRIVACY_CLASS, connectorStages } from "../privacy";

export function useConnectorControl(auth) {
  const [control, setControl] = useState({
    accounts: [],
    events: [],
    status: auth.isUnlocked ? "pending" : "local",
    error: null
  });

  useEffect(() => {
    if (!auth.isUnlocked || !auth.user?.id) {
      setControl({ accounts: [], events: [], status: "local", error: null });
      return undefined;
    }

    let cancelled = false;
    const ownerId = auth.user.id;

    async function load() {
      try {
        setControl((current) => ({ ...current, status: "loading", error: null }));
        const [accounts, events] = await Promise.all([
          loadConnectorAccounts(ownerId),
          loadSyncEvents(ownerId)
        ]);
        if (!cancelled) {
          setControl({ accounts, events, status: "loaded", error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setControl((current) => ({ ...current, status: "error", error: error.message }));
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [auth.isUnlocked, auth.user?.id]);

  async function setConnectorStatus(connectorName, status) {
    if (!auth.isUnlocked || !auth.user?.id) return;
    const stage = connectorStages.find((connector) => connector.key === connectorName);
    try {
      setControl((current) => ({ ...current, status: "saving", error: null }));
      await upsertConnectorConsent(auth.user.id, {
        connectorName,
        status,
        scopes: stage?.scopes || []
      });
      await writeSyncEvent(auth.user.id, {
        connectorName,
        action: `connector_${status}`,
        status: "success",
        privacyClass: stage?.privacy || PRIVACY_CLASS.PRIVATE_SUMMARY,
        summary: `${stage?.name || connectorName} marked ${status}.`
      });
      const [accounts, events] = await Promise.all([
        loadConnectorAccounts(auth.user.id),
        loadSyncEvents(auth.user.id)
      ]);
      setControl({ accounts, events, status: "loaded", error: null });
    } catch (error) {
      setControl((current) => ({ ...current, status: "error", error: error.message }));
    }
  }

  return { ...control, setConnectorStatus };
}
