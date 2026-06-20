import React from "react";
import { publicPortfolioProjects } from "../publicPortfolio";

export default function WorkScreen() {
  const portfolioProjects = publicPortfolioProjects;

  return (
    <section className="public-screen work-screen">
      <div className="section-heading">
        <span className="public-kicker">Selected work</span>
        <h1>Automation case studies built for reviewers who need the value and the proof status fast.</h1>
        <p>
          Each public case study names the business problem, the tools used, the current proof status, and the
          placeholder assets still waiting to be captured. Sensitive owner data and internal workspace details stay out.
        </p>
      </div>

      <div className="proof-steps compact-proof-steps">
        <article>
          <p>Tools stay practical: Make.com, Google Sheets, Gmail, Telegram, Notion, React, and Vercel.</p>
        </article>
        <article>
          <p>Every case study is expected to show the trigger, logic, output, and alert path.</p>
        </article>
        <article>
          <p>Proof placeholders are shown honestly until screenshots, sheet outputs, or demo video are captured.</p>
        </article>
      </div>

      <div className="public-cards work-grid">
        {portfolioProjects.map((project) => (
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
            <div className="asset-grid compact-asset-grid">
              {project.proofAssets
                ?.filter((asset) => asset.type === "image")
                .map((asset) => (
                <figure key={asset.src} className="asset-card">
                  <img src={asset.src} alt={asset.alt} loading="lazy" />
                  <figcaption>
                    <span className="asset-label">{asset.label}</span>
                    <strong>{asset.title}</strong>
                    <p>{asset.caption}</p>
                  </figcaption>
                </figure>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
