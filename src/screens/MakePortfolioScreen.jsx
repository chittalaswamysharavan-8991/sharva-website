import React from "react";

export default function MakePortfolioScreen({ projects }) {
  return (
    <section className="public-screen make-screen">
      <div>
        <h1>Five workflows, one proof engine.</h1>
        <p>Each automation earns its place by showing input, processing, output, alerting, and failure behavior.</p>
      </div>
      <div className="portfolio-preview">
        <img src="/screens/home-desktop.png" alt="Pablo Cockpit proof system preview" />
      </div>
      <div className="public-cards">
        {projects.map((project) => (
          <article key={project.id}>
            <h3>{project.title}</h3>
            <strong>{project.name}</strong>
            <p>{project.proof}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
