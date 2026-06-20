import React from "react";
import { publicPortfolioProjects } from "../publicPortfolio";

export default function MakePortfolioScreen() {
  const highlightedProjects = publicPortfolioProjects.filter((project) =>
    project.tools.includes("Make.com")
  );

  return (
    <section className="public-screen make-screen">
      <div className="section-heading">
        <span className="public-kicker">Make.com portfolio</span>
        <h1>Make.com workflows framed for clients, leads, and portfolio reviewers.</h1>
        <p>
          This page separates demo builds, proof placeholders, and in-progress case studies clearly. It shows where the
          scenario value is already understandable and where visual proof still needs to be captured.
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
        <article>
          <p>Screenshot slots stay marked as placeholders until they are actually captured and approved.</p>
        </article>
      </div>

      <div className="public-cards work-grid">
        {highlightedProjects.map((project) => (
          <article key={project.id} className="work-card">
            <span>{project.queueLabel}</span>
            <div className="card-heading-row">
              <h3>{project.title}</h3>
              <strong className={`proof-badge proof-badge-${project.proofTone}`}>{project.proofStatus}</strong>
            </div>
            <p>{project.summary}</p>
            <p className="business-value-line">{project.businessValue}</p>
            <div className="tool-chip-row">
              {project.tools.map((tool) => (
                <span key={tool} className="tool-chip">
                  {tool}
                </span>
              ))}
            </div>
            <div className="placeholder-list">
              {project.proofItems.map((item) => (
                <small key={item}>{item}</small>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
