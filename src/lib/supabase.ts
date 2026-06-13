import { createClient } from "@supabase/supabase-js";

// Supabase project config. The publishable (anon) key is designed to live in the
// client bundle — it carries no privileges of its own; row-level security on the
// tables is what protects data. Hardcoding it keeps the static GitHub Pages build
// working with zero secret wiring.
const SUPABASE_URL = "https://xeavqqoxpifxtkmaifqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QRowhJHL29UBWLY2Y1Q9BA_ojV3kppt";

// "Remember me" support. supabase-js picks its storage once, at client creation, so
// we hand it an adapter that routes to localStorage (persist across browser restarts)
// or sessionStorage (cleared when the tab closes) based on a flag the login form sets
// just before signing in. Default is to persist.
const REMEMBER_KEY = "sb-remember";

export function setRememberMe(remember: boolean): void {
  try {
    if (remember) localStorage.setItem(REMEMBER_KEY, "1");
    else localStorage.removeItem(REMEMBER_KEY);
  } catch {
    // storage unavailable — fall through to default persistence
  }
}

function activeStore(): Storage {
  try {
    return localStorage.getItem(REMEMBER_KEY) === "1" ? localStorage : sessionStorage;
  } catch {
    return localStorage;
  }
}

// Read across both stores so an existing session is found regardless of which one it
// was written to; write to whichever the current "remember" choice selects.
const rememberAwareStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key) ?? sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      activeStore().setItem(key, value);
    } catch {
      // ignore quota/availability errors
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // PKCE puts the recovery/login token in a `?code=` query param, which survives our
    // HashRouter. The implicit flow's `#access_token=...` fragment would collide with
    // hash-based routes, so we explicitly opt into PKCE.
    detectSessionInUrl: true,
    flowType: "pkce",
    storage: rememberAwareStorage,
  },
});
