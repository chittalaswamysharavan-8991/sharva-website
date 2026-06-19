import React from "react";
import { Plus, Gauge, Compass } from "lucide-react";
import FocusTimer from "../components/FocusTimer";
import SourceStrip from "../components/SourceStrip";
import Panel from "../components/Panel";
import { planningSnapshot } from "../hooks/usePlanningSnapshot";

export default function TodayScreen({ store, navigate, planningSnapshotState }) {
  const tasks = store.state.todayTasks;
  const doneCount = tasks.filter((task) => task.done).length;
  const planning = planningSnapshotState?.data ?? planningSnapshot;
  const planningStatus = planningSnapshotState?.status || "fallback";

  function toggle(id) {
    store.update(
      "todayTasks",
      tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  }

  return (
    <section className="screen two-column">
      <div className="panel-large focus-panel">
        <div className="focus-header-layout">
          <div>
            <span className="eyebrow">Current Block</span>
            <h2>Build one proof unit before opening loops.</h2>
            <p>Use this screen like a runway: choose, finish, capture proof, and close the loop.</p>
          </div>
          <div className="progress-ring-container">
            <svg className="progress-ring" width="100" height="100">
              <circle
                className="progress-ring-bg"
                stroke="rgba(142, 234, 138, 0.08)"
                strokeWidth="6"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="progress-ring-fill"
                stroke="var(--green)"
                strokeWidth="6"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - 263.89 * (doneCount / (tasks.length || 1))}
                strokeLinecap="round"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="progress-ring-label">
              <strong>{Math.round((doneCount / (tasks.length || 1)) * 100)}%</strong>
              <span>
                {doneCount}/{tasks.length}
              </span>
            </div>
          </div>
        </div>

        <FocusTimer />

        <button className="primary-button" onClick={() => navigate("/capture")}>
          <Plus size={17} /> Capture update
        </button>
      </div>
      <div className="panel-large planning-panel">
        <span className="eyebrow">v3 Planning Snapshot</span>
        <h2>
          {planningStatus === "loaded"
            ? "Calendar and BuildOS stay visible while the day is running."
            : "Calendar and BuildOS stay visible while the day is running."}
        </h2>
        {planningStatus === "fallback" ? (
          <p className="auth-notice">Planning feed refresh unavailable; using the last checked snapshot.</p>
        ) : null}
        <SourceStrip planning={planning} planningStatus={planningStatus} />
        <div className="planning-grid">
          {[planning.todayFocus, planning.buildosUpdate, planning.tomorrowFocus].map((item) => (
            <article key={item.title} className="planning-card">
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <small>{item.meta}</small>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="timeline panel-large">
        <h2>Live Day Rail</h2>
        {tasks.map((item, index) => (
          <label className={item.done ? "timeline-row done" : "timeline-row"} key={item.id}>
            <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
          </label>
        ))}
      </div>
      <Panel icon={Gauge} title="Signals" tone="copper">
        Energy steady. Capture debt visible. Proof risk active until screenshots and demo are done.
      </Panel>
      <Panel icon={Compass} title="Next Best Move" tone="teal">
        Finish one failure path before adding polish. Pablo protects focus and delays public updates until proof exists.
      </Panel>
    </section>
  );
}
