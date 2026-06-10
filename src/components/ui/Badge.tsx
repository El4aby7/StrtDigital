import { cn } from "../../lib/cn";
import type { LeadStage } from "../../types";

const stageStyles: Record<LeadStage, string> = {
  new: "bg-slate-100 text-slate-700",
  contacted: "bg-sky-100 text-sky-700",
  proposal: "bg-amber-100 text-amber-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
};

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StageBadge({ stage }: { stage: LeadStage }) {
  const label = stage.charAt(0).toUpperCase() + stage.slice(1);
  return <Badge className={stageStyles[stage]}>{label}</Badge>;
}
