import React from "react";

export default function WorkScreen({ projects }) {
  return (
    <section className="public-screen work-screen">
      <div>
        <h1>Work</h1>
        <p>
          Case studies will hold problem, workflow, tools, proof screenshots, demo videos, and edge cases after
          proof is collected.
        </p>
      </div>
      <div className="public-cards">
        {projects.map((project) => (
          <article key={project.id}>
            <h3>{project.title}</h3>
            <strong>{project.name}</strong>
            <p>{project.clientValue}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
