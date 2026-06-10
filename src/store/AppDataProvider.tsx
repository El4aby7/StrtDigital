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
import { repository } from "./repository";

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
  // selectors
  expensesByLead: (leadId: string) => Expense[];
  leadAcquisitionCost: (leadId: string) => number;
  userKpis: (userId: string) => UserKpis;
  allUserKpis: () => UserKpis[];
  resetData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

const nowIso = () => new Date().toISOString();
const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => repository.load());

  useEffect(() => {
    repository.persist(data);
  }, [data]);

  const getUser = useCallback(
    (id: string) => data.users.find((u) => u.id === id),
    [data.users],
  );
  const getLead = useCallback(
    (id: string) => data.leads.find((l) => l.id === id),
    [data.leads],
  );

  const upsertLead = useCallback((lead: Lead) => {
    setData((prev) => {
      const exists = prev.leads.some((l) => l.id === lead.id);
      const stamped = { ...lead, updated_at: nowIso() };
      return {
        ...prev,
        leads: exists
          ? prev.leads.map((l) => (l.id === lead.id ? stamped : l))
          : [{ ...stamped, created_at: stamped.created_at || nowIso() }, ...prev.leads],
      };
    });
  }, []);

  const deleteLead = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== id),
      // detach any expenses pointing at the removed lead
      expenses: prev.expenses.map((e) =>
        e.lead_id === id ? { ...e, lead_id: null } : e,
      ),
    }));
  }, []);

  const setLeadStage = useCallback((id: string, stage: LeadStage) => {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => {
        if (l.id !== id || l.stage === stage) return l;
        const at = nowIso();
        return {
          ...l,
          stage,
          updated_at: at,
          stage_history: [...l.stage_history, { stage, at }],
          activity: [
            { id: newId(), type: "stage", text: `Stage changed to ${stage}`, at },
            ...l.activity,
          ],
        };
      }),
    }));
  }, []);

  const addActivity = useCallback(
    (leadId: string, entry: Omit<ActivityEntry, "id" | "at">) => {
      setData((prev) => ({
        ...prev,
        leads: prev.leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                updated_at: nowIso(),
                activity: [{ ...entry, id: newId(), at: nowIso() }, ...l.activity],
              }
            : l,
        ),
      }));
    },
    [],
  );

  const upsertExpense = useCallback((expense: Expense) => {
    setData((prev) => {
      const exists = prev.expenses.some((e) => e.id === expense.id);
      return {
        ...prev,
        expenses: exists
          ? prev.expenses.map((e) => (e.id === expense.id ? expense : e))
          : [expense, ...prev.expenses],
      };
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  }, []);

  const linkExpenseToLead = useCallback((expenseId: string, leadId: string | null) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) =>
        e.id === expenseId ? { ...e, lead_id: leadId } : e,
      ),
    }));
  }, []);

  const expensesByLead = useCallback(
    (leadId: string) => data.expenses.filter((e) => e.lead_id === leadId),
    [data.expenses],
  );

  const leadAcquisitionCost = useCallback(
    (leadId: string) =>
      data.expenses
        .filter((e) => e.lead_id === leadId)
        .reduce((sum, e) => sum + e.amount, 0),
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
      return computeKpis(user ?? data.users[0]);
    },
    [data.users, computeKpis],
  );

  const allUserKpis = useCallback(
    () => data.users.map(computeKpis),
    [data.users, computeKpis],
  );

  const resetData = useCallback(() => setData(repository.reset()), []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      users: data.users,
      leads: data.leads,
      expenses: data.expenses,
      getUser,
      getLead,
      upsertLead,
      deleteLead,
      setLeadStage,
      addActivity,
      upsertExpense,
      deleteExpense,
      linkExpenseToLead,
      expensesByLead,
      leadAcquisitionCost,
      userKpis,
      allUserKpis,
      resetData,
    }),
    [
      data,
      getUser,
      getLead,
      upsertLead,
      deleteLead,
      setLeadStage,
      addActivity,
      upsertExpense,
      deleteExpense,
      linkExpenseToLead,
      expensesByLead,
      leadAcquisitionCost,
      userKpis,
      allUserKpis,
      resetData,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
