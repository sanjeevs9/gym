"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, UtensilsCrossed } from "lucide-react";
import { getMealsAction, logMealAction } from "@/lib/actions/meals";
import { useSelectedDateKey } from "@/components/selected-date-context";
import { useQuickAddClose } from "@/components/quick-add-dialog";
import { combineDayKeyWithNow, todayKey } from "@/lib/date";

type MealWithItems = Awaited<ReturnType<typeof getMealsAction>>[number];

export function MealPicker() {
  const [meals, setMeals] = useState<MealWithItems[] | null>(null);
  const [query, setQuery] = useState("");
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const closeDialog = useQuickAddClose();
  const dateKey = useSelectedDateKey();

  useEffect(() => {
    getMealsAction()
      .then(setMeals)
      .catch(() => setMeals([]));
  }, []);

  async function handleLog(meal: MealWithItems) {
    setLoggingId(meal.id);
    try {
      const loggedAt = dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey);
      await logMealAction(meal.id, loggedAt);
      toast.success(`Logged ${meal.name}`);
      closeDialog();
    } catch {
      toast.error("Couldn't log meal");
    } finally {
      setLoggingId(null);
    }
  }

  if (meals === null) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
        <UtensilsCrossed className="h-5 w-5" />
        <p>You haven&apos;t saved any meals yet.</p>
        <Link href="/meals" className="text-foreground underline underline-offset-2">
          Create one
        </Link>
      </div>
    );
  }

  const filtered = meals.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search your meals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <ul className="max-h-80 space-y-1.5 overflow-y-auto">
        {filtered.map((meal) => {
          const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
          return (
            <li
              key={meal.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{meal.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {Math.round(totalCalories)} kcal ·{" "}
                  {meal.items.map((i) => i.description).join(", ")}
                </p>
              </div>
              <Button size="sm" onClick={() => handleLog(meal)} disabled={loggingId === meal.id}>
                {loggingId === meal.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Log it
              </Button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No meals match &quot;{query}&quot;
          </p>
        )}
      </ul>
    </div>
  );
}
