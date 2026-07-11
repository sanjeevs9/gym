"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateFoodEntryAction } from "@/lib/actions/food";

const UNITS = ["g", "ml", "oz", "cup", "tbsp", "tsp", "piece", "serving"];
const NUTRIENT_KEYS = ["calories", "protein", "carbs", "fat", "fiber"] as const;
const roundNutrient = (n: number) => Math.round(n * 10) / 10;
const parseOptional = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));

export type EditableFoodEntry = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

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

function rowFromEntry(entry: EditableFoodEntry): Row {
  return {
    id: entry.id,
    description: entry.description,
    quantity: String(entry.quantity),
    unit: entry.unit,
    calories: String(entry.calories),
    protein: String(entry.protein),
    carbs: String(entry.carbs),
    fat: String(entry.fat),
    fiber: String(entry.fiber),
  };
}

// Same anchor-on-focus approach as MealBuilderForm's scaleQuantity: scale
// from the value at focus-start rather than the previous keystroke's value,
// so repeated onChange fires while typing "400" don't compound rounding
// error. `base` and `current` are only ever the same row here.
function scaleQuantity(base: Row, current: Row, newQuantity: string): Row {
  const oldQty = parseFloat(base.quantity);
  const newQty = parseFloat(newQuantity);
  if (!(oldQty > 0) || !(newQty > 0) || oldQty === newQty) {
    return { ...current, quantity: newQuantity };
  }
  const ratio = newQty / oldQty;
  const scaled: Row = { ...current, quantity: newQuantity };
  for (const key of NUTRIENT_KEYS) {
    if (base[key].trim() !== "") {
      scaled[key] = String(roundNutrient(parseFloat(base[key]) * ratio));
    }
  }
  return scaled;
}

// Edits one or more already-logged FoodEntry rows in place. Deliberately
// scoped to just those rows — even when they came from a saved meal, this
// never writes back to the Meal/MealItem template, so e.g. dropping one
// day's mango from 100g to 40g doesn't change the "Greek yogurt with mango"
// meal itself or any other day it was logged.
export function EditFoodEntryDialog({
  entries,
  title,
}: {
  entries: EditableFoodEntry[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>(() => entries.map(rowFromEntry));
  const [saving, startSaving] = useTransition();
  const anchor = useRef<Record<string, Row>>({});

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setRows(entries.map(rowFromEntry));
  }

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function updateQuantity(id: string, quantity: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? scaleQuantity(anchor.current[id] ?? r, r, quantity) : r)),
    );
  }

  function handleSave() {
    for (const row of rows) {
      if (!row.description.trim()) {
        toast.error("Every item needs a name");
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
        await Promise.all(
          rows.map((row) =>
            updateFoodEntryAction(row.id, {
              description: row.description,
              quantity: parseFloat(row.quantity),
              unit: row.unit,
              calories: parseOptional(row.calories),
              protein: parseOptional(row.protein),
              carbs: parseOptional(row.carbs),
              fat: parseOptional(row.fat),
              fiber: parseOptional(row.fiber),
            }),
          ),
        );
        toast.success("Updated");
        setOpen(false);
      } catch {
        toast.error("Couldn't save changes");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="-mt-2 text-xs text-muted-foreground">
          Changes apply to this logged entry only — any saved meal it came from is unaffected.
        </p>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-[140px] flex-1 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Input
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
                    onFocus={() => {
                      anchor.current[row.id] = row;
                    }}
                    onBlur={() => {
                      delete anchor.current[row.id];
                    }}
                    onChange={(e) => updateQuantity(row.id, e.target.value)}
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
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </DialogContent>
    </Dialog>
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 px-2 text-sm"
      />
    </div>
  );
}
