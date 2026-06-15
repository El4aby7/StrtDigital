import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ActivityEntry,
  AppData,
  Expense,
  Lead,
  LeadStage,
  User,
} from "../types";
import * as repo from "./supabaseRepo";
import { useAuth } from "./AuthContext";

export interface UserKpis {
  user: User;
  leadsOwned: number;
  won: number;
  lost: number;
  revenue: number;
  expenses: number;
  conversion: number; // percent
}

interface AppDataContextValue {
  users: User[];
  leads: Lead[];
  expenses: Expense[];
  /** true until the first Supabase load resolves */
  loading: boolean;
  /** the signed-in user's profile (null until loaded) */
  currentUser: User | null;
  /** convenience: is the signed-in user an admin? */
  isAdmin: boolean;
  // lookups
  getUser: (id: string) => User | undefined;
  getLead: (id: string) => Lead | undefined;
  // lead mutations
  upsertLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  setLeadStage: (id: string, stage: LeadStage) => void;
  addActivity: (leadId: string, entry: Omit<ActivityEntry, "id" | "at">) => void;
  // expense mutations
  upsertExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  linkExpenseToLead: (expenseId: string, leadId: string | null) => void;
  // profile mutations
  upsertUser: (user: User) => void;
  deleteUser: (id: string) => void;
  // selectors
  expensesByLead: (leadId: string) => Expense[];
  leadAcquisitionCost: (leadId: string) => number;
  userKpis: (userId: string) => UserKpis;
  allUserKpis: () => UserKpis[];
  reload: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

const EMPTY: AppData = { users: [], leads: [], expenses: [] };
const nowIso = () => new Date().toISOString();
const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;

// Persist failures shouldn't crash the optimistic UI — surface them in the console.
function reportError(context: string) {
  return (err: unknown) => console.error(`[AppData] ${context} failed:`, err);
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const [data, setData] = useState<AppData>(EMPTY);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      await repo.ensureOwnProfile().catch(reportError("ensureOwnProfile"));
      const fresh = await repo.loadAll();
      setData(fresh);
    } catch (err) {
      reportError("load")(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load CRM data only once the auth session is restored and the user is signed
  // in, so every Supabase request carries the user's token. Loading on mount
  // raced session restoration: an early request went out as `anon`, RLS returned
  // an empty array, and that empty response could overwrite the real data.
  useEffect(() => {
    if (authLoading) return; // wait for the session check to resolve
    if (!isAuthenticated) {
      setData(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    reload();
  }, [authLoading, isAuthenticated, reload]);

  const getUser = useCallback((id: string) => data.users.find((u) => u.id === id), [data.users]);
  const getLead = useCallback((id: string) => data.leads.find((l) => l.id === id), [data.leads]);

  const upsertLead = useCallback(
    (lead: Lead) => {
      const stamped = { ...lead, updated_at: nowIso() };
      let isNew = false;
      setData((prev) => {
        const exists = prev.leads.some((l) => l.id === lead.id);
        isNew = !exists;
        return {
          ...prev,
          leads: exists
            ? prev.leads.map((l) => (l.id === lead.id ? stamped : l))
            : [{ ...stamped, created_at: stamped.created_at || nowIso() }, ...prev.leads],
        };
      });
      repo.upsertLead(stamped, isNew).catch(reportError("upsertLead"));
    },
    [],
  );

  const deleteLead = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== id),
      // detach any expenses pointing at the removed lead (DB does this via ON DELETE SET NULL)
      expenses: prev.expenses.map((e) => (e.lead_id === id ? { ...e, lead_id: null } : e)),
    }));
    repo.deleteLead(id).catch(reportError("deleteLead"));
  }, []);

  const setLeadStage = useCallback((id: string, stage: LeadStage) => {
    setData((prev) => {
      let updated: Lead | null = null;
      const leads = prev.leads.map((l) => {
        if (l.id !== id || l.stage === stage) return l;
        const at = nowIso();
        updated = {
          ...l,
          stage,
          updated_at: at,
          stage_history: [...l.stage_history, { stage, at }],
          activity: [
            { id: newId(), type: "stage", text: `Stage changed to ${stage}`, at },
            ...l.activity,
          ],
        };
        return updated;
      });
      if (updated) repo.upsertLead(updated, false).catch(reportError("setLeadStage"));
      return { ...prev, leads };
    });
  }, []);

  const addActivity = useCallback(
    (leadId: string, entry: Omit<ActivityEntry, "id" | "at">) => {
      setData((prev) => {
        let updated: Lead | null = null;
        const leads = prev.leads.map((l) => {
          if (l.id !== leadId) return l;
          updated = {
            ...l,
            updated_at: nowIso(),
            activity: [{ ...entry, id: newId(), at: nowIso() }, ...l.activity],
          };
          return updated;
        });
        if (updated) repo.upsertLead(updated, false).catch(reportError("addActivity"));
        return { ...prev, leads };
      });
    },
    [],
  );

  const upsertExpense = useCallback((expense: Expense) => {
    let isNew = false;
    setData((prev) => {
      const exists = prev.expenses.some((e) => e.id === expense.id);
      isNew = !exists;
      return {
        ...prev,
        expenses: exists
          ? prev.expenses.map((e) => (e.id === expense.id ? expense : e))
          : [expense, ...prev.expenses],
      };
    });
    repo.upsertExpense(expense, isNew).catch(reportError("upsertExpense"));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    let receiptPath: string | null | undefined;
    setData((prev) => {
      receiptPath = prev.expenses.find((e) => e.id === id)?.receipt?.path;
      return { ...prev, expenses: prev.expenses.filter((e) => e.id !== id) };
    });
    repo.deleteExpense(id, receiptPath).catch(reportError("deleteExpense"));
  }, []);

  const linkExpenseToLead = useCallback((expenseId: string, leadId: string | null) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === expenseId ? { ...e, lead_id: leadId } : e)),
    }));
    repo.setExpenseLead(expenseId, leadId).catch(reportError("linkExpenseToLead"));
  }, []);

  const upsertUser = useCallback((user: User) => {
    setData((prev) => {
      const exists = prev.users.some((u) => u.id === user.id);
      return {
        ...prev,
        users: exists
          ? prev.users.map((u) => (u.id === user.id ? user : u))
          : [...prev.users, user],
      };
    });
    repo.upsertProfile(user).catch(reportError("upsertUser"));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id),
      // mirror the DB's ON DELETE SET NULL on leads.owner_id
      leads: prev.leads.map((l) => (l.owner_id === id ? { ...l, owner_id: "" } : l)),
    }));
    repo.deleteProfile(id).catch(reportError("deleteUser"));
  }, []);

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === authUser?.id) ?? null,
    [data.users, authUser?.id],
  );
  const isAdmin = !!currentUser?.is_admin;

  const expensesByLead = useCallback(
    (leadId: string) => data.expenses.filter((e) => e.lead_id === leadId),
    [data.expenses],
  );

  const leadAcquisitionCost = useCallback(
    (leadId: string) =>
      data.expenses.filter((e) => e.lead_id === leadId).reduce((sum, e) => sum + e.amount, 0),
    [data.expenses],
  );

  const computeKpis = useCallback(
    (user: User): UserKpis => {
      const owned = data.leads.filter((l) => l.owner_id === user.id);
      const won = owned.filter((l) => l.stage === "won");
      const lost = owned.filter((l) => l.stage === "lost");
      const ownedIds = new Set(owned.map((l) => l.id));
      const expenses = data.expenses
        .filter((e) => e.lead_id && ownedIds.has(e.lead_id))
        .reduce((s, e) => s + e.amount, 0);
      const decided = won.length + lost.length;
      return {
        user,
        leadsOwned: owned.length,
        won: won.length,
        lost: lost.length,
        revenue: won.reduce((s, l) => s + l.value, 0),
        expenses,
        conversion: decided ? Math.round((won.length / decided) * 100) : 0,
      };
    },
    [data.leads, data.expenses],
  );

  const userKpis = useCallback(
    (userId: string) => {
      const user = data.users.find((u) => u.id === userId);
      return computeKpis(user ?? data.users[0] ?? FALLBACK_USER);
    },
    [data.users, computeKpis],
  );

  const allUserKpis = useCallback(() => data.users.map(computeKpis), [data.users, computeKpis]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      users: data.users,
      leads: data.leads,
      expenses: data.expenses,
      loading,
      currentUser,
      isAdmin,
      getUser,
      getLead,
      upsertLead,
      deleteLead,
      setLeadStage,
      addActivity,
      upsertExpense,
      deleteExpense,
      linkExpenseToLead,
      upsertUser,
      deleteUser,
      expensesByLead,
      leadAcquisitionCost,
      userKpis,
      allUserKpis,
      reload,
    }),
    [
      data,
      loading,
      currentUser,
      isAdmin,
      getUser,
      getLead,
      upsertLead,
      deleteLead,
      setLeadStage,
      addActivity,
      upsertExpense,
      deleteExpense,
      linkExpenseToLead,
      upsertUser,
      deleteUser,
      expensesByLead,
      leadAcquisitionCost,
      userKpis,
      allUserKpis,
      reload,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// Guards selectors against an empty team (e.g. before any profile loads).
const FALLBACK_USER: User = {
  id: "—",
  name: "—",
  email: "",
  role: "Member",
  avatar_color: "#14B8C4",
  avatar_url: null,
  targets: { leads: 0, won: 0, revenue: 0, conversion: 0 },
  is_admin: false,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
