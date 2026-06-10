import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Tag,
  Plus,
  Pencil,
  X,
  Paperclip,
  Send,
} from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StageBadge } from "../../components/ui/Badge";
import { ExpenseModal } from "../../components/admin/ExpenseModal";
import { useAppData } from "../../store/AppDataProvider";
import { formatCurrency, formatDate, formatRelative } from "../../lib/format";
import { LEAD_STAGES, STAGE_LABELS, type LeadStage } from "../../types";
import { cn } from "../../lib/cn";

export function LeadDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const {
    getLead,
    getUser,
    setLeadStage,
    addActivity,
    expensesByLead,
    leadAcquisitionCost,
    linkExpenseToLead,
  } = useAppData();

  const lead = getLead(id);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [note, setNote] = useState("");

  if (!lead) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <p className="text-slate-500">Lead not found.</p>
        <Link to="/admin/leads" className="mt-3 inline-block text-sm font-medium text-teal">
          ← Back to leads
        </Link>
      </Card>
    );
  }

  const owner = getUser(lead.owner_id);
  const linked = expensesByLead(lead.id);
  const cost = leadAcquisitionCost(lead.id);

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    addActivity(lead.id, { type: "note", text: note.trim() });
    setNote("");
  };

  return (
    <div>
      <Link to="/admin/leads" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      <PageHeader
        title={lead.company}
        subtitle={`${lead.name} · ${lead.source}`}
        actions={
          <Button variant="outline" icon={Pencil} onClick={() => navigate(`/admin/leads/${lead.id}/edit`)}>
            Edit
          </Button>
        }
      />

      {/* stage workflow */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Stage</span>
            <div className="flex flex-wrap gap-1.5">
              {LEAD_STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setLeadStage(lead.id, stage)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    lead.stage === stage
                      ? "bg-brand-gradient text-white shadow-card"
                      : "bg-surface text-slate-500 hover:text-navy",
                  )}
                >
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Deal value</p>
            <p className="font-display text-2xl font-bold text-navy">{formatCurrency(lead.value)}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 font-display text-lg font-bold text-navy">Contact</h3>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Info icon={Mail} label="Email" value={<a href={`mailto:${lead.email}`} className="hover:text-teal">{lead.email}</a>} />
              <Info icon={Phone} label="Phone" value={lead.phone} />
              <Info icon={Building2} label="Company" value={lead.company} />
              <Info icon={Tag} label="Source" value={lead.source} />
            </dl>
            {lead.notes && (
              <div className="mt-5 rounded-xl bg-surface p-4 text-sm text-slate-600">{lead.notes}</div>
            )}
          </Card>

          {/* activity */}
          <Card>
            <h3 className="mb-4 font-display text-lg font-bold text-navy">Activity</h3>
            <form onSubmit={submitNote} className="mb-5 flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note…"
                className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-teal focus:bg-white"
              />
              <Button type="submit" icon={Send} size="sm">
                Add
              </Button>
            </form>
            <ol className="relative space-y-4 border-l border-line pl-5">
              {lead.activity.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[1.42rem] top-1 h-2.5 w-2.5 rounded-full bg-teal ring-4 ring-white" />
                  <p className="text-sm text-navy">{a.text}</p>
                  <p className="text-xs text-slate-400">
                    {formatRelative(a.at)} · {formatDate(a.at)}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* sidebar */}
        <div className="space-y-6">
          {/* owner + cost-to-acquire */}
          <Card>
            <h3 className="mb-4 font-display text-lg font-bold text-navy">Owner</h3>
            <div className="flex items-center gap-3">
              <span
                className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                style={{ background: owner?.avatar_color ?? "#14B8C4" }}
              >
                {owner?.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{owner?.name}</p>
                <p className="text-xs text-slate-500">{owner?.role}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
              <div>
                <p className="text-xs text-slate-400">Cost to acquire</p>
                <p className="font-display text-xl font-bold text-navy">{formatCurrency(cost)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Net (value − cost)</p>
                <p className="font-display text-xl font-bold text-gradient">
                  {formatCurrency(lead.value - cost)}
                </p>
              </div>
            </div>
          </Card>

          {/* linked expenses */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-navy">Linked expenses</h3>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => setExpenseOpen(true)}>
                Add
              </Button>
            </div>
            {linked.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line py-6 text-center text-xs text-slate-400">
                No expenses linked yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {linked.map((e) => (
                  <li key={e.id} className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy">{e.vendor}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        {e.category} · {formatDate(e.date)}
                        {e.receipt && <Paperclip className="h-3 w-3 text-teal" />}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-navy">{formatCurrency(e.amount)}</span>
                      <button
                        onClick={() => linkExpenseToLead(e.id, null)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Unlink expense"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="font-medium text-slate-500">Running total</span>
              <span className="font-display text-lg font-bold text-navy">{formatCurrency(cost)}</span>
            </div>
          </Card>

          {/* stage history */}
          <Card>
            <h3 className="mb-4 font-display text-lg font-bold text-navy">Stage history</h3>
            <ol className="space-y-3">
              {lead.stage_history.map((s, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <StageBadge stage={s.stage as LeadStage} />
                  <span className="text-xs text-slate-400">{formatDate(s.at)}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <ExpenseModal open={expenseOpen} onClose={() => setExpenseOpen(false)} presetLeadId={lead.id} />
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient-soft text-teal-dark">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-400">{label}</dt>
        <dd className="truncate text-sm font-medium text-navy">{value}</dd>
      </div>
    </div>
  );
}
