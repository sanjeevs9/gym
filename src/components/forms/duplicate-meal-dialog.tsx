"use client";

import { Copy } from "lucide-react";
import { QuickAddDialog } from "@/components/quick-add-dialog";
import { MealBuilderForm, type EditableMeal } from "@/components/forms/meal-builder-form";

// Pre-fills the builder with an existing meal's ingredients but always saves
// as a brand-new meal (no editMealId) — for "copy this, tweak an ingredient
// or two, save it as its own thing" without touching the original.
export function DuplicateMealDialog({ meal }: { meal: EditableMeal }) {
  return (
    <QuickAddDialog
      label="Copy"
      title={`Copy "${meal.name}"`}
      icon={<Copy className="h-3.5 w-3.5" />}
      variant="outline"
      className="h-7 rounded-md px-2 text-xs"
    >
      <MealBuilderForm initialData={{ name: `${meal.name} (copy)`, items: meal.items }} />
    </QuickAddDialog>
  );
}
