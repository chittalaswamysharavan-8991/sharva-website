import React from "react";

export default function PublicDoorway({ navigate, projects }) {
  return (
    <section className="public-screen public-hero">
      <div>
        <h1>Sharavan builds useful AI automation systems.</h1>
        <p>
          A public doorway for Make.com workflows, Google Sheets systems, Gmail and Telegram automations, and simple
          product experiments. Private Pablo data stays private.
        </p>
        <div className="public-actions">
          <button onClick={() => navigate("/make-portfolio")}>View Make.com sprint</button>
          <button onClick={() => navigate("/home")}>Open private cockpit</button>
        </div>
      </div>
      <div className="proof-wall">
        {projects.map((project) => (
          <article key={project.id}>
            <span>{project.title}</span>
            <strong>{project.name}</strong>
            <p>{project.proof}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
