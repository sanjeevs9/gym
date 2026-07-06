export const dynamic = "force-dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DateNav } from "@/components/date-nav";
import { SelectedDateProvider } from "@/components/selected-date-context";
import { PlanExerciseRow } from "@/components/forms/plan-exercise-row";
import { WORKOUT_PLAN } from "@/lib/workout-plan";
import { isValidDayKey, todayKey } from "@/lib/date";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const dateKey = isValidDayKey(params.date) ? params.date : todayKey();

  return (
    <SelectedDateProvider date={dateKey}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Workout plan</h1>
            <p className="text-sm text-muted-foreground">
              A 6-day split, one muscle group per day.
            </p>
          </div>
          <DateNav date={dateKey} basePath="/plan" />
        </div>

        <Tabs defaultValue="1">
          <TabsList className="w-full flex-wrap">
            {WORKOUT_PLAN.map((day) => (
              <TabsTrigger key={day.day} value={String(day.day)}>
                Day {day.day}
              </TabsTrigger>
            ))}
          </TabsList>

          {WORKOUT_PLAN.map((day) => (
            <TabsContent key={day.day} value={String(day.day)} className="pt-4">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-base font-semibold">{day.muscle}</h2>
                <Badge variant="secondary">{day.exercises.length} exercises</Badge>
              </div>
              <ul className="space-y-2">
                {day.exercises.map((exercise) => (
                  <PlanExerciseRow
                    key={exercise.name}
                    name={exercise.name}
                    equipment={exercise.equipment}
                    images={exercise.images}
                  />
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SelectedDateProvider>
  );
}
