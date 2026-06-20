import React from "react";
import {
  publicOfferAreas,
  publicPortfolioProjects,
  publicProofPrinciples,
  publicSiteProofAssets
} from "../publicPortfolio";

export default function PublicDoorway({ navigate }) {
  const featuredProjects = publicPortfolioProjects.slice(0, 3);
  const liveProject = publicPortfolioProjects.find((project) => project.proofStatus === "Live verified");
  const homepageAssets = publicSiteProofAssets;

  return (
    <section className="public-screen public-doorway">
      <div className="public-hero">
        <div className="public-hero-copy">
          <span className="public-kicker">Sharavan / AI automation builder</span>
          <h1>Client-ready automation builds with honest proof labels.</h1>
          <p>
            Sharavan builds AI automation systems across Make.com, Google Sheets, Gmail, Telegram, and Notion. Public
            pages show the business value, proof status, and delivery style of each workflow while private workspace
            data stays off the public site.
          </p>
          <div className="public-actions">
            <button onClick={() => navigate("/work")}>View Work</button>
            <button onClick={() => navigate("/make-portfolio")}>Make.com Portfolio</button>
            <button onClick={() => navigate("/contact")}>Contact</button>
          </div>
        </div>

        <div className="proof-wall">
          <article className="proof-highlight">
            <span>{liveProject?.proofStatus || "Live verified"}</span>
            <strong>{liveProject?.title || "AI Portfolio Operating System"}</strong>
            <p>{liveProject?.summary}</p>
          </article>
          {featuredProjects.map((project) => (
            <article key={project.id} className="public-proof-card">
              <span className={`proof-badge proof-badge-${project.proofTone}`}>{project.proofStatus}</span>
              <strong>{project.title}</strong>
              <p>{project.businessValue}</p>
              <small>{project.shortLabel}</small>
            </article>
          ))}
        </div>
      </div>

      <div className="public-stack">
        <section className="public-section">
          <div className="section-heading">
            <span className="public-kicker">What I build</span>
            <h2>Automation systems that reduce manual follow-up and make the next move obvious.</h2>
          </div>
          <div className="public-cards">
            {publicOfferAreas.map((area) => (
              <article key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section public-proof-section">
          <div className="section-heading">
            <span className="public-kicker">Proof style</span>
            <h2>Public work stays useful because the proof standard stays visible.</h2>
          </div>
          <div className="proof-steps">
            {publicProofPrinciples.map((step) => (
              <article key={step}>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section">
          <div className="section-heading">
            <span className="public-kicker">Visible proof</span>
            <h2>Real screenshots and labeled proof assets keep the portfolio grounded.</h2>
            <p>
              Real website screenshots are shown directly. Demo-only images stay labeled as demo placeholders so they do
              not get mistaken for live workflow output.
            </p>
          </div>
          <div className="asset-grid">
            {homepageAssets.map((asset) => (
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
        </section>

        <section className="public-section">
          <div className="section-heading">
            <span className="public-kicker">Current sprint</span>
            <h2>Current portfolio snapshots with clear proof expectations.</h2>
            <p>
              These are public-safe case study frames. They explain delivery intent, business value, and the current
              proof status without exposing internal logs or private workspace details.
            </p>
          </div>
          <div className="public-cards">
            {featuredProjects.map((project) => (
              <article key={project.id} className="public-project-summary">
                <span className={`proof-badge proof-badge-${project.proofTone}`}>{project.proofStatus}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <small>{project.businessValue}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
