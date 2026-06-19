import React from "react";
import {
  Activity,
  Archive,
  Bot,
  CalendarClock,
  FlaskConical,
  Home,
  Inbox,
  Layers3,
  Moon,
  PiggyBank
} from "lucide-react";

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/today", label: "Today", icon: CalendarClock },
  { path: "/capture", label: "Capture", icon: Inbox },
  { path: "/pablo", label: "Pablo", icon: Bot },
  { path: "/memory", label: "Memory", icon: Archive },
  { path: "/body", label: "Body", icon: Activity },
  { path: "/money", label: "Money", icon: PiggyBank },
  { path: "/build-lab", label: "Build Lab", icon: FlaskConical },
  { path: "/sync-settings", label: "Sync", icon: Layers3 },
  { path: "/night-close", label: "Night", icon: Moon }
];

export default function PrivateRail({ path, navigate }) {
  return (
    <aside className="private-rail" aria-label="Private navigation">
      <button className="mark" onClick={() => navigate("/home")} aria-label="Open Home">
        PC
      </button>
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.path === path;
          return (
            <button
              key={item.path}
              className={active ? "rail-item active" : "rail-item"}
              onClick={() => navigate(item.path)}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
