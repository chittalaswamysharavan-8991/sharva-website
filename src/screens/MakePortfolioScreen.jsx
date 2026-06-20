import React from "react";

export default function MakePortfolioScreen({ projects }) {
  const highlightedProjects = (projects || []).map((project) => ({
    ...project,
    readinessLabel: `${project.stage} / ${project.status}`
  }));

  return (
    <section className="public-screen make-screen">
      <div className="section-heading">
        <span className="public-kicker">Make.com portfolio</span>
        <h1>Make.com workflows built with visible operations logic and visible proof.</h1>
        <p>
          The portfolio centers on practical automations: logging, summaries, reminders, failure alerts, and owner
          handoff systems supported by Sheets, Gmail, Telegram, and Notion where needed.
        </p>
      </div>
      <div className="portfolio-preview">
        <img src="/screens/home-desktop.png" alt="Sanitized automation portfolio preview" />
      </div>

      <div className="proof-steps compact-proof-steps">
        <article>
          <p>Scenarios are built to show what triggered the run, what transformed the data, and what happened next.</p>
        </article>
        <article>
          <p>Failure routes and alerts are part of the portfolio, not an afterthought left outside the demo.</p>
        </article>
      </div>

      <div className="public-cards work-grid">
        {highlightedProjects.map((project) => (
          <article key={project.id} className="work-card">
            <span>{project.title}</span>
            <h3>{project.name}</h3>
            <strong>{project.readinessLabel}</strong>
            <p>{project.proof}</p>
            <small>{project.clientValue}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
