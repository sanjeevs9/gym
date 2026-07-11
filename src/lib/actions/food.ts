"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { estimateNutrition, estimateNutritionFromDescription } from "@/lib/ai";
import { cached, invalidate } from "@/lib/query-cache";

export type LogFoodInput = {
  description: string;
  // Optional — if omitted (or unit is), the whole description is treated as
  // free text (e.g. "75g paneer bhurji") and both quantity/unit and macros
  // are parsed out of it by AI in one call. See logFoodAction.
  quantity?: number;
  unit?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  mealId?: string;
  loggedAt?: Date;
};

export type LogFoodResult = {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  aiEstimated: boolean;
};

async function resolveNutrition(input: {
  description: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}) {
  const hasAllFields =
    input.calories !== undefined &&
    input.protein !== undefined &&
    input.carbs !== undefined &&
    input.fat !== undefined &&
    input.fiber !== undefined;

  if (hasAllFields) {
    return {
      aiEstimated: false,
      calories: input.calories!,
      protein: input.protein!,
      carbs: input.carbs!,
      fat: input.fat!,
      fiber: input.fiber!,
    };
  }

  const estimate = await estimateNutrition(input.description, input.quantity, input.unit);
  return {
    aiEstimated: true,
    calories: input.calories ?? estimate.calories,
    protein: input.protein ?? estimate.protein,
    carbs: input.carbs ?? estimate.carbs,
    fat: input.fat ?? estimate.fat,
    fiber: input.fiber ?? estimate.fiber,
  };
}

// Shared by logFoodAction (persists) and previewFoodNutritionAction
// (read-only) — resolves the final description/quantity/unit/macros,
// branching to free-text parsing when quantity or unit is missing.
async function resolveLogInput(input: LogFoodInput) {
  if (!input.description.trim()) throw new Error("Description is required");

  let description = input.description;
  let quantity = input.quantity;
  let unit = input.unit;
  let nutrition: Awaited<ReturnType<typeof resolveNutrition>>;

  if (!quantity || quantity <= 0 || !unit) {
    const parsed = await estimateNutritionFromDescription(input.description);
    description = parsed.description;
    quantity = parsed.quantity;
    unit = parsed.unit;
    nutrition = {
      aiEstimated: true,
      calories: input.calories ?? parsed.calories,
      protein: input.protein ?? parsed.protein,
      carbs: input.carbs ?? parsed.carbs,
      fat: input.fat ?? parsed.fat,
      fiber: input.fiber ?? parsed.fiber,
    };
  } else {
    nutrition = await resolveNutrition({ ...input, quantity, unit });
  }

  if (!quantity || quantity <= 0) throw new Error("Couldn't figure out a quantity for that food");

  return { description, quantity, unit, nutrition };
}

export async function logFoodAction(input: LogFoodInput): Promise<LogFoodResult> {
  const { description, quantity, unit, nutrition } = await resolveLogInput(input);

  const entry = await db.foodEntry.create({
    data: {
      description,
      quantity,
      unit,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      mealId: input.mealId,
      loggedAt: input.loggedAt ?? new Date(),
    },
  });
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/trends");
  invalidate("food:", "summary:");
  return { ...entry, aiEstimated: nutrition.aiEstimated };
}

export type FoodPreview = {
  description: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

// Read-only: resolves quantity/unit/macros (parsing free text and/or calling
// AI as needed) without persisting anything, so the user can see — and edit
// — the AI's interpretation before committing "Log it".
export async function previewFoodNutritionAction(input: LogFoodInput): Promise<FoodPreview> {
  const { description, quantity, unit, nutrition } = await resolveLogInput(input);
  return {
    description,
    quantity,
    unit,
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    fiber: nutrition.fiber,
  };
}

export type UpdateFoodEntryInput = {
  description: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
};

// Updates one logged FoodEntry row in place. Deliberately never touches
// Meal/MealItem — even for an entry logged from a saved meal (mealId set),
// this only edits that day's snapshot (e.g. "just 40g of mango today"), so
// the reusable meal template and every other day it was logged stay intact.
export async function updateFoodEntryAction(id: string, input: UpdateFoodEntryInput) {
  if (!input.description.trim()) throw new Error("Description is required");
  if (!input.quantity || input.quantity <= 0) throw new Error("Quantity must be greater than 0");

  const nutrition = await resolveNutrition(input);

  await db.foodEntry.update({
    where: { id },
    data: {
      description: input.description,
      quantity: input.quantity,
      unit: input.unit,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
    },
  });
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/trends");
  invalidate("food:", "summary:");
}

export async function deleteFoodEntryAction(id: string) {
  await db.foodEntry.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/trends");
  invalidate("food:", "summary:");
}

// Deletes every ingredient entry from one meal-logging event at once, so
// removing a grouped "meal" row in the UI removes all of it in one action.
export async function deleteFoodEntryGroupAction(ids: string[]) {
  await db.foodEntry.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/trends");
  invalidate("food:", "summary:");
}

export async function getFoodEntriesInRange(gte: Date, lte: Date) {
  const key = `food:range:${gte.toISOString()}:${lte.toISOString()}`;
  return cached(key, () =>
    db.foodEntry.findMany({
      where: { loggedAt: { gte, lte } },
      orderBy: { loggedAt: "desc" },
      include: { meal: { select: { name: true } } },
    }),
  );
}
