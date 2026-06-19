import { useEffect, useState } from "react";
import { getOwnerProfile, isSupabaseConfigured, supabase } from "../supabaseClient";

const CANONICAL_HOSTNAME = "pablo-cockpit.vercel.app";

export function useAuthSession() {
  const [authState, setAuthState] = useState({
    configured: isSupabaseConfigured,
    loading: isSupabaseConfigured,
    session: null,
    user: null,
    profile: null,
    error: null,
    notice: null
  });

  useEffect(() => {
    if (!supabase) return undefined;
    let cancelled = false;

    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const session = data.session;
        const profile = session?.user ? await getOwnerProfile(session.user.id) : null;
        if (!cancelled) {
          setAuthState({
            configured: true,
            loading: false,
            session,
            user: session?.user ?? null,
            profile,
            error: profile || !session ? null : "This account is signed in but not allowlisted for Pablo Cockpit.",
            notice: null
          });
        }
      } catch (error) {
        if (!cancelled) {
          setAuthState((current) => ({
            ...current,
            loading: false,
            error: error.message,
            notice: null
          }));
        }
      }
    }

    loadSession();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => loadSession());

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    if (!supabase) return;
    setAuthState((current) => ({ ...current, loading: true, error: null, notice: null }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.protocol}//${CANONICAL_HOSTNAME}/home`
      }
    });
    if (error) {
      setAuthState((current) => ({
        ...current,
        loading: false,
        error: error.message,
        notice: null
      }));
      return;
    }
    setAuthState((current) => ({
      ...current,
      loading: false,
      notice: "Continue in Google to open Pablo Cockpit."
    }));
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthState({
      configured: true,
      loading: false,
      session: null,
      user: null,
      profile: null,
      error: null,
      notice: "Signed out. Private cockpit is locked."
    });
  }

  return {
    ...authState,
    isUnlocked: Boolean(authState.session && authState.profile?.is_enabled),
    signInWithGoogle,
    signOut
  };
}
