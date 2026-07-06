import type { LucideIcon } from "lucide-react";
import { Sparkline } from "@/components/sparkline";

export function AnalyticsCard({
  label,
  value,
  unit,
  icon: Icon,
  accent,
  sparkline,
  sparklineCaption,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  accent: string;
  sparkline?: number[];
  sparklineCaption?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-foreground/5 sm:p-4">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9"
          style={{ backgroundColor: accent }}
        >
          <Icon className="h-4 w-4 text-white sm:h-4.5 sm:w-4.5" />
        </span>
        <span className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
          {label}
        </span>
      </div>
      <div className="mt-2.5 text-xl font-semibold tracking-tight text-foreground sm:mt-3 sm:text-2xl">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </div>
      {sparkline && (
        <div className="mt-2.5 sm:mt-3">
          {sparklineCaption && (
            <p className="mb-1.5 text-[11px] text-muted-foreground">{sparklineCaption}</p>
          )}
          <Sparkline values={sparkline} color={accent} />
        </div>
      )}
    </div>
  );
}
