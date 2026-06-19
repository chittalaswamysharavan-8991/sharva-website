import React from "react";

export default function ReadinessPanel({ readiness, primaryConnector }) {
  if (readiness.status === "loading") {
    return <p className="auth-notice">Checking production auth readiness...</p>;
  }

  if (readiness.error) {
    return <p className="auth-error">Readiness check unavailable: {readiness.error}</p>;
  }

  return (
    <div className="readiness-panel">
      <div>
        <strong>Supabase vault</strong>
        <span>
          {primaryConnector?.serverConfigured ? "Production env ready" : "Production env missing"}
        </span>
      </div>
      {primaryConnector?.missingEnv?.length ? (
        <p>Missing: {primaryConnector.missingEnv.join(", ")}</p>
      ) : (
        <p>Next: sign in with the allowlisted owner account and verify vault sync.</p>
      )}
    </div>
  );
}
