import React from "react";
import { Eye } from "lucide-react";

export default function ContactScreen() {
  return (
    <section className="public-screen contact-screen">
      <div>
        <h1>Contact</h1>
        <p>
          Email and verified public links only. GitHub, LinkedIn, and booking links stay placeholders until final
          public links are approved.
        </p>
      </div>
      <div className="contact-panel">
        <Eye size={22} />
        <strong>Privacy-first portfolio</strong>
        <p>
          Public pages show capability, proof shape, and project categories. They do not reveal personal OS data.
        </p>
      </div>
    </section>
  );
}
