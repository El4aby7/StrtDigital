import type { AppData, Lead, Expense, User } from "../types";

// Seed data for the admin CRM. Loaded once into localStorage, then mutable.
// Dates are anchored around mid-2026 for a realistic dashboard.

export const seedUsers: User[] = [
  {
    id: "u1",
    name: "Mona Adel",
    email: "mona@strtdigital.site",
    role: "Senior Account Lead",
    avatar_color: "#14B8C4",
    targets: { leads: 40, won: 12, revenue: 120000, conversion: 30 },
  },
  {
    id: "u2",
    name: "Youssef Hassan",
    email: "youssef@strtdigital.site",
    role: "Sales Executive",
    avatar_color: "#0D1B2A",
    targets: { leads: 35, won: 10, revenue: 90000, conversion: 28 },
  },
  {
    id: "u3",
    name: "Nour Ibrahim",
    email: "nour@strtdigital.site",
    role: "Growth Specialist",
    avatar_color: "#0E96A0",
    targets: { leads: 30, won: 9, revenue: 80000, conversion: 30 },
  },
  {
    id: "u4",
    name: "Karim Saleh",
    email: "karim@strtdigital.site",
    role: "Account Executive",
    avatar_color: "#1B3147",
    targets: { leads: 28, won: 8, revenue: 70000, conversion: 27 },
  },
];

function lead(
  id: string,
  name: string,
  company: string,
  source: Lead["source"],
  value: number,
  stage: Lead["stage"],
  owner_id: string,
  created_at: string,
  updated_at: string,
): Lead {
  const email = `${name.split(" ")[0].toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`;
  return {
    id,
    name,
    company,
    email,
    phone: "+20 100 000 0000",
    source,
    value,
    stage,
    owner_id,
    notes: "Inbound interest in a redesign + growth retainer.",
    created_at,
    updated_at,
    activity: [
      { id: `${id}-a1`, type: "created", text: "Lead created", at: created_at },
      { id: `${id}-a2`, type: "email", text: "Sent intro email and capabilities deck", at: updated_at },
    ],
    stage_history: [{ stage: "new", at: created_at }, { stage, at: updated_at }],
  };
}

export const seedLeads: Lead[] = [
  lead("l1", "Sara Mahmoud", "Lumen Health", "Referral", 48000, "won", "u1", "2026-04-02", "2026-05-12"),
  lead("l2", "Omar Khaled", "Northwind Retail", "Website", 62000, "won", "u2", "2026-03-18", "2026-05-02"),
  lead("l3", "Lina Farouk", "Atlas Logistics", "Event", 30000, "proposal", "u1", "2026-05-08", "2026-05-30"),
  lead("l4", "Tarek Nabil", "Verde Coffee", "Social", 22000, "contacted", "u3", "2026-05-20", "2026-06-01"),
  lead("l5", "Hana Yousri", "Skyline Realty", "Paid Ads", 41000, "new", "u4", "2026-06-03", "2026-06-03"),
  lead("l6", "Ziad Amin", "Cairo Eats", "Website", 18000, "proposal", "u2", "2026-05-11", "2026-06-04"),
  lead("l7", "Mariam Adel", "Pulse Fitness", "Referral", 27000, "contacted", "u3", "2026-05-25", "2026-06-05"),
  lead("l8", "Fady Rizk", "Delta Foods", "Cold Outreach", 35000, "new", "u1", "2026-06-06", "2026-06-06"),
  lead("l9", "Salma Wagdy", "Bloom Beauty", "Social", 24000, "lost", "u4", "2026-04-15", "2026-05-09"),
  lead("l10", "Hassan Magdy", "Orbit Tech", "Website", 54000, "proposal", "u2", "2026-05-02", "2026-06-02"),
  lead("l11", "Dina Sami", "Nile Travel", "Event", 16000, "contacted", "u1", "2026-05-28", "2026-06-07"),
  lead("l12", "Amr Sherif", "Vault Finance", "Referral", 72000, "new", "u3", "2026-06-08", "2026-06-08"),
];

function expense(
  id: string,
  date: string,
  category: Expense["category"],
  vendor: string,
  amount: number,
  description: string,
  lead_id: string | null,
  receiptName?: string | null,
): Expense {
  return {
    id,
    date,
    category,
    vendor,
    amount,
    description,
    receipt: receiptName ? { name: receiptName } : null,
    lead_id,
  };
}

export const seedExpenses: Expense[] = [
  expense("e1", "2026-05-04", "Advertising", "Meta Ads", 1200, "Lead-gen campaign — Lumen", "l1", "meta-invoice-may.pdf"),
  expense("e2", "2026-05-06", "Software", "Figma", 75, "Design seats", null, "figma-receipt.pdf"),
  expense("e3", "2026-05-09", "Contractor", "Freelance Copywriter", 850, "Landing page copy — Northwind", "l2", "copy-invoice.pdf"),
  expense("e4", "2026-05-12", "Advertising", "Google Ads", 1600, "Search campaign — Northwind", "l2", "google-ads-may.pdf"),
  expense("e5", "2026-05-15", "Travel", "Uber", 60, "Client meeting — Atlas", "l3", null),
  expense("e6", "2026-05-18", "Hosting", "Vercel", 40, "Staging hosting", null, "vercel-may.pdf"),
  expense("e7", "2026-05-21", "Software", "Adobe CC", 90, "Creative suite", null, null),
  expense("e8", "2026-05-24", "Contractor", "Motion Designer", 1100, "Hero animation — Verde", "l4", "motion-invoice.pdf"),
  expense("e9", "2026-05-27", "Advertising", "LinkedIn Ads", 700, "ABM campaign — Orbit Tech", "l10", "linkedin-may.pdf"),
  expense("e10", "2026-05-29", "Office", "WeWork", 320, "Coworking — May", null, "wework-may.pdf"),
  expense("e11", "2026-06-01", "Travel", "Flight", 540, "Pitch — Skyline", "l5", "flight-receipt.pdf"),
  expense("e12", "2026-06-03", "Hosting", "Supabase", 25, "Project backend", null, null),
  expense("e13", "2026-06-05", "Advertising", "Meta Ads", 980, "Retargeting — Pulse Fitness", "l7", "meta-jun.pdf"),
  expense("e14", "2026-06-07", "Software", "Linear", 48, "Project management", null, null),
];

export const seedData: AppData = {
  users: seedUsers,
  leads: seedLeads,
  expenses: seedExpenses,
};
