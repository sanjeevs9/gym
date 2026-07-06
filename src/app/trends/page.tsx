import Link from "next/link";
import { UtensilsCrossed, Flame, Beef, Scale } from "lucide-react";
import { AnalyticsCard } from "@/components/analytics-card";
import { CaloriesChart } from "@/components/charts/calories-chart";
import { MacrosChart } from "@/components/charts/macros-chart";
import { WeightChart } from "@/components/charts/weight-chart";
import { TrendsTable } from "@/components/charts/trends-table";
import { getTrends } from "@/lib/actions/summary";
import { CHART_COLORS } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

export default async function TrendsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = RANGES.some((r) => r.days === Number(params.days)) ? Number(params.days) : 30;
  const data = await getTrends(days);
  const sparklineData = data.slice(-14);

  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const avgCalories = Math.round(sum(data.map((d) => d.calories)) / days);
  const avgBurned = Math.round(sum(data.map((d) => d.caloriesBurned)) / days);
  const avgProtein = Math.round(sum(data.map((d) => d.protein)) / days);

  const weighIns = data.filter((d) => d.weightKg !== null);
  const weightChange =
    weighIns.length >= 2
      ? weighIns[weighIns.length - 1].weightKg! - weighIns[0].weightKg!
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Trends</h1>
          <p className="text-sm text-muted-foreground">
            How your intake, burn, and weight are moving over time.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {RANGES.map((r) => (
            <Link
              key={r.days}
              href={`/trends?days=${r.days}`}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                r.days === days
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Averages <span className="normal-case">over {days} days</span>
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <AnalyticsCard
            label="Avg calories in"
            value={avgCalories}
            unit="kcal/day"
            icon={UtensilsCrossed}
            accent={CHART_COLORS.caloriesIn}
            sparkline={sparklineData.map((d) => d.calories)}
            sparklineCaption="Last 14 days"
          />
          <AnalyticsCard
            label="Avg burned"
            value={avgBurned}
            unit="kcal/day"
            icon={Flame}
            accent={CHART_COLORS.caloriesBurned}
            sparkline={sparklineData.map((d) => d.caloriesBurned)}
            sparklineCaption="Last 14 days"
          />
          <AnalyticsCard
            label="Avg protein"
            value={avgProtein}
            unit="g/day"
            icon={Beef}
            accent={CHART_COLORS.protein}
            sparkline={sparklineData.map((d) => d.protein)}
            sparklineCaption="Last 14 days"
          />
          <AnalyticsCard
            label="Weight change"
            value={weightChange === null ? "—" : `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)}`}
            unit={weightChange === null ? undefined : "kg"}
            icon={Scale}
            accent={CHART_COLORS.weight}
            sparkline={sparklineData.map((d) => d.weightKg ?? 0)}
            sparklineCaption="Last 14 days"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold">Calories — in vs. burned</h2>
        <CaloriesChart data={data} />
      </div>

      <div className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold">Macros</h2>
        <MacrosChart data={data} />
      </div>

      <div className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold">Weight</h2>
        <WeightChart data={data} />
      </div>

      <details className="group rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 sm:p-5">
        <summary className="cursor-pointer text-sm font-semibold text-muted-foreground">
          View as table
        </summary>
        <div className="mt-3">
          <TrendsTable data={data} />
        </div>
      </details>
    </div>
  );
}
