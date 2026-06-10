import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { Card } from "./Card";

interface KPIStatProps {
  label: string;
  value: string;
  /** signed percentage change, e.g. 12.5 or -3.2 */
  delta?: number;
  icon?: LucideIcon;
  /** when true a negative delta is "good" (e.g. expenses falling) */
  invertDelta?: boolean;
}

export function KPIStat({ label, value, delta, icon: Icon, invertDelta }: KPIStatProps) {
  const up = (delta ?? 0) >= 0;
  const good = invertDelta ? !up : up;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient-soft text-teal-dark">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-navy">{value}</div>
      {delta !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
              good ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
            )}
          >
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%
          </span>
          <span className="text-slate-400">vs last period</span>
        </div>
      )}
    </Card>
  );
}
