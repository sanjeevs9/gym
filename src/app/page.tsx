export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Flame,
  UtensilsCrossed,
  Dumbbell,
  Scale,
  PlusCircle,
  Beef,
  Wheat,
  Droplet,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { AnalyticsCard } from "@/components/analytics-card";
import { QuickAddDialog } from "@/components/quick-add-dialog";
import { DateNav } from "@/components/date-nav";
import { SelectedDateProvider } from "@/components/selected-date-context";
import { FoodLogForm } from "@/components/forms/food-log-form";
import { ExerciseLogForm } from "@/components/forms/exercise-log-form";
import { WeightLogForm } from "@/components/forms/weight-log-form";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { FoodEntryList } from "@/components/food-entry-list";
import { getDailySummary, getTrends } from "@/lib/actions/summary";
import { getFoodEntriesInRange } from "@/lib/actions/food";
import { getExerciseEntriesInRange, deleteExerciseEntryAction } from "@/lib/actions/exercise";
import {
  dayRange,
  isValidDayKey,
  parseDayKey,
  relativeDayLabel,
  todayKey,
  formatInAppTz,
} from "@/lib/date";
import { CHART_COLORS } from "@/lib/chart-colors";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const dateKey = isValidDayKey(params.date) ? params.date : todayKey();
  const selectedDate = parseDayKey(dateKey);
  const range = dayRange(selectedDate);

  const [summary, foodEntries, exerciseEntries, trends] = await Promise.all([
    getDailySummary(selectedDate),
    getFoodEntriesInRange(range.gte, range.lte),
    getExerciseEntriesInRange(range.gte, range.lte),
    getTrends(7),
  ]);

  return (
    <SelectedDateProvider date={dateKey}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {relativeDayLabel(selectedDate)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatInAppTz(selectedDate, "EEEE, MMMM d")}
            </p>
          </div>
          <DateNav date={dateKey} basePath="/" />
        </div>

        <div className="flex flex-wrap gap-2">
          <QuickAddDialog
            label="Log food"
            title="Log food"
            icon={<UtensilsCrossed className="h-4 w-4" />}
            className="rounded-full px-4"
          >
            <FoodLogForm />
          </QuickAddDialog>
          <QuickAddDialog
            label="Log exercise"
            title="Log exercise"
            icon={<Dumbbell className="h-4 w-4" />}
            variant="secondary"
            className="rounded-full px-4 shadow-sm ring-1 ring-foreground/5"
          >
            <ExerciseLogForm />
          </QuickAddDialog>
          <QuickAddDialog
            label="Log weight"
            title="Log weight"
            icon={<Scale className="h-4 w-4" />}
            variant="secondary"
            className="rounded-full px-4 shadow-sm ring-1 ring-foreground/5"
          >
            <WeightLogForm />
          </QuickAddDialog>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Overview
            </p>
            <Link
              href="/profile"
              className="text-xs text-muted-foreground underline underline-offset-2"
            >
              BMI &amp; body fat →
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: CHART_COLORS.weight }}
            >
              <Scale className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="text-xl font-semibold tracking-tight">
                {summary.weightKg ? summary.weightKg.toFixed(1) : "—"}
                {summary.weightKg && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">kg</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Statistics <span className="normal-case">this week</span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <AnalyticsCard
              label="Calories in"
              value={Math.round(summary.calories)}
              unit="kcal"
              icon={UtensilsCrossed}
              accent={CHART_COLORS.caloriesIn}
              sparkline={trends.map((t) => t.calories)}
              sparklineCaption="This week"
            />
            <AnalyticsCard
              label="Calories burned"
              value={Math.round(summary.caloriesBurned)}
              unit="kcal"
              icon={Flame}
              accent={CHART_COLORS.caloriesBurned}
              sparkline={trends.map((t) => t.caloriesBurned)}
              sparklineCaption="This week"
            />
            <AnalyticsCard
              label="Protein"
              value={Math.round(summary.protein)}
              unit="g"
              icon={Beef}
              accent={CHART_COLORS.protein}
              sparkline={trends.map((t) => t.protein)}
              sparklineCaption="This week"
            />
            <AnalyticsCard
              label="Net calories"
              value={Math.round(summary.net)}
              unit="kcal"
              icon={Flame}
              accent={CHART_COLORS.net}
              sparkline={trends.map((t) => Math.max(0, t.net))}
              sparklineCaption="This week"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MacroTile label="Carbs" grams={summary.carbs} color={CHART_COLORS.carbs} icon={Wheat} />
          <MacroTile label="Fat" grams={summary.fat} color={CHART_COLORS.fat} icon={Droplet} />
          <MacroTile label="Fiber" grams={summary.fiber} color={CHART_COLORS.fiber} icon={Leaf} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Food</h2>
            <FoodEntryList entries={foodEntries} emptyText="Nothing logged yet." />
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Exercise</h2>
            {exerciseEntries.length === 0 ? (
              <EmptyState text="No activity logged yet." />
            ) : (
              <ul className="space-y-1.5">
                {exerciseEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2 text-sm shadow-sm ring-1 ring-foreground/5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(entry.caloriesBurned)} kcal burned
                        {entry.estimatedByAi ? " · AI estimate" : ""}
                      </p>
                    </div>
                    <DeleteIconButton id={entry.id} action={deleteExerciseEntryAction} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </SelectedDateProvider>
  );
}

function MacroTile({
  label,
  grams,
  color,
  icon: Icon,
}: {
  label: string;
  grams: number;
  color: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-sm ring-1 ring-foreground/5">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1a` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </span>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tracking-tight">
        {Math.round(grams)}
        <span className="ml-0.5 text-xs font-normal text-muted-foreground">g</span>
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
      <PlusCircle className="h-4 w-4" />
      {text}
    </div>
  );
}
