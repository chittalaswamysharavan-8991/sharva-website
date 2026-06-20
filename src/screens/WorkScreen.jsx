import React from "react";

export default function WorkScreen({ projects }) {
  const portfolioProjects = (projects || []).map((project) => ({
    ...project,
    checklistCount: project.proofChecklist?.length || 0
  }));

  return (
    <section className="public-screen work-screen">
      <div className="section-heading">
        <span className="public-kicker">Selected work</span>
        <h1>Automation case studies built for operators who want proof, not mystery.</h1>
        <p>
          Sharavan designs public-facing case studies around the workflow problem, the automation stack, the proof
          trail, and the failure behavior. Sensitive owner data, raw inbox content, financial details, and connector
          tokens stay out.
        </p>
      </div>

      <div className="proof-steps compact-proof-steps">
        <article>
          <p>Tools stay practical: Make.com, Google Sheets, Gmail, Telegram, and Notion.</p>
        </article>
        <article>
          <p>Every case study is expected to show the trigger, logic, output, and alert path.</p>
        </article>
        <article>
          <p>Edge cases matter because a workflow only counts when it behaves well under pressure.</p>
        </article>
      </div>

      <div className="public-cards work-grid">
        {portfolioProjects.map((project) => (
          <article key={project.id} className="work-card">
            <span>{project.title}</span>
            <h3>{project.name}</h3>
            <strong>
              {project.stage} / {project.status}
            </strong>
            <p>{project.clientValue}</p>
            <small>Proof target: {project.proof}</small>
            <small>{project.checklistCount} proof checks tracked in the working build.</small>
          </article>
        ))}
      </div>
    </section>
  );
}
