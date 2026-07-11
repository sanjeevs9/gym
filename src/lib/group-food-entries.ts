type FoodEntryWithMeal = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  mealId: string | null;
  loggedAt: Date;
  meal: { name: string } | null;
};

export type FoodListRow =
  | { type: "single"; entry: FoodEntryWithMeal }
  | {
      type: "meal";
      ids: string[];
      mealName: string;
      ingredients: string[];
      // Raw per-ingredient entries (own quantity/unit/macros), kept alongside
      // the aggregate fields below so editing can target one ingredient's
      // logged snapshot without touching the others.
      items: FoodEntryWithMeal[];
      loggedAt: Date;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };

// Ingredients logged together from the same meal-logging event (same mealId +
// same loggedAt instant, since logMealAction stamps every item with one
// timestamp) collapse into a single row instead of listing each ingredient.
export function groupFoodEntries(entries: FoodEntryWithMeal[]): FoodListRow[] {
  const rows: FoodListRow[] = [];
  const groupIndex = new Map<string, number>();

  for (const entry of entries) {
    if (!entry.mealId) {
      rows.push({ type: "single", entry });
      continue;
    }

    const key = `${entry.mealId}:${entry.loggedAt.getTime()}`;
    const existingIndex = groupIndex.get(key);
    if (existingIndex === undefined) {
      groupIndex.set(key, rows.length);
      rows.push({
        type: "meal",
        ids: [entry.id],
        mealName: entry.meal?.name ?? "Meal",
        ingredients: [entry.description],
        items: [entry],
        loggedAt: entry.loggedAt,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        fiber: entry.fiber,
      });
      continue;
    }

    const group = rows[existingIndex];
    if (group.type !== "meal") continue;
    group.ids.push(entry.id);
    group.ingredients.push(entry.description);
    group.items.push(entry);
    group.calories += entry.calories;
    group.protein += entry.protein;
    group.carbs += entry.carbs;
    group.fat += entry.fat;
    group.fiber += entry.fiber;
  }

  return rows;
}
