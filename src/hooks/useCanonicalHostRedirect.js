import { useEffect } from "react";

const CANONICAL_HOSTNAME = "pablo-cockpit.vercel.app";
const LEGACY_HOSTNAMES = new Set(["lifeos-dashboard-ecru-five.vercel.app"]);

export function useCanonicalHostRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!LEGACY_HOSTNAMES.has(window.location.hostname)) return;

    const nextUrl = `${window.location.protocol}//${CANONICAL_HOSTNAME}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(nextUrl);
  }, []);
}
