"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { estimateExerciseCalories } from "@/lib/ai";
import { getLatestWeightKg } from "@/lib/actions/weight";
import { cached, invalidate } from "@/lib/query-cache";
import { muscleGroupForExercise, MUSCLE_GROUPS } from "@/lib/muscle-groups";
import { daysAgoFromToday } from "@/lib/date";
import type { ExerciseType } from "@/generated/prisma/client";

function exerciseNameFor(description: string, detailsJson: string | null): string {
  if (detailsJson) {
    try {
      const parsed = JSON.parse(detailsJson) as { exerciseName?: string };
      if (parsed.exerciseName) return parsed.exerciseName;
    } catch {
      // fall through to description
    }
  }
  return description;
}

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
  invalidate("exercise:", "summary:", "muscle-recency:");
  return entry;
}

export async function deleteExerciseEntryAction(id: string) {
  await db.exerciseEntry.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/exercise");
  revalidatePath("/trends");
  invalidate("exercise:", "summary:", "muscle-recency:");
}

export async function getExerciseEntriesInRange(gte: Date, lte: Date) {
  const key = `exercise:range:${gte.toISOString()}:${lte.toISOString()}`;
  return cached(key, () =>
    db.exerciseEntry.findMany({
      where: { loggedAt: { gte, lte } },
      orderBy: { loggedAt: "desc" },
    }),
  );
}

export type MuscleRecency = { muscle: string; lastTrainedAt: Date | null; daysAgo: number | null };

// Maps each of the 6-day split's muscle groups to when it was last trained,
// by matching logged strength exercise names back to the workout plan.
// Only exercises logged with a name matching the plan (via the Plan page,
// or typed to match exactly) can be attributed to a muscle group.
export async function getMuscleGroupRecencyAction(): Promise<MuscleRecency[]> {
  const key = "muscle-recency:all";
  return cached(
    key,
    async () => {
      const entries = await db.exerciseEntry.findMany({
        where: { type: "STRENGTH" },
        orderBy: { loggedAt: "desc" },
        take: 300,
        select: { description: true, detailsJson: true, loggedAt: true },
      });

      const lastByMuscle = new Map<string, Date>();
      for (const entry of entries) {
        const name = exerciseNameFor(entry.description, entry.detailsJson);
        const muscle = muscleGroupForExercise(name);
        if (!muscle || lastByMuscle.has(muscle)) continue;
        lastByMuscle.set(muscle, entry.loggedAt);
      }

      return MUSCLE_GROUPS.map((muscle) => {
        const lastTrainedAt = lastByMuscle.get(muscle) ?? null;
        return {
          muscle,
          lastTrainedAt,
          daysAgo: lastTrainedAt ? daysAgoFromToday(lastTrainedAt) : null,
        };
      });
    },
    60_000,
  );
}

export async function getLoggedStrengthExerciseNamesAction(): Promise<string[]> {
  const key = "exercise:strength-names";
  return cached(key, async () => {
    const entries = await db.exerciseEntry.findMany({
      where: { type: "STRENGTH" },
      orderBy: { loggedAt: "desc" },
      select: { description: true, detailsJson: true },
      take: 500,
    });

    const seen = new Map<string, string>();
    for (const entry of entries) {
      const name = exerciseNameFor(entry.description, entry.detailsJson).trim();
      const key = name.toLowerCase();
      if (!seen.has(key)) seen.set(key, name);
    }
    return Array.from(seen.values());
  });
}

export type ExerciseProgressPoint = {
  loggedAt: string;
  sets: StrengthSet[];
  maxWeightKg: number;
  totalReps: number;
  totalVolume: number;
};

export async function getExerciseProgressAction(
  exerciseName: string,
): Promise<ExerciseProgressPoint[]> {
  const key = `exercise:progress:${exerciseName.toLowerCase()}`;
  return cached(key, async () => {
    const entries = await db.exerciseEntry.findMany({
      where: { type: "STRENGTH" },
      orderBy: { loggedAt: "asc" },
      select: { description: true, detailsJson: true, loggedAt: true },
    });

    const target = exerciseName.trim().toLowerCase();
    const points: ExerciseProgressPoint[] = [];

    for (const entry of entries) {
      const name = exerciseNameFor(entry.description, entry.detailsJson);
      if (name.trim().toLowerCase() !== target || !entry.detailsJson) continue;

      let sets: StrengthSet[] = [];
      try {
        const parsed = JSON.parse(entry.detailsJson) as { sets?: StrengthSet[] };
        sets = parsed.sets ?? [];
      } catch {
        continue;
      }
      if (sets.length === 0) continue;

      points.push({
        loggedAt: entry.loggedAt.toISOString(),
        sets,
        maxWeightKg: Math.max(...sets.map((s) => s.weightKg)),
        totalReps: sets.reduce((sum, s) => sum + s.reps, 0),
        totalVolume: sets.reduce((sum, s) => sum + s.reps * s.weightKg, 0),
      });
    }

    return points;
  });
}
