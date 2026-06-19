import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "../supabaseClient";

export function useConnectorReadiness() {
  function localReadinessSnapshot() {
    return {
      status: "fallback",
      connectors: [
        {
          name: "supabase_vault",
          serverConfigured: isSupabaseConfigured,
          missingEnv: isSupabaseConfigured ? [] : ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
          liveSyncEnabled: isSupabaseConfigured
        },
        {
          name: "notion",
          serverConfigured: false,
          missingEnv: ["NOTION_CLIENT_ID", "NOTION_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"],
          liveSyncEnabled: false
        },
        {
          name: "google_calendar",
          serverConfigured: false,
          missingEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"],
          liveSyncEnabled: false
        },
        {
          name: "google_drive",
          serverConfigured: false,
          missingEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"],
          liveSyncEnabled: false
        },
        {
          name: "make",
          serverConfigured: false,
          missingEnv: ["MAKE_API_TOKEN"],
          liveSyncEnabled: false
        },
        {
          name: "gmail",
          serverConfigured: false,
          missingEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "CONNECTOR_STATE_SECRET"],
          liveSyncEnabled: false
        }
      ],
      policy: "Local fallback readiness snapshot.",
      error: null
    };
  }

  const [readiness, setReadiness] = useState({
    status: "loading",
    connectors: [],
    policy: "",
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/connector-status");
        if (!response.ok) {
          throw new Error(`Readiness check failed with ${response.status}`);
        }
        const payload = await response.json();
        if (!cancelled) {
          setReadiness({
            status: "loaded",
            connectors: payload.connectors || [],
            policy: payload.policy || "",
            error: null
          });
        }
      } catch (error) {
        if (!cancelled) {
          setReadiness({ ...localReadinessSnapshot(), error: null });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return readiness;
}
