import React from "react";
import { BrainCircuit, CircleDot } from "lucide-react";

const atlasNodes = [
  { key: "today", label: "Today", sub: "live state", x: 22, y: 20, tone: "clay" },
  { key: "memory", label: "Memory", sub: "recall layer", x: 71, y: 18, tone: "teal" },
  { key: "public", label: "Public", sub: "proof door", x: 48, y: 4, tone: "bone" },
  { key: "body", label: "Body", sub: "signals", x: 20, y: 74, tone: "green" },
  { key: "money", label: "Money", sub: "reminders", x: 50, y: 88, tone: "red" },
  { key: "build", label: "Build Lab", sub: "sprint", x: 77, y: 62, tone: "copper" }
];

export default function AtlasMap({ navigate }) {
  return (
    <div className="atlas-map" aria-label="Pablo Cockpit navigation map">
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <button className="core-node" onClick={() => navigate("/pablo")}>
        <BrainCircuit size={32} />
        <strong>Pablo</strong>
        <span>command core</span>
      </button>
      {atlasNodes.map((node) => (
        <button
          key={node.key}
          className={`atlas-node tone-${node.tone}`}
          style={{ "--x": `${node.x}%`, "--y": `${node.y}%` }}
          onClick={() =>
            navigate(node.key === "public" ? "/" : node.key === "build" ? "/build-lab" : `/${node.key}`)
          }
        >
          <CircleDot size={15} />
          <strong>{node.label}</strong>
          <span>{node.sub}</span>
        </button>
      ))}
    </div>
  );
}
