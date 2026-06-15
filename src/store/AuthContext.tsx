import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, setRememberMe } from "../lib/supabase";

// Real Supabase auth gate for the admin area. Invite-only: public signup is disabled
// in Supabase, so there is no sign-up UI here. Sign-in / reset all run client-side
// (browser → Supabase), which is what keeps this static GitHub Pages build working.

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** true until the initial session check resolves — guards against redirect-on-refresh */
  loading: boolean;
  /** true after a password-recovery link is opened, until the password is updated */
  isRecovery: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<AuthResult>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Pretty-print a display name from metadata, falling back to the email prefix.
function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  const email = user.email ?? "";
  const metaName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);
  const name =
    metaName ??
    email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  return { id: user.id, name, email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(toAuthUser(data.session?.user ?? null));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(toAuthUser(session?.user ?? null));
      setLoading(false);
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember = true): Promise<AuthResult> => {
      if (!email.trim() || !password.trim()) {
        return { ok: false, error: "Enter your email and password." };
      }
      setRememberMe(remember);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsRecovery(false);
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    if (!email.trim()) return { ok: false, error: "Enter your email." };
    // Land the recovery link on the app's entry URL (no hash route appended) — correct
    // for both a custom domain and a /StrtDigital/ project subpath. Supabase appends the
    // PKCE `?code=`, which detectSessionInUrl exchanges → fires PASSWORD_RECOVERY.
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
    if (newPassword.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    setIsRecovery(false);
    return { ok: true };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      isRecovery,
      login,
      logout,
      requestPasswordReset,
      updatePassword,
    }),
    [user, loading, isRecovery, login, logout, requestPasswordReset, updatePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
