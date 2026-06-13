import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import {
  defaultContent,
  type SiteContent,
  type SiteContentKey,
} from "../data/siteContent";

// Loads editable marketing content from Supabase `site_content` (one row per
// section, key → JSON value) and layers it over the static defaults. Defaults
// render instantly so the public site never blanks; stored sections replace their
// default once the fetch resolves. The admin editor saves a whole section at once.

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  /** upsert one section's content to Supabase, then update local state */
  saveSection: <K extends SiteContentKey>(
    key: K,
    value: SiteContent[K],
  ) => Promise<{ ok: boolean; error?: string }>;
  reload: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (!error && data) {
      setContent((prev) => {
        const next = { ...prev };
        for (const row of data) {
          if (row.key in defaultContent) {
            // stored section fully replaces the default for that key
            next[row.key as SiteContentKey] = row.value as never;
          }
        }
        return next;
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveSection = useCallback(
    async <K extends SiteContentKey>(key: K, value: SiteContent[K]) => {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value, updated_at: new Date().toISOString(), updated_by: auth.user?.id ?? null });
      if (error) return { ok: false, error: error.message };
      setContent((prev) => ({ ...prev, [key]: value }));
      return { ok: true };
    },
    [],
  );

  const value = useMemo<SiteContentContextValue>(
    () => ({ content, loading, saveSection, reload }),
    [content, loading, saveSection, reload],
  );

  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
