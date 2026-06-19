import React from "react";
import { RotateCcw, CheckCircle2, Moon } from "lucide-react";

export default function NightCloseScreen({ store }) {
  const items = store.state.nightClose;

  function toggle(id) {
    store.update(
      "nightClose",
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  return (
    <section className="screen two-column">
      <div className="panel-large">
        <span className="eyebrow">Night Close</span>
        <h2>End the day by reducing tomorrow's noise.</h2>
        <p>Close only what matters: proof, open loops, tomorrow's first move, and privacy check.</p>
        <button className="secondary-button" onClick={store.reset}>
          <RotateCcw size={16} /> Reset demo data
        </button>
      </div>
      <div className="panel-large close-list">
        {items.map((item, index) => (
          <label key={item.id} className={item.done ? "close-row done" : "close-row"}>
            <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
            {index === 0 ? <CheckCircle2 size={17} /> : <Moon size={17} />}
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
