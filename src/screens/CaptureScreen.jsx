import React, { useState } from "react";
import { Send, Command, CheckCircle2, X } from "lucide-react";
import { PRIVACY_CLASS } from "../privacy";
import Panel from "../components/Panel";

export default function CaptureScreen({ store }) {
  const [value, setValue] = useState("");
  const [route, setRoute] = useState("Inbox");
  const [privacyClass, setPrivacyClass] = useState(PRIVACY_CLASS.PRIVATE_SUMMARY);
  const [filter, setFilter] = useState("All");
  const captures = store.state.captures;
  const visible = filter === "All" ? captures : captures.filter((item) => item.route === filter);

  function submitCapture(event) {
    event.preventDefault();
    if (!value.trim()) return;
    const capture = {
      id: `cap-${Date.now()}`,
      text: value.trim(),
      route,
      status: route === "Inbox" ? "open" : "routed",
      privacyClass,
      createdAt: "Now"
    };
    store.update("captures", [capture, ...captures]);
    setValue("");
    setRoute("Inbox");
    setPrivacyClass(PRIVACY_CLASS.PRIVATE_SUMMARY);
  }

  function removeCapture(id) {
    store.update(
      "captures",
      captures.filter((item) => item.id !== id)
    );
  }

  function markRouted(id) {
    store.update(
      "captures",
      captures.map((item) => (item.id === id ? { ...item, status: "routed" } : item))
    );
  }

  return (
    <section className="screen capture-layout">
      <form className="capture-composer" onSubmit={submitCapture}>
        <span className="eyebrow">Fast Capture</span>
        <h2>Raw truth first. Routing later.</h2>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type messy notes, blockers, proof updates, body signals, money reminders..."
        />
        <div className="composer-row">
          <select value={route} onChange={(event) => setRoute(event.target.value)} aria-label="Capture route">
            {["Inbox", "Today", "Build Lab", "Memory", "Body", "Money", "Night Close"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={privacyClass}
            onChange={(event) => setPrivacyClass(event.target.value)}
            aria-label="Privacy class"
          >
            {Object.values(PRIVACY_CLASS).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="submit">
            <Send size={17} /> Capture
          </button>
        </div>
      </form>
      <Panel icon={Command} title="Routing Preview" tone="green">
        Pablo routes captures into action shelves. Unclear thoughts stay in Inbox, so capture never waits for
        perfect structure.
      </Panel>
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
