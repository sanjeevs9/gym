"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { estimateExerciseCalories } from "@/lib/ai";
import { getLatestWeightKg } from "@/lib/actions/weight";
import type { ExerciseType } from "@/generated/prisma/client";

export type StrengthSet = { reps: number; weightKg: number };

export async function estimateCardioCaloriesAction(activity: string, durationMinutes: number) {
  const bodyWeightKg = await getLatestWeightKg();
  return estimateExerciseCalories(
    `Cardio activity: ${activity}\nDuration: ${durationMinutes} minutes`,
    bodyWeightKg,
  );
}

export async function estimateStrengthCaloriesAction(exerciseName: string, sets: StrengthSet[]) {
  const bodyWeightKg = await getLatestWeightKg();
  const setsDescription = sets
    .map((s, i) =>
      s.weightKg > 0
        ? `Set ${i + 1}: ${s.reps} reps @ ${s.weightKg} kg`
        : `Set ${i + 1}: ${s.reps} reps (bodyweight only)`,
    )
    .join("\n");
  return estimateExerciseCalories(
    `Strength training exercise: ${exerciseName}\n${setsDescription}`,
    bodyWeightKg,
  );
}

export async function estimateStepsCaloriesAction(steps: number) {
  const bodyWeightKg = await getLatestWeightKg();
  return estimateExerciseCalories(`Walking activity: ${steps} steps taken today`, bodyWeightKg);
}

export type LogExerciseInput = {
  type: ExerciseType;
  description: string;
  detailsJson?: string;
  caloriesBurned: number;
  estimatedByAi: boolean;
  loggedAt?: Date;
};

export async function logExerciseAction(input: LogExerciseInput) {
  const entry = await db.exerciseEntry.create({
    data: {
      type: input.type,
      description: input.description,
      detailsJson: input.detailsJson,
      caloriesBurned: input.caloriesBurned,
      estimatedByAi: input.estimatedByAi,
      loggedAt: input.loggedAt ?? new Date(),
    },
  });
  revalidatePath("/");
  revalidatePath("/exercise");
  revalidatePath("/trends");
  return entry;
}

export async function deleteExerciseEntryAction(id: string) {
  await db.exerciseEntry.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/exercise");
  revalidatePath("/trends");
}

export async function getExerciseEntriesInRange(gte: Date, lte: Date) {
  return db.exerciseEntry.findMany({
    where: { loggedAt: { gte, lte } },
    orderBy: { loggedAt: "desc" },
  });
}
