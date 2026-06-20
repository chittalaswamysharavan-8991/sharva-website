import React, { useState } from "react";
import { Search, Inbox, ShieldCheck, X } from "lucide-react";
import { PRIVACY_CLASS } from "../privacy";

const SYNC_COPY = {
  local: { label: "Local-only", note: "Vault sync starts after the owner session is active." },
  pending: { label: "Vault waking up", note: "The private vault is preparing the session." },
  loading: { label: "Vault loading", note: "Owner data is being restored from Supabase." },
  loaded: { label: "Vault loaded", note: "Private state is back in the cockpit." },
  saving: { label: "Saving now", note: "Recent changes are being written to the vault." },
  synced: { label: "Synced", note: "Private state is saved and safe." },
  error: { label: "Needs attention", note: "Vault sync hit an error." }
};

function formatSyncTime(value) {
  if (!value) return "No recent sync timestamp.";
  return `Last sync ${new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`;
}

function parseItemDate(item) {
  // Extra Guardrail: extract timestamp from id (cap-<timestamp>)
  const match = item && item.id ? String(item.id).match(/^cap-(\d+)$/) : null;
  if (match) {
    const ms = parseInt(match[1], 10);
    if (!isNaN(ms)) {
      const date = new Date(ms);
      return {
        date,
        formattedTime: date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        formattedDate: date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
        relativeGroup: getRelativeGroup(date)
      };
    }
  }

  // Fall back to item.createdAt
  if (item && item.createdAt) {
    // Try parsing item.createdAt as a Date first
    const d = new Date(item.createdAt);
    if (!isNaN(d.getTime())) {
      return {
        date: d,
        formattedTime: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        formattedDate: d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
        relativeGroup: getRelativeGroup(d)
      };
    }

    const createdStr = String(item.createdAt).trim();
    const createdStrLower = createdStr.toLowerCase();
    if (createdStrLower === "today" || createdStrLower === "now") {
      return {
        date: new Date(),
        formattedTime: "Recently",
        formattedDate: "Today",
        relativeGroup: "Today"
      };
    }
    if (createdStrLower === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        date: yesterday,
        formattedTime: "Yesterday",
        formattedDate: "Yesterday",
        relativeGroup: "Yesterday"
      };
    }
    return {
      date: null,
      formattedTime: createdStr,
      formattedDate: "Earlier",
      relativeGroup: "Earlier"
    };
  }

  // Ultimate fallback
  return {
    date: null,
    formattedTime: "Unknown time",
    formattedDate: "Earlier",
    relativeGroup: "Earlier"
  };
}

function getRelativeGroup(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return "Earlier";
}

export default function MemoryScreen({ store, navigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const captures = store.state.captures || [];
  const syncMeta = store.syncMeta;
  const syncCard = SYNC_COPY[syncMeta.status] ?? SYNC_COPY.pending;

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Inbox", value: "Inbox" },
    { label: "Today", value: "Today" },
    { label: "Build Lab", value: "Build" },
    { label: "Memory", value: "Memory" },
    { label: "Body", value: "Body" },
    { label: "Money", value: "Money" },
    { label: "Night Close", value: "Night Close" },
    { label: "Public-safe", value: "Public-safe" },
    { label: "Sensitive", value: "Sensitive" }
  ];

  function removeCapture(id) {
    // Standard react state updating pattern used elsewhere in the store
    store.update(
      "captures",
      captures.filter((item) => item.id !== id)
    );
  }

  const matchesFilter = (item, filter) => {
    if (filter === "All") return true;
    if (filter === "Inbox") return item.route === "Inbox";
    if (filter === "Today") return item.route === "Today";
    if (filter === "Build") return item.route === "Build Lab";
    if (filter === "Memory") return item.route === "Memory";
    if (filter === "Body") return item.route === "Body";
    if (filter === "Money") return item.route === "Money";
    if (filter === "Night Close") return item.route === "Night Close";
    if (filter === "Public-safe") return item.privacyClass === PRIVACY_CLASS.PUBLIC;
    if (filter === "Sensitive") {
      return (
        item.privacyClass === PRIVACY_CLASS.SENSITIVE ||
        item.privacyClass === PRIVACY_CLASS.PRIVATE_SUMMARY ||
        item.privacyClass === PRIVACY_CLASS.BLOCKED_PUBLIC ||
        !item.privacyClass
      );
    }
    return true;
  };

  const matchesSearch = (item, query) => {
    const term = query.toLowerCase().trim();
    if (!term) return true;
    const text = (item.text || "").toLowerCase();
    const route = (item.route || "").toLowerCase();
    const priv = (item.privacyClass || "").toLowerCase();
    return text.includes(term) || route.includes(term) || priv.includes(term);
  };

  const filteredCaptures = captures
    .filter((item) => matchesFilter(item, activeFilter))
    .filter((item) => matchesSearch(item, searchQuery));

  // Group captures
  const grouped = {
    Today: [],
    Yesterday: [],
    Earlier: {} // Maps formattedDate -> items
  };

  filteredCaptures.forEach((item) => {
    const { relativeGroup, formattedDate, formattedTime } = parseItemDate(item);
    const enrichedItem = { ...item, formattedTime, formattedDate };

    if (relativeGroup === "Today") {
      grouped.Today.push(enrichedItem);
    } else if (relativeGroup === "Yesterday") {
      grouped.Yesterday.push(enrichedItem);
    } else {
      if (!grouped.Earlier[formattedDate]) {
        grouped.Earlier[formattedDate] = [];
      }
      grouped.Earlier[formattedDate].push(enrichedItem);
    }
  });

  const hasGroupedItems =
    grouped.Today.length > 0 ||
    grouped.Yesterday.length > 0 ||
    Object.keys(grouped.Earlier).length > 0;

  function resetFilters() {
    setSearchQuery("");
    setActiveFilter("All");
  }

  function getPrivacyLabel(privClass) {
    if (privClass === PRIVACY_CLASS.PUBLIC) return "Public-safe";
    if (privClass === PRIVACY_CLASS.SENSITIVE) return "Sensitive";
    if (privClass === PRIVACY_CLASS.BLOCKED_PUBLIC) return "Blocked public";
    return "Private";
  }

  return (
    <section className="screen memory-timeline-screen">
      {/* Header section with vault status */}
      <div className="memory-header-row">
        <div className="memory-header-text">
          <span className="eyebrow">Memory Timeline</span>
          <h2>Review captured thoughts, tasks, logs, and learnings.</h2>
        </div>
        <div className="today-sync-card memory-sync-badge-card">
          <div className="today-sync-header">
            <ShieldCheck size={16} />
            <div>
              <strong>{syncCard.label}</strong>
              <span>{syncMeta.mode === "supabase" ? "Supabase vault" : "Local session"}</span>
            </div>
          </div>
          <small>{formatSyncTime(syncMeta.lastSyncedAt)}</small>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="memory-controls-bar">
        <div className="memory-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search captures by text, route, or privacy..."
            aria-label="Search captures"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <X size={15} />
            </button>
          )}
        </div>
        <div className="memory-chips-wrapper">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              className={activeFilter === opt.value ? "chip active" : "chip"}
              onClick={() => setActiveFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="memory-timeline-container">
        {hasGroupedItems ? (
          <div className="timeline-trail">
            {/* Today Group */}
            {grouped.Today.length > 0 && (
              <div className="timeline-group">
                <div className="timeline-date-marker">
                  <span>Today</span>
                </div>
                <div className="timeline-items">
                  {grouped.Today.map((item) => (
                    <MemoryItemCard key={item.id} item={item} onDelete={removeCapture} getPrivacyLabel={getPrivacyLabel} />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday Group */}
            {grouped.Yesterday.length > 0 && (
              <div className="timeline-group">
                <div className="timeline-date-marker">
                  <span>Yesterday</span>
                </div>
                <div className="timeline-items">
                  {grouped.Yesterday.map((item) => (
                    <MemoryItemCard key={item.id} item={item} onDelete={removeCapture} getPrivacyLabel={getPrivacyLabel} />
                  ))}
                </div>
              </div>
            )}

            {/* Earlier Groups */}
            {Object.keys(grouped.Earlier)
              .sort((a, b) => {
                const da = new Date(a);
                const db = new Date(b);
                const ta = isNaN(da.getTime()) ? 0 : da.getTime();
                const tb = isNaN(db.getTime()) ? 0 : db.getTime();
                return tb - ta;
              }) // Sort dates descending, placing non-date keys at the end
              .map((dateStr) => (
                <div className="timeline-group" key={dateStr}>
                  <div className="timeline-date-marker">
                    <span>{dateStr}</span>
                  </div>
                  <div className="timeline-items">
                    {grouped.Earlier[dateStr].map((item) => (
                      <MemoryItemCard key={item.id} item={item} onDelete={removeCapture} getPrivacyLabel={getPrivacyLabel} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          /* Empty State */
          <div className="memory-empty-state">
            <Inbox size={48} className="empty-icon" />
            {captures.length > 0 ? (
              <>
                <h3>No matching items found</h3>
                <p>No captured items match your search term or category filters.</p>
                <button className="secondary-button" onClick={resetFilters}>
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <h3>No captured memories yet</h3>
                <p>Your timeline is empty. Capture thoughts, notes, and tasks to build your private index.</p>
                <div className="empty-actions">
                  <button className="primary-button" onClick={() => navigate("/capture")}>
                    Quick Capture
                  </button>
                  <button className="secondary-button" onClick={() => navigate("/today")}>
                    View Today
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function MemoryItemCard({ item, onDelete, getPrivacyLabel }) {
  return (
    <article className="timeline-card">
      <div className="card-top-row">
        <div className="card-metadata">
          <span className="card-time">{item.formattedTime}</span>
          <span className="card-tag route-tag">{item.route}</span>
          <span className={`card-tag privacy-tag ${item.privacyClass || "private_summary"}`}>
            {getPrivacyLabel(item.privacyClass)}
          </span>
        </div>
        <button className="card-delete-btn" onClick={() => onDelete(item.id)} title="Delete from timeline">
          <X size={15} />
        </button>
      </div>
      <p className="card-text">{item.text}</p>
    </article>
  );
}
