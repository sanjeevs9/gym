export const dynamic = "force-dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DateNav } from "@/components/date-nav";
import { PlanSwitcher } from "@/components/plan-switcher";
import { SelectedDateProvider } from "@/components/selected-date-context";
import { PlanExerciseRow } from "@/components/forms/plan-exercise-row";
import { WORKOUT_PLANS } from "@/lib/workout-plan";
import { isValidDayKey, todayKey } from "@/lib/date";

const DEFAULT_PLAN_ID = WORKOUT_PLANS[0].id;

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const dateKey = isValidDayKey(params.date) ? params.date : todayKey();
  const activePlan =
    WORKOUT_PLANS.find((plan) => plan.id === params.plan) ?? WORKOUT_PLANS[0];

  return (
    <SelectedDateProvider date={dateKey}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Workout plan</h1>
            <p className="text-sm text-muted-foreground">{activePlan.description}</p>
          </div>
          <DateNav date={dateKey} basePath="/plan" />
        </div>

        <PlanSwitcher
          plans={WORKOUT_PLANS}
          activePlanId={activePlan.id}
          defaultPlanId={DEFAULT_PLAN_ID}
        />

        <Tabs key={activePlan.id} defaultValue={String(activePlan.days[0].day)}>
          <TabsList className="w-full flex-wrap">
            {activePlan.days.map((day) => (
              <TabsTrigger key={day.day} value={String(day.day)}>
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {activePlan.days.map((day) => (
            <TabsContent key={day.day} value={String(day.day)} className="pt-4">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-base font-semibold">{day.title}</h2>
                <Badge variant="secondary">{day.exercises.length} exercises</Badge>
              </div>
              {day.note && <p className="mb-3 text-sm text-muted-foreground">{day.note}</p>}
              <ul className="space-y-2">
                {day.exercises.map((exercise) => (
                  <PlanExerciseRow
                    key={exercise.name}
                    name={exercise.name}
                    equipment={exercise.equipment}
                    images={exercise.images}
                    targetSets={exercise.targetSets}
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
