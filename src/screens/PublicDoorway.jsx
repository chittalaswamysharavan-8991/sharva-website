import React from "react";

export default function PublicDoorway({ navigate, projects }) {
  const featuredProjects = (projects || []).slice(0, 3);

  const buildAreas = [
    {
      title: "Make.com operations",
      body: "Scenario design, routers, retries, failure paths, and delivery logic built for real business workflows."
    },
    {
      title: "Google workspace systems",
      body: "Google Sheets, Gmail, and Telegram automations that keep inputs, logs, alerts, and summaries in sync."
    },
    {
      title: "Proof-based delivery",
      body: "Every build is shaped around visible inputs, processing, outputs, alerts, and recovery behavior before it is called done."
    }
  ];

  const proofSteps = [
    "Input is visible and sanitized before a workflow runs.",
    "Processing logic is checked with expected success and failure paths.",
    "Outputs, alerts, and logs are captured as proof instead of assumed.",
    "Private workspace data stays inside the locked owner workflow."
  ];

  return (
    <section className="public-screen public-doorway">
      <div className="public-hero">
        <div className="public-hero-copy">
          <span className="public-kicker">Sharavan / AI automation builder</span>
          <h1>Proof-first automations for messy real work.</h1>
          <p>
            Sharavan builds AI automation systems across Make.com, Google Sheets, Gmail, Telegram, and Notion. Public
            pages show the workflow shape and proof standard, while private workspace data stays off the public site.
          </p>
          <div className="public-actions">
            <button onClick={() => navigate("/work")}>View Work</button>
            <button onClick={() => navigate("/make-portfolio")}>Make.com Portfolio</button>
            <button onClick={() => navigate("/contact")}>Contact</button>
          </div>
        </div>

        <div className="proof-wall">
          <article className="proof-highlight">
            <span>Proof style</span>
            <strong>Builds are judged by evidence, not by a pretty diagram.</strong>
            <p>Each automation is documented through input, processing, output, alerts, and failure handling.</p>
          </article>
          {featuredProjects.map((project) => (
            <article key={project.id}>
              <span>{project.status}</span>
              <strong>{project.name}</strong>
              <p>{project.proof}</p>
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
            {buildAreas.map((area) => (
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
            {proofSteps.map((step) => (
              <article key={step}>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section">
          <div className="section-heading">
            <span className="public-kicker">Current sprint</span>
            <h2>Current Make.com portfolio snapshots from the active build queue.</h2>
            <p>
              These are sanitized project summaries drawn from the working portfolio. They show delivery focus without
              exposing private operating data.
            </p>
          </div>
          <div className="public-cards">
            {featuredProjects.map((project) => (
              <article key={project.id}>
                <span>{project.title}</span>
                <h3>{project.name}</h3>
                <p>{project.clientValue}</p>
                <small>{project.proof}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
