export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateNav } from "@/components/date-nav";
import { SelectedDateProvider } from "@/components/selected-date-context";
import { ExerciseLogForm } from "@/components/forms/exercise-log-form";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { getExerciseEntriesInRange, deleteExerciseEntryAction } from "@/lib/actions/exercise";
import { dayRange, isValidDayKey, parseDayKey, relativeDayLabel, todayKey } from "@/lib/date";

export default async function ExercisePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const dateKey = isValidDayKey(params.date) ? params.date : todayKey();
  const selectedDate = parseDayKey(dateKey);
  const range = dayRange(selectedDate);
  const entries = await getExerciseEntriesInRange(range.gte, range.lte);
  const dayLabel = relativeDayLabel(selectedDate).toLowerCase();

  return (
    <SelectedDateProvider date={dateKey}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Log exercise</h1>
            <p className="text-sm text-muted-foreground">
              Cardio, strength training, or steps — AI estimates the calories burned.
            </p>
          </div>
          <DateNav date={dateKey} basePath="/exercise" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseLogForm />
          </CardContent>
        </Card>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Activity {dayLabel}</h2>
          {entries.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
              No activity logged {dayLabel}.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.type.charAt(0) + entry.type.slice(1).toLowerCase()} ·{" "}
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
    </SelectedDateProvider>
  );
}
