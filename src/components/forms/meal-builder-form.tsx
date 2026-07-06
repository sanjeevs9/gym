"use client";

import { useState, useTransition, useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { createMealAction } from "@/lib/actions/meals";

const UNITS = ["g", "ml", "oz", "cup", "tbsp", "tsp", "piece", "serving"];

type Row = {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
};

function emptyRow(id: string): Row {
  return {
    id,
    description: "",
    quantity: "100",
    unit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
  };
}

const parseOptional = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));

export function MealBuilderForm({ onCreated }: { onCreated?: () => void }) {
  const idBase = useId();
  const [name, setName] = useState("");
  const [rows, setRows] = useState<Row[]>([emptyRow(`${idBase}-0`)]);
  const [saving, startSaving] = useTransition();

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow(`${idBase}-${prev.length}`)]);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error("Give this meal a name");
      return;
    }
    for (const row of rows) {
      if (!row.description.trim()) {
        toast.error("Every ingredient needs a name");
        return;
      }
      const qty = parseFloat(row.quantity);
      if (!qty || qty <= 0) {
        toast.error(`Enter a valid quantity for ${row.description}`);
        return;
      }
    }

    startSaving(async () => {
      try {
        await createMealAction(
          name,
          rows.map((r) => ({
            description: r.description,
            quantity: parseFloat(r.quantity),
            unit: r.unit,
            calories: parseOptional(r.calories),
            protein: parseOptional(r.protein),
            carbs: parseOptional(r.carbs),
            fat: parseOptional(r.fat),
            fiber: parseOptional(r.fiber),
          })),
        );
        toast.success(`Saved "${name}"`);
        setName("");
        setRows([emptyRow(`${idBase}-reset`)]);
        onCreated?.();
      } catch {
        toast.error("Couldn't save meal");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="meal-name">Meal name</Label>
        <Input
          id="meal-name"
          placeholder="e.g. Post-workout shake"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="space-y-2 rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-[140px] flex-1 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ingredient</Label>
                <Input
                  placeholder="e.g. Greek yogurt"
                  value={row.description}
                  onChange={(e) => updateRow(row.id, { description: e.target.value })}
                />
              </div>
              <div className="w-20 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Qty</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={row.quantity}
                  onChange={(e) => updateRow(row.id, { quantity: e.target.value })}
                />
              </div>
              <div className="w-24 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Unit</Label>
                <Select
                  value={row.unit}
                  onValueChange={(v) => updateRow(row.id, { unit: v as string })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <Label className="text-[10px] text-muted-foreground">Nutrition (optional)</Label>
                <span className="text-[10px] text-muted-foreground">Blank = AI estimates it</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                <NutrientField
                  label="Cal"
                  value={row.calories}
                  onChange={(v) => updateRow(row.id, { calories: v })}
                />
                <NutrientField
                  label="Protein"
                  value={row.protein}
                  onChange={(v) => updateRow(row.id, { protein: v })}
                />
                <NutrientField
                  label="Carbs"
                  value={row.carbs}
                  onChange={(v) => updateRow(row.id, { carbs: v })}
                />
                <NutrientField
                  label="Fat"
                  value={row.fat}
                  onChange={(v) => updateRow(row.id, { fat: v })}
                />
                <NutrientField
                  label="Fiber"
                  value={row.fiber}
                  onChange={(v) => updateRow(row.id, { fiber: v })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addRow} className="w-full">
        <Plus className="h-4 w-4" />
        Add ingredient
      </Button>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save meal
      </Button>
    </div>
  );
}

function NutrientField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input
        type="number"
        step="any"
        placeholder="Auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 px-2 text-sm"
      />
    </div>
  );
}
