export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealBuilderForm } from "@/components/forms/meal-builder-form";
import { LogMealButton } from "@/components/forms/log-meal-button";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { getMealsAction, deleteMealAction } from "@/lib/actions/meals";

export default async function MealsPage() {
  const meals = await getMealsAction();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Meals</h1>
        <p className="text-sm text-muted-foreground">
          Save meals you eat often, then log them in one tap.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create a meal</CardTitle>
        </CardHeader>
        <CardContent>
          <MealBuilderForm />
        </CardContent>
      </Card>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Your meals</h2>
        {meals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
            No saved meals yet — build one above.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {meals.map((meal) => {
              const totals = meal.items.reduce(
                (acc, item) => {
                  acc.calories += item.calories;
                  acc.protein += item.protein;
                  acc.carbs += item.carbs;
                  acc.fat += item.fat;
                  acc.fiber += item.fiber;
                  return acc;
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
              );

              return (
                <div key={meal.id} className="space-y-3 rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{meal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {meal.items.map((i) => i.description).join(", ")}
                      </p>
                    </div>
                    <DeleteIconButton id={meal.id} action={deleteMealAction} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(totals.calories)} kcal · {Math.round(totals.protein)}g protein ·{" "}
                    {Math.round(totals.carbs)}g carbs · {Math.round(totals.fat)}g fat ·{" "}
                    {Math.round(totals.fiber)}g fiber
                  </p>
                  <LogMealButton mealId={meal.id} mealName={meal.name} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
