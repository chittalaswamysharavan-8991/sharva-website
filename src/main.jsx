import React, { useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  CalendarClock,
  Inbox,
  Bot,
  Archive,
  Activity,
  PiggyBank,
  FlaskConical,
  Layers3,
  Moon
} from "lucide-react";
import "./styles.css";

// Hooks
import { useRoute } from "./hooks/useRoute";
import { useAuthSession } from "./hooks/useAuthSession";
import { useCockpitState } from "./hooks/useCockpitState";
import { useConnectorControl } from "./hooks/useConnectorControl";
import { useConnectorReadiness } from "./hooks/useConnectorReadiness";
import { usePlanningSnapshot } from "./hooks/usePlanningSnapshot";
import { useCanonicalHostRedirect } from "./hooks/useCanonicalHostRedirect";

// Layout & Shell Components
import PrivateRail from "./components/PrivateRail";
import PublicBar from "./components/PublicBar";
import CommandBar from "./components/CommandBar";
import AuthGate from "./components/AuthGate";
import LoadingSkeleton from "./components/LoadingSkeleton";

// Lazy-loaded Screens
const HomeScreen = lazy(() => import("./screens/HomeScreen"));
const TodayScreen = lazy(() => import("./screens/TodayScreen"));
const CaptureScreen = lazy(() => import("./screens/CaptureScreen"));
const PabloScreen = lazy(() => import("./screens/PabloScreen"));
const MemoryScreen = lazy(() => import("./screens/MemoryScreen"));
const BodyScreen = lazy(() => import("./screens/BodyScreen"));
const MoneyScreen = lazy(() => import("./screens/MoneyScreen"));
const BuildLabScreen = lazy(() => import("./screens/BuildLabScreen"));
const SyncSettingsScreen = lazy(() => import("./screens/SyncSettingsScreen"));
const NightCloseScreen = lazy(() => import("./screens/NightCloseScreen"));
const PublicDoorway = lazy(() => import("./screens/PublicDoorway"));
const WorkScreen = lazy(() => import("./screens/WorkScreen"));
const MakePortfolioScreen = lazy(() => import("./screens/MakePortfolioScreen"));
const ContactScreen = lazy(() => import("./screens/ContactScreen"));
const NotFoundScreen = lazy(() => import("./screens/NotFoundScreen"));

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

function isKnownRoute(route) {
  return [
    "home",
    "today",
    "capture",
    "pablo",
    "memory",
    "body",
    "money",
    "build-lab",
    "sync-settings",
    "night-close",
    "public",
    "work",
    "make-portfolio",
    "contact"
  ].includes(route);
}

function App() {
  useCanonicalHostRedirect();
  const { path, navigate } = useRoute();
  const auth = useAuthSession();
  const store = useCockpitState(auth);
  const connectorControl = useConnectorControl(auth);
  const connectorReadiness = useConnectorReadiness();
  const planningSnapshotState = usePlanningSnapshot();

  const isPrivate = navItems.some((item) => item.path === path) || path === "/pablo";
  const route = path === "/" ? "public" : path.replace("/", "");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (auth.isUnlocked && path === "/") {
      navigate("/home");
    }
  }, [auth.isUnlocked, navigate, path]);

  useEffect(() => {
    if (path !== "/" || !window.location.hash.includes("access_token=")) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      navigate("/home");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [navigate, path]);

  return (
    <div className="app-shell">
      <div className="ambient-grid" />
      {isPrivate ? <PrivateRail path={path} navigate={navigate} /> : null}
      <main className={isPrivate ? "workspace private-workspace" : "workspace public-workspace"}>
        {isPrivate ? (
          <CommandBar navigate={navigate} store={store} auth={auth} />
        ) : (
          <PublicBar path={path} navigate={navigate} />
        )}
        {isPrivate && !auth.isUnlocked ? (
          <AuthGate auth={auth} connectorReadiness={connectorReadiness} />
        ) : null}
        <Suspense fallback={<LoadingSkeleton lines={6} height="32px" />}>
          {auth.isUnlocked && route === "home" && (
            <HomeScreen navigate={navigate} store={store} planningSnapshotState={planningSnapshotState} />
          )}
          {auth.isUnlocked && route === "today" && (
            <TodayScreen store={store} navigate={navigate} planningSnapshotState={planningSnapshotState} />
          )}
          {auth.isUnlocked && route === "capture" && <CaptureScreen store={store} navigate={navigate} />}
          {auth.isUnlocked && route === "pablo" && <PabloScreen />}
          {auth.isUnlocked && route === "memory" && <MemoryScreen store={store} navigate={navigate} />}
          {auth.isUnlocked && route === "body" && <BodyScreen store={store} />}
          {auth.isUnlocked && route === "money" && <MoneyScreen store={store} />}
          {auth.isUnlocked && route === "build-lab" && <BuildLabScreen store={store} />}
          {auth.isUnlocked && route === "sync-settings" && (
            <SyncSettingsScreen
              auth={auth}
              store={store}
              connectorControl={connectorControl}
              connectorReadiness={connectorReadiness}
            />
          )}
          {auth.isUnlocked && route === "night-close" && <NightCloseScreen store={store} />}
          {route === "public" && <PublicDoorway navigate={navigate} projects={store.state.projects} />}
          {route === "work" && <WorkScreen projects={store.state.projects} />}
          {route === "make-portfolio" && <MakePortfolioScreen projects={store.state.projects} />}
          {route === "contact" && <ContactScreen />}
          {!isKnownRoute(route) && auth.isUnlocked && <NotFoundScreen navigate={navigate} />}
        </Suspense>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
