"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { estimateNutrition } from "@/lib/ai";
import { cached, invalidate } from "@/lib/query-cache";

export type MealItemInput = {
  description: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
};

async function resolveItemNutrition(item: MealItemInput) {
  const hasAllFields =
    item.calories !== undefined &&
    item.protein !== undefined &&
    item.carbs !== undefined &&
    item.fat !== undefined &&
    item.fiber !== undefined;

  if (hasAllFields) {
    return {
      calories: item.calories!,
      protein: item.protein!,
      carbs: item.carbs!,
      fat: item.fat!,
      fiber: item.fiber!,
    };
  }

  const estimate = await estimateNutrition(item.description, item.quantity, item.unit);
  return {
    calories: item.calories ?? estimate.calories,
    protein: item.protein ?? estimate.protein,
    carbs: item.carbs ?? estimate.carbs,
    fat: item.fat ?? estimate.fat,
    fiber: item.fiber ?? estimate.fiber,
  };
}

// Read-only: resolves each ingredient's macros (AI-filling any blanks) and
// the running total, without persisting anything — lets the user check
// numbers before committing to "Save meal".
export async function previewMealNutritionAction(items: MealItemInput[]) {
  const resolvedItems = await Promise.all(
    items.map(async (item) => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      ...(await resolveItemNutrition(item)),
    })),
  );

  const total = resolvedItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );

  return { items: resolvedItems, total };
}

export async function createMealAction(name: string, items: MealItemInput[]) {
  if (!name.trim()) throw new Error("Meal name is required");
  if (items.length === 0) throw new Error("Add at least one ingredient");

  const resolvedItems = await Promise.all(
    items.map(async (item) => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      ...(await resolveItemNutrition(item)),
    })),
  );

  const meal = await db.meal.create({
    data: {
      name,
      items: { create: resolvedItems },
    },
    include: { items: true },
  });
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/meals");
  revalidatePath("/trends");
  invalidate("meals:");
  return meal;
}

export async function updateMealAction(mealId: string, name: string, items: MealItemInput[]) {
  if (!name.trim()) throw new Error("Meal name is required");
  if (items.length === 0) throw new Error("Add at least one ingredient");

  const resolvedItems = await Promise.all(
    items.map(async (item) => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      ...(await resolveItemNutrition(item)),
    })),
  );

  const meal = await db.$transaction(async (tx) => {
    await tx.mealItem.deleteMany({ where: { mealId } });
    return tx.meal.update({
      where: { id: mealId },
      data: { name, items: { create: resolvedItems } },
      include: { items: true },
    });
  });

  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/meals");
  revalidatePath("/trends");
  invalidate("meals:");
  return meal;
}

export async function deleteMealAction(id: string) {
  await db.meal.delete({ where: { id } });
  revalidatePath("/meals");
  invalidate("meals:");
}

export async function getMealsAction() {
  return cached("meals:all", () =>
    db.meal.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
  );
}

export async function logMealAction(mealId: string, loggedAt?: Date) {
  const meal = await db.meal.findUniqueOrThrow({
    where: { id: mealId },
    include: { items: true },
  });

  const at = loggedAt ?? new Date();
  await db.foodEntry.createMany({
    data: meal.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
      mealId: meal.id,
      loggedAt: at,
    })),
  });
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/trends");
  invalidate("food:", "summary:");
}
