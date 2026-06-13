import { supabase } from "../lib/supabase";
import type {
  AppData,
  Expense,
  ExpenseCategory,
  Lead,
  LeadSource,
  LeadStage,
  ReceiptFile,
  User,
  UserTargets,
} from "../types";

// Supabase data layer for the CRM (profiles / leads / expenses). Replaces the old
// localStorage repository: load is async, and each mutation writes through to
// Supabase. AppDataProvider keeps an in-memory mirror for synchronous reads and
// applies changes optimistically, calling these helpers to persist.

// ── row ↔ domain mappers ─────────────────────────────────────────────────────
type Row = Record<string, unknown>;

function rowToUser(r: Row): User {
  return {
    id: String(r.id),
    name: (r.name as string) ?? "",
    email: (r.email as string) ?? "",
    role: (r.role as string) ?? "Member",
    avatar_color: (r.avatar_color as string) ?? "#14B8C4",
    targets: (r.targets as UserTargets) ?? { leads: 0, won: 0, revenue: 0, conversion: 0 },
  };
}

function rowToLead(r: Row): Lead {
  return {
    id: String(r.id),
    name: (r.name as string) ?? "",
    company: (r.company as string) ?? "",
    email: (r.email as string) ?? "",
    phone: (r.phone as string) ?? "",
    source: (r.source as LeadSource) ?? "Website",
    value: Number(r.value ?? 0),
    stage: (r.stage as LeadStage) ?? "new",
    owner_id: (r.owner_id as string) ?? "",
    notes: (r.notes as string) ?? "",
    created_at: (r.created_at as string) ?? new Date().toISOString(),
    updated_at: (r.updated_at as string) ?? new Date().toISOString(),
    activity: (r.activity as Lead["activity"]) ?? [],
    stage_history: (r.stage_history as Lead["stage_history"]) ?? [],
  };
}

function rowToExpense(r: Row): Expense {
  const path = r.receipt_path as string | null;
  return {
    id: String(r.id),
    date: (r.date as string) ?? new Date().toISOString().slice(0, 10),
    category: (r.category as ExpenseCategory) ?? "Other",
    vendor: (r.vendor as string) ?? "",
    amount: Number(r.amount ?? 0),
    description: (r.description as string) ?? "",
    receipt: path
      ? { name: (r.receipt_name as string) ?? "receipt", path, size: (r.receipt_size as number) ?? undefined }
      : null,
    lead_id: (r.lead_id as string) ?? null,
  };
}

async function currentUid(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// Safety net for accounts created before the DB's auto-profile trigger existed:
// make sure the signed-in user has a profiles row so they appear in the team list
// and can own leads. No-op when the row already exists.
export async function ensureOwnProfile(): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return;
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (existing) return;
  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email ?? "").split("@")[0];
  await supabase
    .from("profiles")
    .insert({ id: user.id, email: user.email ?? "", name });
}

// ── load everything ──────────────────────────────────────────────────────────
export async function loadAll(): Promise<AppData> {
  const [p, l, e] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: true }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("expenses").select("*").order("date", { ascending: false }),
  ]);
  if (p.error) throw p.error;
  if (l.error) throw l.error;
  if (e.error) throw e.error;
  return {
    users: (p.data ?? []).map(rowToUser),
    leads: (l.data ?? []).map(rowToLead),
    expenses: (e.data ?? []).map(rowToExpense),
  };
}

// ── leads ────────────────────────────────────────────────────────────────────
export async function upsertLead(lead: Lead, isNew: boolean): Promise<void> {
  const payload: Row = {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    value: lead.value,
    stage: lead.stage,
    owner_id: lead.owner_id || null,
    notes: lead.notes,
    activity: lead.activity,
    stage_history: lead.stage_history,
    created_at: lead.created_at,
    updated_at: lead.updated_at,
  };
  if (isNew) payload.created_by = await currentUid();
  const { error } = await supabase.from("leads").upsert(payload);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

// ── expenses ─────────────────────────────────────────────────────────────────
export async function upsertExpense(expense: Expense, isNew: boolean): Promise<void> {
  const payload: Row = {
    id: expense.id,
    date: expense.date,
    category: expense.category,
    vendor: expense.vendor,
    amount: expense.amount,
    description: expense.description,
    receipt_path: expense.receipt?.path ?? null,
    receipt_name: expense.receipt?.name ?? null,
    receipt_size: expense.receipt?.size ?? null,
    lead_id: expense.lead_id || null,
  };
  if (isNew) payload.created_by = await currentUid();
  const { error } = await supabase.from("expenses").upsert(payload);
  if (error) throw error;
}

export async function deleteExpense(id: string, receiptPath?: string | null): Promise<void> {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
  if (receiptPath) await deleteReceipt(receiptPath);
}

export async function setExpenseLead(expenseId: string, leadId: string | null): Promise<void> {
  const { error } = await supabase.from("expenses").update({ lead_id: leadId }).eq("id", expenseId);
  if (error) throw error;
}

// ── profiles (team) ──────────────────────────────────────────────────────────
export async function upsertProfile(user: User): Promise<void> {
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_color: user.avatar_color,
    targets: user.targets,
  });
  if (error) throw error;
}

// Removes the profile row only — it does NOT delete the underlying auth login
// (that needs the service role). Leads owned by them have owner_id set to null
// by the FK's ON DELETE SET NULL.
export async function deleteProfile(id: string): Promise<void> {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

// ── receipt storage ──────────────────────────────────────────────────────────
export async function uploadReceipt(file: File): Promise<ReceiptFile> {
  const uid = (await currentUid()) ?? "shared";
  const path = `${uid}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("receipts").upload(path, file, { upsert: false });
  if (error) throw error;
  return { name: file.name, path, size: file.size };
}

export async function signedReceiptUrl(path: string, expiresIn = 120): Promise<string | null> {
  const { data } = await supabase.storage.from("receipts").createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}

export async function deleteReceipt(path: string): Promise<void> {
  await supabase.storage.from("receipts").remove([path]);
}
