import React from "react";
import { Shield } from "lucide-react";

const publicItems = [
  { path: "/", label: "Public" },
  { path: "/work", label: "Work" },
  { path: "/make-portfolio", label: "Make Portfolio" },
  { path: "/contact", label: "Contact" }
];

export default function PublicBar({ path, navigate }) {
  return (
    <header className="public-bar">
      <button className="public-brand" onClick={() => navigate("/")}>
        Sharavan / AI Automation Builder
      </button>
      <nav>
        {publicItems.map((item) => (
          <button
            key={item.path}
            className={path === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button className="return-private" onClick={() => navigate("/home")}>
        <Shield size={16} /> Private Cockpit
      </button>
    </header>
  );
}
