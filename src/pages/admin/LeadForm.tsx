import { useState } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppData } from "../../store/AppDataProvider";
import { newId } from "../../lib/id";
import {
  LEAD_SOURCES,
  LEAD_STAGES,
  STAGE_LABELS,
  type Lead,
  type LeadSource,
  type LeadStage,
} from "../../types";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";

export function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLead, upsertLead, users, isAdmin } = useAppData();
  const existing = id ? getLead(id) : undefined;
  const isEdit = !!existing;
  // Leads are assigned to team members, not admin accounts.
  const assignable = users.filter((u) => !u.is_admin);

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    company: existing?.company ?? "",
    email: existing?.email ?? "",
    phone: existing?.phone ?? "",
    source: existing?.source ?? ("Website" as LeadSource),
    value: existing?.value?.toString() ?? "",
    stage: existing?.stage ?? ("new" as LeadStage),
    owner_id: existing?.owner_id ?? assignable[0]?.id ?? "",
    notes: existing?.notes ?? "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Only admins can create/edit leads (members are view-only).
  if (!isAdmin) return <Navigate to="/admin/leads" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const lead: Lead = {
      id: existing?.id ?? newId("l"),
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      source: form.source,
      value: Number(form.value) || 0,
      stage: form.stage,
      owner_id: form.owner_id,
      notes: form.notes.trim(),
      created_at: existing?.created_at ?? now,
      updated_at: now,
      activity: existing?.activity ?? [
        { id: newId("a"), type: "created", text: "Lead created", at: now },
      ],
      stage_history: existing?.stage_history ?? [{ stage: form.stage, at: now }],
    };
    upsertLead(lead);
    navigate(`/admin/leads/${lead.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/leads" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>
      <PageHeader title={isEdit ? "Edit lead" : "New lead"} subtitle="Capture, qualify, and assign." />

      <Card padded>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact name">
              <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Jane Doe" />
            </Field>
            <Field label="Company">
              <input className={inputClass} value={form.company} onChange={(e) => set("company", e.target.value)} required placeholder="Acme Inc." />
            </Field>
            <Field label="Email">
              <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@acme.com" />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+20 100 000 0000" />
            </Field>
            <Field label="Source">
              <select className={inputClass} value={form.source} onChange={(e) => set("source", e.target.value)}>
                {LEAD_SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Deal value (USD)">
              <input type="number" min="0" step="100" className={inputClass} value={form.value} onChange={(e) => set("value", e.target.value)} placeholder="0" />
            </Field>
            <Field label="Stage">
              <select className={inputClass} value={form.stage} onChange={(e) => set("stage", e.target.value)}>
                {LEAD_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assigned to">
              <select className={inputClass} value={form.owner_id} onChange={(e) => set("owner_id", e.target.value)}>
                {assignable.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea rows={4} className={inputClass} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Context, requirements, next steps…" />
          </Field>

          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Save changes" : "Create lead"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      {children}
    </label>
  );
}
