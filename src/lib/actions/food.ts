"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { estimateNutrition } from "@/lib/ai";

export type LogFoodInput = {
  description: string;
  quantity: number;
  unit: string;
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

export async function logFoodAction(input: LogFoodInput): Promise<LogFoodResult> {
  if (!input.description.trim()) throw new Error("Description is required");
  if (!input.quantity || input.quantity <= 0) throw new Error("Quantity must be greater than 0");

  const nutrition = await resolveNutrition(input);

  const entry = await db.foodEntry.create({
    data: {
      description: input.description,
      quantity: input.quantity,
      unit: input.unit,
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
  return { ...entry, aiEstimated: nutrition.aiEstimated };
}

export async function deleteFoodEntryAction(id: string) {
  await db.foodEntry.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/trends");
}

export async function getFoodEntriesInRange(gte: Date, lte: Date) {
  return db.foodEntry.findMany({
    where: { loggedAt: { gte, lte } },
    orderBy: { loggedAt: "desc" },
  });
}
