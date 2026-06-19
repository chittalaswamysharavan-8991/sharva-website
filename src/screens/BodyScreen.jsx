import React from "react";

export default function BodyScreen({ store }) {
  const log = store.state.bodyLogs?.[0] || {
    id: "body-today",
    energy: 7,
    sleep: 8,
    water: 3,
    gym: false,
    loggedAt: "Today"
  };

  function updateLog(field, value) {
    const updated = { ...log, [field]: value };
    store.update("bodyLogs", [updated]);
  }

  const energyFactor = log.energy;
  const sleepFactor = Math.min(10, log.sleep);
  const waterFactor = Math.min(8, log.water);

  const pacingScore = energyFactor * 0.5 + sleepFactor * 0.3 + waterFactor * 0.2 + (log.gym ? 1 : 0);

  let pacingTitle = "Steady Build";
  let pacingDesc =
    "Moderate capacity. Keep a steady pace. Focus on wrapping up existing task checklist items and testing scenarios. Avoid opening too many new loops.";
  let pacingTone = "teal";

  if (pacingScore >= 8) {
    pacingTitle = "Full Sprint";
    pacingDesc =
      "Energy and sleep are solid. Excellent capacity today! Perfect for tackling heavy coding tasks, writing documentation, or resolving complex bugs. Push for one major proof delivery.";
    pacingTone = "green";
  } else if (pacingScore < 5.5) {
    pacingTitle = "Active Recovery";
    pacingDesc =
      "Capacity is low. Pablo suggests reducing the day to: 1) One small proof move, 2) One clean-up action, and 3) A restful night close. Protect your recovery.";
    pacingTone = "copper";
  }

  return (
    <section className="screen two-column body-screen-layout">
      <div className="panel-large logger-panel">
        <span className="eyebrow">Interactive Logger</span>
        <h2>Log Daily Signals</h2>
        <p>Your inputs dynamically update the cockpit's pacing advisor below.</p>

        <div className="log-controls-grid">
          <div className="control-group">
            <label>
              <strong>Energy level</strong>
              <span>{log.energy} / 10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={log.energy}
              onChange={(e) => updateLog("energy", parseInt(e.target.value))}
              className="slider-control"
            />
          </div>

          <div className="control-group">
            <label>
              <strong>Sleep duration</strong>
              <span>{log.sleep} hrs</span>
            </label>
            <input
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={log.sleep}
              onChange={(e) => updateLog("sleep", parseFloat(e.target.value))}
              className="slider-control"
            />
          </div>

          <div className="control-group counter-control-group">
            <label>
              <strong>Water Intake</strong>
              <span>{log.water} / 8 cups</span>
            </label>
            <div className="counter-btn-row">
              <button
                type="button"
                onClick={() => updateLog("water", Math.max(0, log.water - 1))}
                className="counter-btn"
              >
                -
              </button>
              <span className="counter-val">{log.water}</span>
              <button
                type="button"
                onClick={() => updateLog("water", Math.min(15, log.water + 1))}
                className="counter-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="control-group check-control-group">
            <label>
              <strong>Active / Gym session today</strong>
              <span>{log.gym ? "Completed" : "Not yet"}</span>
            </label>
            <button
              type="button"
              onClick={() => updateLog("gym", !log.gym)}
              className={log.gym ? "toggle-btn active" : "toggle-btn"}
            >
              {log.gym ? "Completed" : "Mark Active"}
            </button>
          </div>
        </div>
      </div>

      <div className="panel-large gauges-panel">
        <span className="eyebrow">Status Gauges</span>
        <h2>Operating Signals</h2>

        <div className="gauges-list">
          <div className="gauge-item">
            <div className="gauge-label">
              <span>Energy Capacity</span>
              <strong>{log.energy * 10}%</strong>
            </div>
            <div className="gauge-bar-track">
              <div className="gauge-bar-fill tone-green" style={{ width: `${log.energy * 10}%` }} />
            </div>
          </div>

          <div className="gauge-item">
            <div className="gauge-label">
              <span>Sleep Quality</span>
              <strong>{Math.round((log.sleep / 8) * 100)}%</strong>
            </div>
            <div className="gauge-bar-track">
              <div className="gauge-bar-fill tone-teal" style={{ width: `${Math.min(100, (log.sleep / 8) * 100)}%` }} />
            </div>
          </div>

          <div className="gauge-item">
            <div className="gauge-label">
              <span>Hydration Status</span>
              <strong>{Math.round((log.water / 8) * 100)}%</strong>
            </div>
            <div className="gauge-bar-track">
              <div className="gauge-bar-fill tone-clay" style={{ width: `${Math.min(100, (log.water / 8) * 100)}%` }} />
            </div>
          </div>
        </div>

        <div className={`pacing-advice-card tone-${pacingTone}`}>
          <span className="eyebrow">Today Pacing Advice</span>
          <h3>{pacingTitle}</h3>
          <p>{pacingDesc}</p>
        </div>
      </div>
    </section>
  );
}
