// Domain types. Field names are snake_case so they map 1:1 to the future
// Supabase tables (leads, expenses, users) with minimal migration work.

export type LeadStage = "new" | "contacted" | "proposal" | "won" | "lost";

export const LEAD_STAGES: LeadStage[] = ["new", "contacted", "proposal", "won", "lost"];

export const STAGE_LABELS: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export type LeadSource =
  | "Referral"
  | "Website"
  | "Social"
  | "Cold Outreach"
  | "Event"
  | "Paid Ads";

export const LEAD_SOURCES: LeadSource[] = [
  "Referral",
  "Website",
  "Social",
  "Cold Outreach",
  "Event",
  "Paid Ads",
];

export type ExpenseCategory =
  | "Advertising"
  | "Software"
  | "Contractor"
  | "Travel"
  | "Hosting"
  | "Office"
  | "Other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Advertising",
  "Software",
  "Contractor",
  "Travel",
  "Hosting",
  "Office",
  "Other",
];

export interface UserTargets {
  leads: number;
  won: number;
  revenue: number;
  conversion: number; // percent target
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_color: string; // hex, for the initials avatar
  /** uploaded profile image (public avatars bucket); falls back to initials when null */
  avatar_url: string | null;
  targets: UserTargets;
  /** admin accounts are hidden from the team roster / KPIs and lead assignment */
  is_admin: boolean;
}

export interface ActivityEntry {
  id: string;
  type: "note" | "call" | "email" | "meeting" | "stage" | "created";
  text: string;
  at: string; // ISO
}

export interface StageEvent {
  stage: LeadStage;
  at: string; // ISO
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  value: number;
  stage: LeadStage;
  owner_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
  activity: ActivityEntry[];
  stage_history: StageEvent[];
}

export interface ReceiptFile {
  name: string;
  /** object path in the private `receipts` Supabase Storage bucket (viewed via signed URL). */
  path?: string;
  size?: number;
}

export interface Expense {
  id: string;
  date: string; // ISO
  category: ExpenseCategory;
  vendor: string;
  amount: number;
  description: string;
  receipt: ReceiptFile | null;
  lead_id: string | null;
}

export interface AppData {
  users: User[];
  leads: Lead[];
  expenses: Expense[];
}
