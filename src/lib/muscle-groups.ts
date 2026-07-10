import { WORKOUT_PLANS } from "@/lib/workout-plan";

// Fixed to match exactly what the body diagram (components/body-diagram.tsx)
// knows how to render — not derived from plan data, since plans may have
// day/exercise labels (e.g. "Push", "Pull") that aren't muscle groups.
export const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs"];

const EXERCISE_TO_MUSCLE = new Map<string, string>();
for (const plan of WORKOUT_PLANS) {
  for (const day of plan.days) {
    for (const exercise of day.exercises) {
      const muscle = exercise.muscle ?? day.muscle;
      if (!muscle) continue;
      EXERCISE_TO_MUSCLE.set(exercise.name.toLowerCase(), muscle);
    }
  }
}

export function muscleGroupForExercise(exerciseName: string): string | null {
  return EXERCISE_TO_MUSCLE.get(exerciseName.trim().toLowerCase()) ?? null;
}
