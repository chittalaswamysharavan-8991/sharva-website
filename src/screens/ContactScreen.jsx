import React from "react";
import { Eye } from "lucide-react";

export default function ContactScreen() {
  const offers = [
    "Make.com automations",
    "Google Sheets + Gmail workflows",
    "AI workflow prototypes",
    "Portfolio and demo systems"
  ];

  return (
    <section className="public-screen contact-screen">
      <div>
        <h1>Contact</h1>
        <p>
          Sharavan is available for automation builds, workflow prototypes, and reviewer-friendly proof systems. Email
          and verified public links stay placeholder-only until final contact destinations are approved.
        </p>
        <div className="contact-offer-list">
          {offers.map((offer) => (
            <span key={offer} className="tool-chip">
              {offer}
            </span>
          ))}
        </div>
      </div>
      <div className="contact-panel">
        <Eye size={22} />
        <strong>Placeholder contact destination</strong>
        <p>
          No pricing or private contact details are published here yet. The page stays intentionally simple until the
          approved public destination is ready.
        </p>
        <strong>Privacy-first portfolio</strong>
        <p>
          Public pages show capability, proof shape, and project categories. They do not reveal personal OS data or
          internal workspace details.
        </p>
      </div>
    </section>
  );
}
