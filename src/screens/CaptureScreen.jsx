import React, { useState } from "react";
import { Send, Command, CheckCircle2, X } from "lucide-react";
import { PRIVACY_CLASS } from "../privacy";
import Panel from "../components/Panel";

export default function CaptureScreen({ store, navigate }) {
  const [value, setValue] = useState("");
  const [route, setRoute] = useState("Inbox");
  const [privacyClass, setPrivacyClass] = useState(PRIVACY_CLASS.PRIVATE_SUMMARY);
  const [filter, setFilter] = useState("All");
  const captures = store.state.captures;
  const visible = filter === "All" ? captures : captures.filter((item) => item.route === filter);
  const syncMeta = store.syncMeta;
  const [lastSubmittedId, setLastSubmittedId] = useState(null);

  const routeOptions = ["Inbox", "Today", "Build Lab", "Memory", "Body", "Money", "Night Close"];
  const privacyOptions = [
    { label: "Private cockpit only", value: PRIVACY_CLASS.PRIVATE_SUMMARY },
    { label: "Sensitive", value: PRIVACY_CLASS.SENSITIVE },
    { label: "Public-safe note", value: PRIVACY_CLASS.PUBLIC }
  ];

  const handleTextChange = (e) => {
    setValue(e.target.value);
    if (lastSubmittedId) {
      setLastSubmittedId(null);
    }
  };

  function submitCapture(event) {
    event.preventDefault();
    if (!value.trim()) return;
    const id = `cap-${Date.now()}`;
    const capture = {
      id,
      text: value.trim(),
      route,
      status: route === "Inbox" ? "open" : "routed",
      privacyClass,
      createdAt: "Now"
    };
    store.update("captures", [capture, ...captures]);
    setValue("");
    setLastSubmittedId(id);
  }

  function removeCapture(id) {
    store.update(
      "captures",
      captures.filter((item) => item.id !== id)
    );
    if (lastSubmittedId === id) {
      setLastSubmittedId(null);
    }
  }

  function markRouted(id) {
    store.update(
      "captures",
      captures.map((item) => (item.id === id ? { ...item, status: "routed" } : item))
    );
  }

  return (
    <section className="screen capture-layout">
      <div className="capture-main-col">
        <form className="capture-composer" onSubmit={submitCapture}>
          <span className="eyebrow">Quick Capture</span>
          <h2>Save a thought, task, log, or follow-up into your private cockpit.</h2>
          <textarea
            value={value}
            onChange={handleTextChange}
            placeholder="Type messy notes, blockers, proof updates, body signals, money reminders...&#10;&#10;Examples:&#10;• follow up on portfolio proof&#10;• water 250 ml&#10;• check Upwork lead tomorrow"
          />
          
          <div className="composer-section">
            <label className="section-label">Where will this go?</label>
            <div className="chips-row">
              {routeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={route === opt ? "chip active" : "chip"}
                  onClick={() => {
                    setRoute(opt);
                    if (lastSubmittedId) setLastSubmittedId(null);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="composer-section">
            <label className="section-label">Privacy level</label>
            <div className="chips-row">
              {privacyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={privacyClass === opt.value ? "chip active" : "chip"}
                  onClick={() => {
                    setPrivacyClass(opt.value);
                    if (lastSubmittedId) setLastSubmittedId(null);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="composer-action-row">
            <button type="submit" className="primary-button capture-submit-btn">
              <Send size={17} /> Capture
            </button>
            
            {syncMeta.status === "saving" && (
              <span className="sync-status-badge saving">Saving to vault...</span>
            )}
            {(syncMeta.status === "synced" || syncMeta.status === "loaded") && (
              <span className="sync-status-badge synced">Saved to vault</span>
            )}
            {syncMeta.status === "error" && (
              <span className="sync-status-badge error">Sync failed: {syncMeta.error}</span>
            )}
            {syncMeta.status === "local" && (
              <span className="sync-status-badge offline">Saved locally (offline)</span>
            )}
          </div>
        </form>

        {lastSubmittedId && (
          <div className="post-save-actions-card">
            <div className="post-save-header">
              <CheckCircle2 className="success-icon" size={20} />
              <div>
                <h4>Capture saved successfully!</h4>
                <p>{syncMeta.status === "saving" ? "Writing changes to Supabase vault..." : "Synced and secure in your private vault."}</p>
              </div>
            </div>
            <div className="post-save-buttons">
              <button className="post-save-btn primary" onClick={() => setLastSubmittedId(null)}>
                Add another
              </button>
              <button className="post-save-btn secondary" onClick={() => navigate("/today")}>
                View Today
              </button>
              <button className="post-save-btn secondary" onClick={() => navigate("/memory")}>
                View Memory
              </button>
              <button className="post-save-btn secondary" onClick={() => navigate("/night-close")}>
                Night Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="capture-sidebar">
        <Panel icon={Command} title="Routing Preview" tone="green">
          Pablo routes captures into action shelves. Unclear thoughts stay in Inbox, so capture never waits for
          perfect structure.
        </Panel>
      </div>

      <div className="panel-list capture-list">
        <div className="list-header">
          <h3>Recent Captures</h3>
          <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter captures">
            {["All", "Inbox", "Today", "Build Lab", "Memory", "Body", "Money", "Night Close"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        {visible.map((item) => (
          <article key={item.id} className="capture-item">
            <div>
              <span>
                {item.createdAt} / {item.route} / {item.privacyClass ?? PRIVACY_CLASS.PRIVATE_SUMMARY}
              </span>
              <p>{item.text}</p>
            </div>
            <div className="row-actions">
              {item.status !== "routed" ? (
                <button onClick={() => markRouted(item.id)} title="Mark routed">
                  <CheckCircle2 size={16} />
                </button>
              ) : null}
              <button onClick={() => removeCapture(item.id)} title="Delete capture">
                <X size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
