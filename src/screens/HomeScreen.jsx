import React from "react";
import { SunMedium, Radio, Layers3, ClipboardList } from "lucide-react";
import Metric from "../components/Metric";
import AtlasMap from "../components/AtlasMap";
import Panel from "../components/Panel";
import SourceStrip from "../components/SourceStrip";
import InstallPanel from "../components/InstallPanel";
import { planningSnapshot } from "../hooks/usePlanningSnapshot";

export default function HomeScreen({ navigate, store, planningSnapshotState }) {
  const completedToday = store.state.todayTasks.filter((task) => task.done).length;
  const openCaptures = store.state.captures.filter((item) => item.status !== "routed").length;
  const proofDone = store.state.proofChecklist.filter((item) => item.done).length;
  const planning = planningSnapshotState?.data ?? planningSnapshot;
  const planningStatus = planningSnapshotState?.status || "fallback";

  return (
    <section className="screen home-grid">
      <div className="atlas-card">
        <div className="section-heading">
          <span className="eyebrow">Neural Atlas</span>
          <h2>Life shelves as one living map.</h2>
          <p>Private state, active work, and public proof connected without exposing raw logs.</p>
        </div>
        <div className="status-strip">
          <Metric label="Today done" value={`${completedToday}/${store.state.todayTasks.length}`} />
          <Metric label="Open captures" value={openCaptures} />
          <Metric label="Proof ready" value={`${proofDone}/${store.state.proofChecklist.length}`} />
        </div>
        <AtlasMap navigate={navigate} />
      </div>
      <aside className="signal-stack">
        <Panel
          icon={SunMedium}
          title="Today Focus"
          tone="green"
          action={() => navigate("/today")}
          actionLabel="Open"
        >
          Make one proof-producing move first. The cockpit should reduce decisions, not create a second job.
        </Panel>
        <Panel icon={Radio} title="Connector Pulse" tone="teal">
          {planningStatus === "loaded"
            ? `Calendar and BuildOS planning snapshots are visible in the cockpit. ${
                planning.sources?.length || 0
              } source-backed notes are loaded today.`
            : "Calendar and BuildOS planning snapshots are visible in the cockpit; deeper live sync still waits for connector approval."}
        </Panel>
        <Panel icon={Layers3} title="Source Feed" tone="bone">
          <SourceStrip planning={planning} planningStatus={planningStatus} />
        </Panel>
        <Panel
          icon={ClipboardList}
          title="Open Loops"
          tone="copper"
          action={() => navigate("/build-lab")}
          actionLabel="Proof"
        >
          Screenshots, failure evidence, alert proof, and demo video still decide whether this becomes public
          portfolio material.
        </Panel>
        <InstallPanel />
      </aside>
    </section>
  );
}
