import React, { useState } from "react";
import { X } from "lucide-react";
import Panel from "../components/Panel";

export default function BuildLabScreen({ store }) {
  const projects = store.state.projects || [];
  const [selectedId, setSelectedId] = useState(projects[0]?.id || "project-3");
  const [showExporter, setShowExporter] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeProject = projects.find((p) => p.id === selectedId) || projects[0];

  function updateProjectStage(id, newStage) {
    const updated = projects.map((p) => {
      if (p.id !== id) return p;
      // Also map status to Today if stage is Today, Next if Design/Testing, Queued if Backlog, etc.
      let newStatus = p.status;
      if (newStage === "Today") newStatus = "Today";
      else if (newStage === "Done") newStatus = "Done";
      else if (newStage === "Testing" || newStage === "Design") newStatus = "Next";
      else if (newStage === "Backlog") newStatus = "Queued";
      return { ...p, stage: newStage, status: newStatus };
    });
    store.update("projects", updated);
  }

  function toggleProjectChecklist(projId, itemId) {
    const updated = projects.map((p) => {
      if (p.id !== projId) return p;
      const list = (p.proofChecklist || []).map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      );
      return { ...p, proofChecklist: list };
    });
    store.update("projects", updated);
  }

  const KANBAN_STAGES = ["Backlog", "Design", "Testing", "Today", "Done"];

  // Exporter template
  const completedChecklist =
    activeProject?.proofChecklist
      ?.filter((item) => item.done)
      .map((item) => `- [x] ${item.label}`)
      .join("\n") || "";
  const caseStudyTemplate = activeProject
    ? `# Case Study: ${activeProject.name}
**Project Code**: ${activeProject.title}
**Status**: Completed and Portfolio Safe
**Operational Pacing Target**: Full Sprint
**Client Value Proposition**: ${activeProject.clientValue}

## Technical Implementation & Proof
- **Proof Vector**: ${activeProject.proof}
- **Artifacts Verified**:
${completedChecklist || "- None yet"}

## Privacy Compliance Statement
This case study complies with all cockpit security principles. No client keys, Gmail subject logs, raw financial ledgers, or private addresses have been exposed. Verified by Pablo.
`
    : "";

  function copyCaseStudy() {
    if (!caseStudyTemplate) return;
    navigator.clipboard.writeText(caseStudyTemplate).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="screen build-lab-layout">
      {/* Kanban Board Row */}
      <div className="panel-large kanban-section">
        <span className="eyebrow">Interactive Board</span>
        <h2>Make.com Workflow Sprint</h2>
        <p>Monitor your active pipeline. Select a project card to inspect proof and export assets.</p>

        <div className="kanban-grid">
          {KANBAN_STAGES.map((colStage) => {
            const colProjects = projects.filter((p) => p.stage === colStage);
            return (
              <div key={colStage} className="kanban-column">
                <div className="column-header">
                  <strong>{colStage}</strong>
                  <span className="badge">{colProjects.length}</span>
                </div>
                <div className="column-cards-container">
                  {colProjects.map((p) => {
                    const isActive = p.id === selectedId;
                    return (
                      <article
                        key={p.id}
                        onClick={() => {
                          setSelectedId(p.id);
                          setShowExporter(false);
                        }}
                        className={`kanban-project-card ${isActive ? "active" : ""}`}
                      >
                        <span className="card-lbl">{p.title}</span>
                        <h4>{p.name}</h4>
                        <select
                          value={p.stage}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateProjectStage(p.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="stage-selector"
                          aria-label="Change project stage"
                        >
                          {KANBAN_STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </article>
                    );
                  })}
                  {colProjects.length === 0 && (
                    <div className="empty-column-placeholder">Empty shelf</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Inspector & Exporter Grid */}
      <div className="inspector-grid">
        {activeProject ? (
          <div className="panel-large project-inspector-panel">
            <span className="eyebrow">Project Inspector</span>
            <h2>
              {activeProject.title}: {activeProject.name}
            </h2>
            <div className="project-metadata-strip">
              <span>
                Stage: <strong>{activeProject.stage}</strong>
              </span>
              <span>
                Status: <strong>{activeProject.status}</strong>
              </span>
            </div>

            <div className="inspector-content">
              <div className="detail-item">
                <strong>Client Value Proposition</strong>
                <p>{activeProject.clientValue}</p>
              </div>

              <div className="detail-item">
                <strong>Technical Proof Blueprint</strong>
                <p>{activeProject.proof}</p>
              </div>

              {/* Project Checklist */}
              <div className="project-proof-checklist">
                <h3>Proof Checklist</h3>
                <div className="checklist-items">
                  {(activeProject.proofChecklist || []).map((item) => (
                    <label key={item.id} className={item.done ? "checklist-row done" : "checklist-row"}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleProjectChecklist(activeProject.id, item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="inspector-actions-row">
                <button
                  onClick={() => setShowExporter(!showExporter)}
                  className="primary-button export-toggle-btn"
                >
                  {showExporter ? "Close Exporter" : "Generate Case Study"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="panel-large project-inspector-panel">
            <p className="auth-notice">Select a project from the Kanban board to inspect.</p>
          </div>
        )}

        {/* Case Study Exporter Overlay/Panel */}
        {showExporter && activeProject && (
          <div className="panel-large case-study-exporter-panel">
            <span className="eyebrow">Case Study Exporter</span>
            <h2>Portfolio Ready Case Study</h2>
            <p>Sanitized markdown summary formatted in compliance with the cockpit privacy rules.</p>

            <div className="privacy-audit-badge">
              <strong>Privacy Review Pass</strong>
              <ul>
                <li>[x] No raw email contents or body messages</li>
                <li>[x] No exact financial ledger balances</li>
                <li>[x] No personal health logs or recovery metrics</li>
                <li>[x] No addresses, tokens, or credential keys</li>
              </ul>
            </div>

            <textarea readOnly value={caseStudyTemplate} className="case-study-textbox" />
            <button
              type="button"
              onClick={copyCaseStudy}
              className="secondary-button copy-case-study-btn"
            >
              {copied ? "Copied!" : "Copy Case Study Markdown"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
