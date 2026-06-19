import React from "react";

export default function SourceStrip({ planning, planningStatus }) {
  const sources = planning?.sources || [];
  const connectors = planning?.connectors || [];

  return (
    <div className="source-strip">
      <div className="source-strip-meta">
        <span>{planningStatus === "loaded" ? "Live snapshot" : "Cached snapshot"}</span>
        <small>
          {planning?.generatedAt
            ? `Refreshed ${new Date(planning.generatedAt).toLocaleString()}`
            : "Refresh timestamp unavailable"}
        </small>
      </div>
      {connectors.length ? (
        <div className="connector-rail">
          {connectors.map((connector) => (
            <div
              key={connector.key}
              className={connector.serverConfigured ? "connector-chip ready" : "connector-chip"}
            >
              <strong>{connector.label}</strong>
              <span>
                {connector.serverConfigured
                  ? "ready to wire"
                  : `missing ${connector.missingEnv.join(", ")}`}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="source-pills" aria-label="Planning sources">
        {sources.map((source) => (
          <article
            key={`${source.type}-${source.title}`}
            className={`source-pill tone-${source.type === "calendar" ? "green" : "teal"}`}
          >
            <span>{source.label}</span>
            <strong>{source.title}</strong>
            <p>{source.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
