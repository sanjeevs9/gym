export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateNav } from "@/components/date-nav";
import { SelectedDateProvider } from "@/components/selected-date-context";
import { WeightLogForm } from "@/components/forms/weight-log-form";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { getWeightEntriesInRange, deleteWeightEntryAction } from "@/lib/actions/weight";
import { lastNDaysRange, isValidDayKey, todayKey } from "@/lib/date";
import { format } from "date-fns";

export default async function WeightPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const dateKey = isValidDayKey(params.date) ? params.date : todayKey();
  const range = lastNDaysRange(60);
  const entries = await getWeightEntriesInRange(range.gte, range.lte);

  return (
    <SelectedDateProvider date={dateKey}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Weight</h1>
          <p className="text-sm text-muted-foreground">Track your weight day to day.</p>
        </div>

        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">Log weight</CardTitle>
            <DateNav date={dateKey} basePath="/weight" />
          </CardHeader>
          <CardContent>
            <WeightLogForm />
          </CardContent>
        </Card>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Recent entries</h2>
          {entries.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
              No weight logged yet.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {entries.map((entry, i) => {
                const prev = entries[i + 1];
                const delta = prev ? entry.weightKg - prev.weightKg : null;
                return (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{entry.weightKg.toFixed(1)} kg</p>
                      <p className="text-xs text-muted-foreground">
                        {format(entry.loggedAt, "EEE, MMM d 'at' h:mm a")}
                        {delta !== null && (
                          <span
                            className={delta > 0 ? "text-[#e34948]" : delta < 0 ? "text-[#0ca30c]" : ""}
                          >
                            {" "}
                            · {delta > 0 ? "+" : ""}
                            {delta.toFixed(1)} kg
                          </span>
                        )}
                      </p>
                    </div>
                    <DeleteIconButton id={entry.id} action={deleteWeightEntryAction} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </SelectedDateProvider>
  );
}
