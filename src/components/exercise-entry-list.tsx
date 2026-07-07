import { DeleteIconButton } from "@/components/delete-icon-button";
import { deleteExerciseEntryAction } from "@/lib/actions/exercise";
import { formatExerciseDetails } from "@/lib/format-exercise-details";
import type { getExerciseEntriesInRange } from "@/lib/actions/exercise";

type Entries = Awaited<ReturnType<typeof getExerciseEntriesInRange>>;

export function ExerciseEntryList({ entries, emptyText }: { entries: Entries; emptyText: string }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {entries.map((entry) => {
        const detail = formatExerciseDetails(entry.type, entry.detailsJson);
        return (
          <li
            key={entry.id}
            className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2 text-sm shadow-sm ring-1 ring-foreground/5"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{entry.description}</p>
              <p className="text-xs text-muted-foreground">
                {entry.type.charAt(0) + entry.type.slice(1).toLowerCase()}
                {detail ? ` · ${detail}` : ""} · {Math.round(entry.caloriesBurned)} kcal burned
                {entry.estimatedByAi ? " · AI estimate" : ""}
              </p>
            </div>
            <DeleteIconButton id={entry.id} action={deleteExerciseEntryAction} />
          </li>
        );
      })}
    </ul>
  );
}
