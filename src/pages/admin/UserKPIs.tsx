import { useMemo, useState } from "react";
import { Trophy, Crown, Pencil, Info, UserPlus } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { TeamMemberModal } from "../../components/admin/TeamMemberModal";
import { AddMemberModal } from "../../components/admin/AddMemberModal";
import { useAppData, type UserKpis } from "../../store/AppDataProvider";
import { useAuth } from "../../store/AuthContext";
import { formatCurrency, formatPercent } from "../../lib/format";
import { cn } from "../../lib/cn";
import type { User } from "../../types";

function Bar({ label, value, target, format }: { label: string; value: number; target: number; format?: (n: number) => string }) {
  const pct = target ? Math.min(100, Math.round((value / target) * 100)) : 0;
  const fmt = format ?? ((n: number) => String(n));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-500">{label}</span>
        <span className="text-slate-400">
          <span className="font-semibold text-navy">{fmt(value)}</span> / {fmt(target)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand-gradient transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function UserCard({ k, onEdit, canEdit }: { k: UserKpis; onEdit: () => void; canEdit: boolean }) {
  const revenuePct = k.user.targets.revenue ? k.revenue / k.user.targets.revenue : 0;
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: k.user.avatar_color }}>
          {k.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy">{k.user.name}</p>
          <p className="truncate text-xs text-slate-500">{k.user.role}</p>
        </div>
        <div className="ml-auto shrink-0">
          <ProgressRing
            value={revenuePct}
            size={64}
            stroke={7}
            label={formatPercent(Math.round(revenuePct * 100))}
            sublabel="Rev"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Bar label="Leads owned" value={k.leadsOwned} target={k.user.targets.leads} />
        <Bar label="Deals won" value={k.won} target={k.user.targets.won} />
        <Bar label="Revenue" value={k.revenue} target={k.user.targets.revenue} format={(n) => formatCurrency(n, { compact: true })} />
        <Bar label="Conversion" value={k.conversion} target={k.user.targets.conversion} format={(n) => `${n}%`} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
        <Stat label="Won" value={String(k.won)} />
        <Stat label="Lost" value={String(k.lost)} />
        <Stat label="Spend" value={formatCurrency(k.expenses, { compact: true })} />
      </div>

      {canEdit && (
        <button
          onClick={onEdit}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal hover:text-teal"
        >
          <Pencil className="h-4 w-4" /> Edit profile &amp; targets
        </button>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-lg font-bold text-navy">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

export function UserKPIs() {
  const { allUserKpis, isAdmin } = useAppData();
  const { user: authUser } = useAuth();
  // Admin accounts (e.g. the owner login) are not part of the team roster.
  const kpis = allUserKpis().filter((k) => !k.user.is_admin);
  const leaderboard = useMemo(() => [...kpis].sort((a, b) => b.revenue - a.revenue), [kpis]);

  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const openEdit = (u: User) => {
    setEditing(u);
    setOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Team KPIs"
        subtitle="Per-user progress against targets, plus the leaderboard."
        actions={
          isAdmin ? (
            <Button icon={UserPlus} onClick={() => setAddOpen(true)}>
              Add member
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 flex items-start gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
        <span>
          To add a team member, invite them in <strong className="text-navy">Supabase → Authentication → Users</strong>.
          Once they sign in they appear here, where you can set their role, colour, and KPI targets.
        </span>
      </div>

      {/* leaderboard */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-teal" />
          <h3 className="font-display text-lg font-bold text-navy">Leaderboard</h3>
        </div>
        <div className="space-y-2">
          {leaderboard.map((k, i) => (
            <div
              key={k.user.id}
              className={cn(
                "flex items-center gap-4 rounded-xl border px-4 py-3",
                i === 0 ? "border-teal/40 bg-teal/5" : "border-line",
              )}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-xs font-bold text-navy">
                {i === 0 ? <Crown className="h-4 w-4 text-teal" /> : i + 1}
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: k.user.avatar_color }}>
                {k.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{k.user.name}</p>
                <p className="text-xs text-slate-500">{k.won} won · {formatPercent(k.conversion)} conv.</p>
              </div>
              <span className="font-display text-lg font-bold text-navy">{formatCurrency(k.revenue, { compact: true })}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* per-user cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <UserCard
            key={k.user.id}
            k={k}
            canEdit={isAdmin || k.user.id === authUser?.id}
            onEdit={() => openEdit(k.user)}
          />
        ))}
      </div>

      <TeamMemberModal
        open={open}
        onClose={() => setOpen(false)}
        member={editing}
        isAdmin={isAdmin}
        isSelf={!!editing && !!authUser && editing.id === authUser.id}
      />
      <AddMemberModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
