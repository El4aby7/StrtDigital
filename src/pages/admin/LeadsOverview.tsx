import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, List, GripVertical, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StageBadge } from "../../components/ui/Badge";
import { DataTable, type Column } from "../../components/ui/Table";
import { useAppData } from "../../store/AppDataProvider";
import { formatCurrency } from "../../lib/format";
import { LEAD_STAGES, STAGE_LABELS, type Lead, type LeadStage } from "../../types";
import { cn } from "../../lib/cn";

export function LeadsOverview() {
  const { leads, users, getUser, setLeadStage, deleteLead } = useAppData();
  const navigate = useNavigate();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);

  const removeLead = (l: Lead) => {
    if (window.confirm(`Delete lead "${l.company}"? This can't be undone.`)) {
      deleteLead(l.id);
    }
  };

  const stats = useMemo(
    () =>
      LEAD_STAGES.map((stage) => ({
        stage,
        count: leads.filter((l) => l.stage === stage).length,
        value: leads.filter((l) => l.stage === stage).reduce((s, l) => s + l.value, 0),
      })),
    [leads],
  );

  const ownerName = (id: string) => getUser(id)?.name ?? "Unassigned";

  const onDrop = (stage: LeadStage) => {
    if (dragId) setLeadStage(dragId, stage);
    setDragId(null);
    setOverStage(null);
  };

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Lead",
      cell: (l) => (
        <div>
          <div className="font-medium text-navy">{l.name}</div>
          <div className="text-xs text-slate-500">{l.company}</div>
        </div>
      ),
    },
    { key: "stage", header: "Stage", cell: (l) => <StageBadge stage={l.stage} /> },
    { key: "source", header: "Source", cell: (l) => <span className="text-slate-600">{l.source}</span> },
    { key: "owner", header: "Owner", cell: (l) => <span className="text-slate-600">{ownerName(l.owner_id)}</span> },
    { key: "value", header: "Value", align: "right", cell: (l) => <span className="font-semibold text-navy">{formatCurrency(l.value)}</span> },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (l) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeLead(l);
          }}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Delete ${l.company}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Your full pipeline across every stage."
        actions={
          <>
            <div className="flex rounded-xl border border-line bg-white p-1">
              <ViewBtn active={view === "kanban"} onClick={() => setView("kanban")} icon={LayoutGrid} label="Board" />
              <ViewBtn active={view === "table"} onClick={() => setView("table")} icon={List} label="Table" />
            </div>
            <Button onClick={() => navigate("/admin/leads/new")} icon={Plus}>
              New lead
            </Button>
          </>
        }
      />

      {/* quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.stage} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {STAGE_LABELS[s.stage]}
              </span>
              <StageBadge stage={s.stage} />
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-navy">{s.count}</div>
            <div className="text-xs text-slate-400">{formatCurrency(s.value)}</div>
          </Card>
        ))}
      </div>

      {view === "table" ? (
        <DataTable
          columns={columns}
          rows={[...leads].sort((a, b) => b.value - a.value)}
          rowKey={(l) => l.id}
          onRowClick={(l) => navigate(`/admin/leads/${l.id}`)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {LEAD_STAGES.map((stage) => {
            const items = leads.filter((l) => l.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverStage(stage);
                }}
                onDrop={() => onDrop(stage)}
                className={cn(
                  "rounded-2xl border bg-surface/60 p-3 transition-colors",
                  overStage === stage ? "border-teal bg-teal/5" : "border-line",
                )}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-navy">{STAGE_LABELS[stage]}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((l) => (
                    <article
                      key={l.id}
                      draggable
                      onDragStart={() => setDragId(l.id)}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => navigate(`/admin/leads/${l.id}`)}
                      className={cn(
                        "group cursor-pointer rounded-xl border border-line bg-white p-3 shadow-sm transition-all hover:shadow-card",
                        dragId === l.id && "opacity-50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold text-navy">{l.company}</div>
                          <div className="text-xs text-slate-500">{l.name}</div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLead(l);
                            }}
                            className="grid h-6 w-6 place-items-center rounded text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            aria-label={`Delete ${l.company}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gradient">{formatCurrency(l.value)}</span>
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold text-white" title={ownerName(l.owner_id)}>
                          {ownerName(l.owner_id).split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                    </article>
                  ))}
                  {items.length === 0 && (
                    <p className="rounded-xl border border-dashed border-line py-6 text-center text-xs text-slate-400">
                      Drop here
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Tip: drag a card between columns to change its stage. {users.length} team members,{" "}
        {leads.length} total leads.
      </p>
    </div>
  );
}

function ViewBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutGrid;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-brand-gradient text-white" : "text-slate-500 hover:text-navy",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
