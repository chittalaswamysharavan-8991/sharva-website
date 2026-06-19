import React from "react";
import { Archive } from "lucide-react";

const researchNotes = [
  "Daily app should ask for a next action, not a full life review.",
  "Capture must be faster than organizing; routing can happen after.",
  "Dashboards should show position, length, and grouping before decorative detail.",
  "iPhone use needs home-screen launch, touch-safe controls, and offline-friendly shell."
];

export default function MemoryScreen({ store }) {
  return (
    <section className="screen two-column">
      <div className="panel-large">
        <span className="eyebrow">Memory Layer</span>
        <h2>Stable facts, decisions, and proof stay searchable.</h2>
        <p>
          Use Memory for operating rules, project decisions, proof links, and source-backed learnings. Private raw
          logs stay out of public pages.
        </p>
        <div className="research-list">
          {researchNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
      <div className="panel-large">
        <h2>Recent routed memory</h2>
        {store.state.captures
          .filter((item) => item.route === "Memory")
          .map((item) => (
            <article className="memory-row" key={item.id}>
              <Archive size={16} />
              <p>{item.text}</p>
            </article>
          ))}
      </div>
    </section>
  );
}
