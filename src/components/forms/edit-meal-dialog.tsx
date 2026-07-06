"use client";

import { Pencil } from "lucide-react";
import { QuickAddDialog } from "@/components/quick-add-dialog";
import { MealBuilderForm, type EditableMeal } from "@/components/forms/meal-builder-form";

export function EditMealDialog({ meal }: { meal: EditableMeal }) {
  return (
    <QuickAddDialog
      label="Edit"
      title={`Edit ${meal.name}`}
      icon={<Pencil className="h-3.5 w-3.5" />}
      variant="outline"
      className="h-7 rounded-md px-2 text-xs"
    >
      <MealBuilderForm editMeal={meal} />
    </QuickAddDialog>
  );
}
