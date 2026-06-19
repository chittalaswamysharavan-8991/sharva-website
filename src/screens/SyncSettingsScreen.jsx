import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Metric from "../components/Metric";
import { connectorStages, privacyRules } from "../privacy";

export default function SyncSettingsScreen({ auth, store, connectorControl, connectorReadiness }) {
  const accountByName = Object.fromEntries(
    connectorControl.accounts.map((account) => [account.connector_name, account])
  );
  const readinessByName = Object.fromEntries(
    connectorReadiness.connectors.map((connector) => [connector.name, connector])
  );
  const v3ConnectorKeys = ["google_calendar", "notion"];
  const [connectorNotice, setConnectorNotice] = useState(null);

  const formatSyncTime = (value) => {
    if (!value) return "No sync yet";
    const time = new Date(value);
    return Number.isNaN(time.getTime()) ? "No sync yet" : time.toLocaleString();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connector = params.get("connector");
    const status = params.get("status");
    const message = params.get("message");
    if (connector && status) {
      setConnectorNotice({
        connector,
        status,
        message: message || "Connector state updated."
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function startConnectorConnection(connectorName) {
    if (!auth.session?.access_token) {
      throw new Error("Missing signed-in session.");
    }

    const startRoute =
      connectorName === "google_calendar"
        ? "/api/google-calendar/oauth/start"
        : "/api/notion/oauth/start";
    const response = await fetch(startRoute, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accessToken: auth.session.access_token,
        returnPath: "/sync-settings"
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Unable to start connector authorization.");
    }

    window.location.assign(data.authorizationUrl);
  }

  const setupCards = [
    {
      title: "Supabase Google sign-in",
      lines: [
        "Supabase Dashboard > Authentication > Providers > Google",
        "Enable the provider and paste the Google client ID and secret",
        "Copy the Supabase callback URL from that page and use it in Google Cloud"
      ]
    },
    {
      title: "Google Calendar API",
      lines: [
        "Google Cloud Console > Google Auth platform > Clients > Create Client",
        "Choose Web application, add the app origin, and save the OAuth client",
        "Google Cloud Console > APIs & Services > Library > Google Calendar API > Enable"
      ]
    },
    {
      title: "Notion public connection",
      lines: [
        "Notion Developer portal > Build > Public connections > Create new connection",
        "Choose the installation scope and add the redirect URI",
        "Copy the Client ID and Client Secret from the Configuration tab"
      ]
    },
    {
      title: "App routes wired",
      lines: [
        "POST /api/google-calendar/oauth/start and /api/notion/oauth/start capture the owner session",
        "GET /api/google-calendar/oauth/callback and /api/notion/oauth/callback finish the OAuth handoff",
        "POST /api/google-calendar/sync and /api/notion/sync use the stored owner-scoped tokens"
      ]
    }
  ];

  const phaseCards = [
    {
      phase: "v2",
      title: "Supabase vault",
      body: "Owner allowlist, RLS, and vault persistence are live. Local browser storage is now only a cache."
    },
    {
      phase: "v3",
      title: "Notion + Calendar",
      body: "Next live context sources stay read-first: BuildOS pages, project status, free/busy, and daily planning."
    },
    {
      phase: "v4",
      title: "Drive + Make",
      body: "Proof assets and scenario evidence arrive after review so public case studies stay portfolio-safe."
    },
    {
      phase: "v5",
      title: "Gmail + restricted data",
      body: "Metadata only for email. Money and health remain excluded until a separate privacy review exists."
    }
  ];

  return (
    <section className="screen build-grid">
      {connectorNotice ? (
        <div
          className={
            connectorNotice.status === "connected" ? "panel-large success-banner" : "panel-large error-banner"
          }
        >
          <span className="eyebrow">{connectorNotice.connector.replace("_", " ")}</span>
          <h2>{connectorNotice.status === "connected" ? "Connector connected." : "Connector attention needed."}</h2>
          <p>{connectorNotice.message}</p>
        </div>
      ) : null}
      <div className="panel-large">
        <span className="eyebrow">v2 Vault Status</span>
        <h2>Authentication comes before connector sync.</h2>
        <p>The private cockpit is now designed to stay locked until Supabase Auth, RLS, and the allowlisted owner profile are active.</p>
        <div className="sync-status-grid">
          <Metric label="Auth provider" value={auth.configured ? "Ready" : "Setup"} />
          <Metric label="Owner profile" value={auth.profile?.is_enabled ? "Allowed" : "Locked"} />
          <Metric label="Vault state" value={store.syncMeta.status} />
        </div>
        {store.syncMeta.error ? <p className="auth-error">Vault error: {store.syncMeta.error}</p> : null}
        {store.syncMeta.lastSyncedAt ? (
          <p className="auth-notice">
            Last vault sync: {new Date(store.syncMeta.lastSyncedAt).toLocaleString()}
          </p>
        ) : null}
      </div>
      <div className="panel-large">
        <span className="eyebrow">Connector Phases</span>
        <h2>Build order stays explicit inside the cockpit.</h2>
        <div className="phase-grid">
          {phaseCards.map((card) => (
            <article key={card.phase} className="phase-card">
              <span>{card.phase}</span>
              <strong>{card.title}</strong>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="panel-large">
        <span className="eyebrow">v3 Readiness</span>
        <h2>Calendar and Notion show their server-side setup before live sync starts.</h2>
        <p>These checks stay visible so we can wire the first live sources in a controlled order and keep the privacy layer intact.</p>
        <div className="connector-state-grid">
          {v3ConnectorKeys.map((key) => {
            const readiness = readinessByName[key];
            const account = accountByName[key];
            const connector = connectorStages.find((item) => item.key === key);
            const label = key === "google_calendar" ? "Google Calendar" : "Notion BuildOS";
            const currentStatus = account?.status || connector?.status || "planned";
            const connectionState = account ? currentStatus : "not connected";
            const allowedData = connector?.scopes?.length ? connector.scopes.join(", ") : "No live scope allowed";
            const serverState = readiness?.serverConfigured
              ? "Server configured"
              : `Server setup required${
                  readiness?.missingEnv?.length ? `: ${readiness.missingEnv.join(", ")}` : ""
                }`;

            return (
              <article key={key} className={readiness?.serverConfigured ? "state-card ready" : "state-card"}>
                <span>{label}</span>
                <strong>{connectionState}</strong>
                <p>{serverState}</p>
                <small>Allowed data: {allowedData}</small>
                <small>Last sync: {formatSyncTime(account?.last_synced_at)}</small>
                <small>{readiness?.liveSyncEnabled ? "Live sync enabled" : "Read-only planning feed only"}</small>
              </article>
            );
          })}
        </div>
      </div>
      <div className="panel-large">
        <span className="eyebrow">Connector Rollout</span>
        <h2>Each connector earns permission separately.</h2>
        <div className="connector-list">
          {connectorStages.map((connector) => (
            <article key={connector.name}>
              <div>
                <strong>{connector.name}</strong>
                <p>
                  {connector.stage} / {accountByName[connector.key]?.status || connector.status}
                </p>
                <small>
                  {connector.scopes.length ? connector.scopes.join(", ") : "No live scope allowed"}
                </small>
                {readinessByName[connector.key] ? (
                  <small>
                    Server:{" "}
                    {readinessByName[connector.key].serverConfigured
                      ? "configured"
                      : `missing ${readinessByName[connector.key].missingEnv.join(", ")}`}
                  </small>
                ) : null}
              </div>
              <div className="connector-actions">
                <span>{connector.privacy}</span>
                {auth.configured && connector.stage !== "excluded" ? (
                  <>
                    {connector.key === "google_calendar" || connector.key === "notion" ? (
                      <button
                        onClick={() =>
                          startConnectorConnection(connector.key).catch((error) =>
                            setConnectorNotice({
                              connector: connector.key,
                              status: "error",
                              message: error.message
                            })
                          )
                        }
                      >
                        {accountByName[connector.key]?.status === "connected" ? "Reconnect" : "Connect"}
                      </button>
                    ) : null}
                    <button onClick={() => connectorControl.setConnectorStatus(connector.key, "paused")}>
                      Pause
                    </button>
                    <button
                      onClick={() =>
                        connectorControl.setConnectorStatus(
                          connector.key,
                          connector.key === "supabase_vault" ? "connected" : "planned"
                        )
                      }
                    >
                      Stage
                    </button>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="panel-large">
        <span className="eyebrow">Setup Guide</span>
        <h2>Tap-by-tap steps for the next live connector work.</h2>
        <p>The rollout now has a plain-language path for Supabase auth, Google Calendar, Notion, and the backend routes that still need to be added.</p>
        <div className="setup-grid">
          {setupCards.map((card) => (
            <article key={card.title} className="setup-card">
              <strong>{card.title}</strong>
              <ol>
                {card.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
      <div className="panel-large">
        <span className="eyebrow">Audit Trail</span>
        <h2>Sync events are visible before sync expands.</h2>
        {connectorControl.error ? <p className="auth-error">Connector control error: {connectorControl.error}</p> : null}
        <div className="audit-list">
          {connectorControl.events.length ? (
            connectorControl.events.map((event) => (
              <article key={event.id}>
                <span>
                  {event.connector_name} / {event.status}
                </span>
                <strong>{event.action}</strong>
                <p>{event.summary || event.error_message || "No summary"}</p>
              </article>
            ))
          ) : (
            <p>No Supabase audit events yet. They will appear after the owner vault is connected.</p>
          )}
        </div>
      </div>
      <div className="panel-large">
        <span className="eyebrow">Privacy Rules</span>
        <h2>Public output is approval-gated.</h2>
        <div className="privacy-stack">
          {privacyRules.map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </div>
      </div>
      <div className="panel-large">
        <span className="eyebrow">v5 Boundary</span>
        <h2>Gmail is metadata-first. Money and health are excluded.</h2>
        <p>
          Gmail sync should start with labels, counts, urgency buckets, and approved summaries. Money and health
          remain manual summaries until a separate security review exists.
        </p>
      </div>
    </section>
  );
}
