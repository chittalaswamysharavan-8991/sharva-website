import React from "react";
import { publicPortfolioProjects, publicSiteProofAssets } from "../publicPortfolio";

export default function MakePortfolioScreen() {
  const highlightedProjects = publicPortfolioProjects.filter((project) =>
    project.tools.includes("Make.com")
  );
  const featuredVideo = highlightedProjects.find((project) =>
    project.proofAssets?.some((asset) => asset.type === "video")
  )?.proofAssets?.find((asset) => asset.type === "video");
  const demoAssets = publicPortfolioProjects
    .flatMap((project) => project.proofAssets || [])
    .filter((asset) => asset.label === "Demo placeholder");
  const portfolioScreens = publicSiteProofAssets.filter((asset) =>
    ["/screens/make-portfolio-desktop.png", "/screens/work-mobile.png"].includes(asset.src)
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
        <img src="/screens/make-portfolio-desktop.png" alt="Real screenshot of the Make.com portfolio page on desktop." />
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

      {featuredVideo ? (
        <section className="public-proof-media">
          <div className="section-heading">
            <span className="public-kicker">Walkthrough video</span>
            <h2>A public walkthrough of the current portfolio flow.</h2>
            <p>{featuredVideo.caption}</p>
          </div>
          <div className="video-card">
            <video controls preload="metadata" poster={featuredVideo.poster}>
              <source src={featuredVideo.src} type="video/mp4" />
              <source src={featuredVideo.src} type="video/webm" />
              Your browser does not support the walkthrough video.
            </video>
            <div className="video-card-copy">
              <span className="asset-label">{featuredVideo.label}</span>
              <strong>{featuredVideo.title}</strong>
              <p>This is a public-safe walkthrough video of the portfolio routes, not a private automation dashboard recording.</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="public-proof-media">
        <div className="section-heading">
          <span className="public-kicker">Demo placeholders</span>
          <h2>Demo visuals stay labeled as demo placeholders until real workflow proof exists.</h2>
          <p>
            These are clean concept assets for portfolio explanation. They are not live Make.com or Google Sheets
            screenshots.
          </p>
        </div>
        <div className="asset-grid compact-asset-grid">
          {demoAssets.map((asset) => (
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

      <div className="asset-grid">
        {portfolioScreens.map((asset) => (
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
