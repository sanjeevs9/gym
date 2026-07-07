export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateNav } from "@/components/date-nav";
import { SelectedDateProvider } from "@/components/selected-date-context";
import { ExerciseLogForm } from "@/components/forms/exercise-log-form";
import { ExerciseEntryList } from "@/components/exercise-entry-list";
import { BodyDiagram } from "@/components/body-diagram";
import { ExerciseProgress } from "@/components/exercise-progress";
import {
  getExerciseEntriesInRange,
  getMuscleGroupRecencyAction,
  getLoggedStrengthExerciseNamesAction,
} from "@/lib/actions/exercise";
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
  const [entries, muscleRecency, exerciseNames] = await Promise.all([
    getExerciseEntriesInRange(range.gte, range.lte),
    getMuscleGroupRecencyAction(),
    getLoggedStrengthExerciseNamesAction(),
  ]);
  const dayLabel = relativeDayLabel(selectedDate).toLowerCase();

  return (
    <SelectedDateProvider date={dateKey}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Exercise</h1>
          <p className="text-sm text-muted-foreground">
            Log activity, see which muscles you&apos;ve trained, and track your progress.
          </p>
        </div>

        <Tabs defaultValue="log">
          <TabsList>
            <TabsTrigger value="log">Log</TabsTrigger>
            <TabsTrigger value="muscles">Muscles</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6 pt-4">
            <div className="flex flex-wrap items-center justify-end gap-3">
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
              <ExerciseEntryList entries={entries} emptyText={`No activity logged ${dayLabel}.`} />
            </section>
          </TabsContent>

          <TabsContent value="muscles" className="pt-4">
            <BodyDiagram recency={muscleRecency} />
          </TabsContent>

          <TabsContent value="progress" className="pt-4">
            <ExerciseProgress exerciseNames={exerciseNames} />
          </TabsContent>
        </Tabs>
      </div>
    </SelectedDateProvider>
  );
}
