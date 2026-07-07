import { WORKOUT_PLAN } from "@/lib/workout-plan";

export const MUSCLE_GROUPS = WORKOUT_PLAN.map((day) => day.muscle);

const EXERCISE_TO_MUSCLE = new Map<string, string>();
for (const day of WORKOUT_PLAN) {
  for (const exercise of day.exercises) {
    EXERCISE_TO_MUSCLE.set(exercise.name.toLowerCase(), day.muscle);
  }
}

export function muscleGroupForExercise(exerciseName: string): string | null {
  return EXERCISE_TO_MUSCLE.get(exerciseName.trim().toLowerCase()) ?? null;
}
