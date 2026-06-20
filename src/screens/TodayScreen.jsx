import React from "react";
import { Plus, Gauge, Compass, ShieldCheck, MoonStar, Clock3 } from "lucide-react";
import FocusTimer from "../components/FocusTimer";
import SourceStrip from "../components/SourceStrip";
import Panel from "../components/Panel";
import Metric from "../components/Metric";
import { planningSnapshot } from "../hooks/usePlanningSnapshot";

const SYNC_COPY = {
  local: {
    label: "Local-only",
    note: "Vault sync starts after the owner session is active."
  },
  pending: {
    label: "Vault waking up",
    note: "The private vault is preparing the session."
  },
  loading: {
    label: "Vault loading",
    note: "Owner data is being restored from Supabase."
  },
  loaded: {
    label: "Vault loaded",
    note: "Private state is back in the cockpit and ready to continue."
  },
  saving: {
    label: "Saving now",
    note: "Recent cockpit changes are being written to the vault."
  },
  synced: {
    label: "Synced",
    note: "Private state is saved and safe to refresh."
  },
  error: {
    label: "Needs attention",
    note: "Vault sync hit an error. Keep the day simple until it clears."
  }
};

function formatSyncTime(value) {
  if (!value) return "No recent vault timestamp yet.";

  return `Last sync ${new Date(value).toLocaleString([], {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric"
  })}.`;
}

export default function TodayScreen({ store, navigate, planningSnapshotState }) {
  const tasks = store.state.todayTasks;
  const captures = store.state.captures;
  const projects = store.state.projects;
  const nightClose = store.state.nightClose;
  const syncMeta = store.syncMeta;
  const doneCount = tasks.filter((task) => task.done).length;
  const planning = planningSnapshotState?.data ?? planningSnapshot;
  const planningStatus = planningSnapshotState?.status || "fallback";
  const openTasks = tasks.filter((task) => !task.done);
  const nextTask = openTasks[0] ?? null;
  const todayProject = projects.find((project) => project.status === "Today") ?? projects[0];
  const projectProof = todayProject?.proofChecklist ?? [];
  const proofDone = projectProof.filter((item) => item.done).length;
  const proofGap = projectProof.find((item) => !item.done) ?? null;
  const openCaptures = captures.filter((item) => item.status !== "routed");
  const todayCaptureQueue = captures
    .filter((item) => item.route === "Today" || item.status !== "routed")
    .slice(0, 3);
  const nightCloseRemaining = nightClose.filter((item) => !item.done);
  const nextCloseItem = nightCloseRemaining[0] ?? null;
  const syncCard = SYNC_COPY[syncMeta.status] ?? SYNC_COPY.pending;

  function toggle(id) {
    store.update(
      "todayTasks",
      tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  }

  function markNextDone() {
    if (!nextTask) return;
    toggle(nextTask.id);
  }

  return (
    <section className="screen two-column today-command-center">
      <div className="panel-large focus-panel today-hero-panel">
        <div className="focus-header-layout">
          <div>
            <span className="eyebrow">Today Command Center</span>
            <h2>{nextTask ? nextTask.label : "Today is closed with a clear handoff."}</h2>
            <p>
              {nextTask
                ? `Stay with ${todayProject?.name || "the active proof block"} until the next visible proof step is done, then capture the result before opening anything new.`
                : "The main checklist is complete. Capture the proof, close the remaining loop, and protect tomorrow's first move."}
            </p>
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

        <div className="status-strip">
          <Metric label="Tasks done" value={`${doneCount}/${tasks.length}`} />
          <Metric label="Open captures" value={openCaptures.length} />
          <Metric label="Proof ready" value={`${proofDone}/${projectProof.length || 0}`} />
        </div>

        <div className="today-hero-grid">
          <article className="today-spotlight">
            <span className="eyebrow">{todayProject ? `${todayProject.title} / ${todayProject.stage}` : "Active block"}</span>
            <strong>{nextTask ? nextTask.label : "Proof block wrapped"}</strong>
            <p>{todayProject?.clientValue || "Reduce decision load and turn work into visible proof."}</p>
            <ul className="today-bullet-list">
              <li>Current proof target: {todayProject?.proof || "Choose the next proof-producing output."}</li>
              <li>Next proof gap: {proofGap?.label || "Proof checklist is complete for this project."}</li>
              <li>Tonight close: {nextCloseItem?.label || "Night close checklist is already clear."}</li>
            </ul>
            <div className="today-action-row">
              <button className="primary-button" onClick={() => navigate("/capture")}>
                <Plus size={17} /> Capture update
              </button>
              <button className="secondary-button" onClick={markNextDone} disabled={!nextTask}>
                <Clock3 size={16} /> Mark next step done
              </button>
            </div>
          </article>

          <div className="today-focus-stack">
            <div className="today-sync-card">
              <div className="today-sync-header">
                <ShieldCheck size={18} />
                <div>
                  <strong>{syncCard.label}</strong>
                  <span>{syncMeta.mode === "supabase" ? "Supabase vault" : "Local session"}</span>
                </div>
              </div>
              <p>{syncMeta.error ? `Vault error: ${syncMeta.error}` : syncCard.note}</p>
              <small>{formatSyncTime(syncMeta.lastSyncedAt)}</small>
            </div>
            <FocusTimer />
          </div>
        </div>
      </div>

      <div className="panel-large planning-panel">
        <span className="eyebrow">Planning Snapshot</span>
        <h2>Calendar and BuildOS stay visible while the day is running.</h2>
        <p>
          Keep the current focus block, the next proof unit, and tomorrow's first move in view so the cockpit
          reduces decisions instead of adding another layer.
        </p>
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

      <div className="timeline panel-large today-rail">
        <div className="today-panel-heading">
          <span className="eyebrow">Waiting On You</span>
          <h2>Live Day Rail</h2>
        </div>
        <p className="today-panel-copy">
          This is the minimum list for today. Finish the active step, capture the proof, and leave tomorrow with a
          clean first move.
        </p>
        {tasks.map((item, index) => (
          <label className={item.done ? "timeline-row done" : "timeline-row"} key={item.id}>
            <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
          </label>
        ))}
      </div>

      <div className="panel-list today-capture-panel">
        <div className="list-header">
          <h3>Capture Pulse</h3>
          <span className="today-panel-meta">
            {todayCaptureQueue.length ? `${todayCaptureQueue.length} items need review` : "No urgent captures"}
          </span>
        </div>
        <p className="today-panel-copy">
          Important notes stay visible here until they are routed or resolved. Sensitive content remains private to
          the owner session.
        </p>
        {todayCaptureQueue.length ? (
          todayCaptureQueue.map((item) => (
            <article key={item.id} className="capture-item">
              <div>
                <span>
                  {item.createdAt} / {item.route} / {item.status}
                </span>
                <p>{item.text}</p>
              </div>
            </article>
          ))
        ) : (
          <p className="auth-notice">Nothing urgent is waiting in the capture queue.</p>
        )}
      </div>

      <div className="panel-list today-close-panel">
        <div className="list-header">
          <h3>Tonight Close</h3>
          <span className="today-panel-meta">
            {nightCloseRemaining.length ? `${nightCloseRemaining.length} items left` : "Close checklist ready"}
          </span>
        </div>
        <p className="today-panel-copy">
          Keep the end-of-day bar simple: evidence saved, open loops named, tomorrow decided, and privacy still
          protected.
        </p>
        {nightClose.map((item, index) => (
          <div key={item.id} className={item.done ? "close-row done" : "close-row"}>
            {item.done ? <Gauge size={17} /> : <MoonStar size={17} />}
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
          </div>
        ))}
        <button className="secondary-button" onClick={() => navigate("/night-close")}>
          <MoonStar size={16} /> Open night close
        </button>
      </div>

      <Panel icon={Gauge} title="Signals" tone="copper">
        {openCaptures.length
          ? `Capture debt is visible with ${openCaptures.length} open item${openCaptures.length === 1 ? "" : "s"}.`
          : "Capture debt is low, so the day can stay focused on proof instead of cleanup."}{" "}
        {proofGap ? `The main proof risk is still ${proofGap.label.toLowerCase()}.` : "The proof checklist is in a healthy state."}
      </Panel>

      <Panel icon={Compass} title="Next Best Move" tone="teal">
        {nextTask
          ? `Finish ${nextTask.label.toLowerCase()}, capture the result, then move directly into ${nextCloseItem?.label.toLowerCase() || "night close"}.`
          : "Capture the finished state, confirm the close checklist, and leave tomorrow with a single clear starting move."}
      </Panel>
    </section>
  );
}
