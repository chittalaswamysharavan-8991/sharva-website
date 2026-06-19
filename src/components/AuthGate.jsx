import React from "react";
import { CloudOff, Lock, UserCheck } from "lucide-react";
import { privacyRules } from "../privacy";
import ReadinessPanel from "./ReadinessPanel";

export default function AuthGate({ auth, connectorReadiness }) {
  const supabaseReadiness = connectorReadiness.connectors.find((connector) => connector.name === "supabase_vault");

  if (!auth.configured) {
    return (
      <section className="screen auth-gate">
        <div className="auth-card">
          <CloudOff size={30} />
          <span className="eyebrow">Private Cockpit Locked</span>
          <h2>Supabase is not configured yet.</h2>
          <p>
            Private routes are intentionally closed until the v2 vault is connected. Add `VITE_SUPABASE_URL` and
            `VITE_SUPABASE_ANON_KEY`, run the schema migration, and allowlist your user profile.
          </p>
          <ReadinessPanel readiness={connectorReadiness} primaryConnector={supabaseReadiness} />
          <div className="privacy-stack">
            {privacyRules.map((rule) => (
              <p key={rule}>{rule}</p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="screen auth-gate">
      <div className="auth-card">
        <Lock size={30} />
        <span className="eyebrow">Owner Authentication</span>
        <h2>
          {auth.loading
            ? "Checking private access..."
            : "Continue with Google to open Pablo Cockpit."}
        </h2>
        <p>
          Google OAuth is the v2 gate. The database allowlist and RLS policies decide whether the account can open
          private routes.
        </p>
        <ReadinessPanel readiness={connectorReadiness} primaryConnector={supabaseReadiness} />
        <button type="button" onClick={auth.signInWithGoogle} disabled={auth.loading}>
          <UserCheck size={17} />
          Continue with Google
        </button>
        {auth.error ? <p className="auth-error">{auth.error}</p> : null}
        {auth.notice ? <p className="auth-notice">{auth.notice}</p> : null}
      </div>
    </section>
  );
}
