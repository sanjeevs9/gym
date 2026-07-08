"use server";

import { db } from "@/lib/db";
import { cached, invalidate } from "@/lib/query-cache";

export type SavedIngredientInput = {
  name: string;
  baseUnit: "g" | "ml";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export async function getSavedIngredientsAction() {
  return cached("ingredients:all", () =>
    db.savedIngredient.findMany({ orderBy: { name: "asc" } }),
  );
}

// Upserts by name, so saving an ingredient that's already stored updates its
// per-100 profile in place rather than creating a duplicate.
export async function saveIngredientAction(input: SavedIngredientInput) {
  const name = input.name.trim();
  if (!name) throw new Error("Ingredient name is required");
  if (input.baseUnit !== "g" && input.baseUnit !== "ml") {
    throw new Error("Saved ingredients must be per 100g or per 100ml");
  }

  const data = {
    baseUnit: input.baseUnit,
    calories: input.calories,
    protein: input.protein,
    carbs: input.carbs,
    fat: input.fat,
    fiber: input.fiber,
  };

  const ingredient = await db.savedIngredient.upsert({
    where: { name },
    update: data,
    create: { name, ...data },
  });
  invalidate("ingredients:");
  return ingredient;
}

export async function deleteSavedIngredientAction(id: string) {
  await db.savedIngredient.delete({ where: { id } });
  invalidate("ingredients:");
}
