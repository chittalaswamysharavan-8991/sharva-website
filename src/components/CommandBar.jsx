import React, { useState } from "react";
import { Search, Lock, Database, LogOut, ArrowUpRight } from "lucide-react";
import { PRIVACY_CLASS } from "../privacy";

export default function CommandBar({ navigate, store, auth }) {
  const [command, setCommand] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!command.trim()) return;
    const capture = {
      id: `cap-${Date.now()}`,
      text: command.trim(),
      route: "Inbox",
      status: "open",
      privacyClass: PRIVACY_CLASS.PRIVATE_SUMMARY,
      createdAt: "Now"
    };
    store.update("captures", [capture, ...store.state.captures]);
    setCommand("");
    navigate("/capture");
  }

  return (
    <header className="command-bar">
      <section>
        <span className="eyebrow">Pablo Cockpit / Private OS</span>
        <h1>Where are we today?</h1>
      </section>
      <form className="command-search" onSubmit={submit}>
        <Search size={17} />
        <input
          aria-label="Command search"
          placeholder="Capture raw truth or ask what changed"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
        />
      </form>
      <div className="top-status">
        <span>
          <Lock size={14} /> {auth.isUnlocked ? "Owner verified" : "Private locked"}
        </span>
        <span>
          <Database size={14} /> {auth.configured ? store.syncMeta.status : "Vault setup needed"}
        </span>
        {auth.isUnlocked ? (
          <button onClick={auth.signOut} title="Sign out" aria-label="Sign out">
            <LogOut size={16} />
          </button>
        ) : null}
        <button onClick={() => navigate("/")} title="Public portfolio" aria-label="Open public portfolio">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </header>
  );
}
