import React from "react";

export default function NotFoundScreen({ navigate }) {
  return (
    <section className="screen not-found-layout not-found">
      <div className="not-found-card">
        <h1 className="display-404">404</h1>
        <h2>This page doesn't exist in the cockpit</h2>
        <p>You may have typed an invalid route or are accessing a private screen that is currently locked.</p>
        <button onClick={() => navigate("/home")} className="primary-button">
          Navigate to Home
        </button>
      </div>
    </section>
  );
}
