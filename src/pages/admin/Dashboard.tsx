import { useMemo, useState } from "react";
import { DollarSign, Users, Target, Wallet } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { KPIStat } from "../../components/ui/KPIStat";
import { Card } from "../../components/ui/Card";
import { TrendLineChart } from "../../components/charts/TrendLineChart";
import { StageBarChart } from "../../components/charts/StageBarChart";
import { SourceDonut } from "../../components/charts/SourceDonut";
import { useAppData } from "../../store/AppDataProvider";
import { formatCurrency, formatPercent } from "../../lib/format";
import { LEAD_STAGES, STAGE_LABELS, LEAD_SOURCES } from "../../types";
import { colors } from "../../theme/tokens";

type Range = "30" | "90" | "ytd" | "all";

const RANGES: { value: Range; label: string }[] = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "ytd", label: "This year" },
  { value: "all", label: "All time" },
];

const NOW = new Date("2026-06-10");

function cutoffFor(range: Range): Date | null {
  if (range === "all") return null;
  if (range === "ytd") return new Date("2026-01-01");
  const days = range === "30" ? 30 : 90;
  return new Date(NOW.getTime() - days * 86_400_000);
}

function monthKey(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

export function Dashboard() {
  const { leads, expenses } = useAppData();
  const [range, setRange] = useState<Range>("90");

  const metrics = useMemo(() => {
    const cutoff = cutoffFor(range);
    const inRange = (iso: string) => !cutoff || new Date(iso) >= cutoff;

    const fLeads = leads.filter((l) => inRange(l.created_at));
    const fExpenses = expenses.filter((e) => inRange(e.date));

    const won = fLeads.filter((l) => l.stage === "won");
    const lost = fLeads.filter((l) => l.stage === "lost");
    const active = fLeads.filter((l) => !["won", "lost"].includes(l.stage));
    const decided = won.length + lost.length;

    const revenue = won.reduce((s, l) => s + l.value, 0);
    const totalExpenses = fExpenses.reduce((s, e) => s + e.amount, 0);
    const conversion = decided ? (won.length / decided) * 100 : 0;

    // monthly series across the data span
    const monthSet = new Set<string>([
      ...leads.map((l) => monthKey(l.created_at)),
      ...expenses.map((e) => monthKey(e.date)),
    ]);
    const months = [...monthSet].sort();
    const series = months.map((m) => {
      const monthName = new Date(`${m}-01`).toLocaleDateString("en-US", { month: "short" });
      return {
        name: monthName,
        revenue: leads
          .filter((l) => l.stage === "won" && monthKey(l.updated_at) === m)
          .reduce((s, l) => s + l.value, 0),
        expenses: expenses
          .filter((e) => monthKey(e.date) === m)
          .reduce((s, e) => s + e.amount, 0),
      };
    });

    const byStage = LEAD_STAGES.map((stage) => ({
      name: STAGE_LABELS[stage],
      value: fLeads.filter((l) => l.stage === stage).length,
    }));

    const bySource = LEAD_SOURCES.map((source) => ({
      name: source,
      value: fLeads.filter((l) => l.source === source).length,
    })).filter((d) => d.value > 0);

    return {
      revenue,
      totalExpenses,
      conversion,
      activeLeads: active.length,
      series,
      byStage,
      bySource,
    };
  }, [leads, expenses, range]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your agency's KPIs at a glance."
        actions={
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            aria-label="Date range"
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-navy outline-none focus:border-teal"
          >
            {RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPIStat label="Revenue (won)" value={formatCurrency(metrics.revenue)} delta={18.2} icon={DollarSign} />
        <KPIStat label="Active leads" value={String(metrics.activeLeads)} delta={6.4} icon={Users} />
        <KPIStat label="Conversion rate" value={formatPercent(metrics.conversion)} delta={2.1} icon={Target} />
        <KPIStat
          label="Total expenses"
          value={formatCurrency(metrics.totalExpenses)}
          delta={-4.3}
          invertDelta
          icon={Wallet}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-navy">Revenue vs expenses</h3>
          </div>
          <TrendLineChart
            data={metrics.series}
            series={[
              { key: "revenue", label: "Revenue", color: colors.teal },
              { key: "expenses", label: "Expenses", color: colors.navy },
            ]}
          />
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-bold text-navy">Leads by source</h3>
          <SourceDonut data={metrics.bySource} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-bold text-navy">Leads by stage</h3>
          <StageBarChart data={metrics.byStage} />
        </Card>
        <Card className="flex flex-col justify-center gap-4">
          <h3 className="font-display text-lg font-bold text-navy">Pipeline value</h3>
          <p className="text-sm text-slate-500">
            Open opportunities currently moving through your pipeline.
          </p>
          <div className="font-display text-4xl font-bold text-gradient">
            {formatCurrency(
              leads
                .filter((l) => !["won", "lost"].includes(l.stage))
                .reduce((s, l) => s + l.value, 0),
            )}
          </div>
          <p className="text-sm text-slate-500">{metrics.activeLeads} active leads</p>
        </Card>
      </div>
    </div>
  );
}
