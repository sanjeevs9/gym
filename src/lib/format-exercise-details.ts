type StrengthDetails = { exerciseName: string; sets: { reps: number; weightKg: number }[] };
type CardioDetails = { activity: string; durationMinutes: number };

export function formatExerciseDetails(type: string, detailsJson: string | null): string | null {
  if (!detailsJson) return null;

  try {
    const parsed = JSON.parse(detailsJson);

    if (type === "STRENGTH") {
      const { sets } = parsed as StrengthDetails;
      if (!Array.isArray(sets) || sets.length === 0) return null;
      const allSameWeight = sets.every((s) => s.weightKg === sets[0].weightKg);
      const allSameReps = sets.every((s) => s.reps === sets[0].reps);
      if (allSameWeight && allSameReps) {
        return sets[0].weightKg > 0
          ? `${sets.length} × ${sets[0].reps} reps @ ${sets[0].weightKg}kg`
          : `${sets.length} × ${sets[0].reps} reps`;
      }
      return sets
        .map((s) => (s.weightKg > 0 ? `${s.reps}×${s.weightKg}kg` : `${s.reps} reps`))
        .join(", ");
    }

    if (type === "CARDIO") {
      const { durationMinutes } = parsed as CardioDetails;
      return durationMinutes ? `${durationMinutes} min` : null;
    }

    return null;
  } catch {
    return null;
  }
}
