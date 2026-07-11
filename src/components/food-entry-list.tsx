import { PlusCircle } from "lucide-react";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { EditFoodEntryDialog } from "@/components/forms/edit-food-entry-dialog";
import { deleteFoodEntryAction, deleteFoodEntryGroupAction } from "@/lib/actions/food";
import { groupFoodEntries, type FoodListRow } from "@/lib/group-food-entries";
import type { getFoodEntriesInRange } from "@/lib/actions/food";

type Entries = Awaited<ReturnType<typeof getFoodEntriesInRange>>;

export function FoodEntryList({
  entries,
  emptyText,
  showFullMacros = false,
}: {
  entries: Entries;
  emptyText: string;
  showFullMacros?: boolean;
}) {
  const rows = groupFoodEntries(entries);

  if (rows.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
        <PlusCircle className="h-4 w-4" />
        {emptyText}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {rows.map((row) => (
        <FoodEntryRow key={rowKey(row)} row={row} showFullMacros={showFullMacros} />
      ))}
    </ul>
  );
}

function rowKey(row: FoodListRow) {
  return row.type === "meal" ? row.ids.join(",") : row.entry.id;
}

function macroLine(
  macros: { calories: number; protein: number; carbs: number; fat: number; fiber: number },
  showFullMacros: boolean,
) {
  if (!showFullMacros) {
    return `${Math.round(macros.calories)} kcal · ${Math.round(macros.protein)}g protein`;
  }
  return `${Math.round(macros.calories)} kcal · ${Math.round(macros.protein)}g protein · ${Math.round(
    macros.carbs,
  )}g carbs · ${Math.round(macros.fat)}g fat · ${Math.round(macros.fiber)}g fiber`;
}

function FoodEntryRow({ row, showFullMacros }: { row: FoodListRow; showFullMacros: boolean }) {
  if (row.type === "meal") {
    return (
      <li className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2 text-sm shadow-sm ring-1 ring-foreground/5">
        <div className="min-w-0">
          <p className="truncate font-medium">{row.mealName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.ingredients.join(", ")}</p>
          <p className="text-xs text-muted-foreground">{macroLine(row, showFullMacros)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <EditFoodEntryDialog entries={row.items} title={`Edit ${row.mealName}`} />
          <DeleteIconButton id={row.ids} action={deleteFoodEntryGroupAction} />
        </div>
      </li>
    );
  }

  const { entry } = row;
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2 text-sm shadow-sm ring-1 ring-foreground/5">
      <div className="min-w-0">
        <p className="truncate font-medium">{entry.description}</p>
        <p className="text-xs text-muted-foreground">
          {entry.quantity}
          {entry.unit} · {macroLine(entry, showFullMacros)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <EditFoodEntryDialog entries={[entry]} title={`Edit ${entry.description}`} />
        <DeleteIconButton id={entry.id} action={deleteFoodEntryAction} />
      </div>
    </li>
  );
}
