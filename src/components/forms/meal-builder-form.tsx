"use client";

import { useState, useEffect, useRef, useTransition, useId } from "react";
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
import { Loader2, Plus, Trash2, Eye, Bookmark } from "lucide-react";
import { createMealAction, updateMealAction, previewMealNutritionAction } from "@/lib/actions/meals";
import { getSavedIngredientsAction, saveIngredientAction } from "@/lib/actions/ingredients";
import { useQuickAddClose } from "@/components/quick-add-dialog";

type SavedIngredientRow = Awaited<ReturnType<typeof getSavedIngredientsAction>>[number];

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
  // Set when this row's ingredient matches a SavedIngredient by name — qty
  // changes recompute macros from that per-100 profile instead of scaling
  // whatever was already in the fields, and manually editing a macro or
  // renaming the ingredient detaches it.
  savedIngredientId?: string;
};

export type MealItemSnapshot = {
  description: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type EditableMeal = {
  id: string;
  name: string;
  items: MealItemSnapshot[];
};

export type MealPrefill = {
  name: string;
  items: MealItemSnapshot[];
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
    savedIngredientId: undefined,
  };
}

function rowFromItem(id: string, item: MealItemSnapshot): Row {
  return {
    id,
    description: item.description,
    quantity: String(item.quantity),
    unit: item.unit,
    calories: String(item.calories),
    protein: String(item.protein),
    carbs: String(item.carbs),
    fat: String(item.fat),
    fiber: String(item.fiber),
    savedIngredientId: undefined,
  };
}

// Scales a saved ingredient's per-100-base-unit profile to an actual quantity.
function nutrientsFromProfile(profile: SavedIngredientRow, quantity: number) {
  const ratio = quantity / 100;
  return {
    calories: String(roundNutrient(profile.calories * ratio)),
    protein: String(roundNutrient(profile.protein * ratio)),
    carbs: String(roundNutrient(profile.carbs * ratio)),
    fat: String(roundNutrient(profile.fat * ratio)),
    fiber: String(roundNutrient(profile.fiber * ratio)),
  };
}

const parseOptional = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));

const NUTRIENT_KEYS = ["calories", "protein", "carbs", "fat", "fiber"] as const;

const roundNutrient = (n: number) => Math.round(n * 10) / 10;

// Quantity changes should scale any already-filled-in macros proportionally
// (e.g. 300ml -> 400ml scales calories by 4/3) instead of leaving them stale
// at the old quantity's values. Blank fields stay blank so AI still fills
// them in at Check/Save time.
//
// `base` is a fixed snapshot of the row from *before* the current edit
// session started (captured on focus) and `current` is the row being
// updated. Typing "400" fires onChange after "4", then "40", then "400" —
// scaling each of those against the immediately-previous value would
// compound rounding error (140 * (4/300) * (40/4) * (400/40) instead of
// just 140 * (400/300)). Always scaling from the same fixed `base` avoids
// that regardless of how many intermediate keystrokes fire.
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

export function MealBuilderForm({
  onCreated,
  initialData,
  editMealId,
}: {
  onCreated?: () => void;
  initialData?: MealPrefill;
  editMealId?: string;
}) {
  const idBase = useId();
  const closeDialog = useQuickAddClose();
  const [name, setName] = useState(initialData?.name ?? "");
  const [rows, setRows] = useState<Row[]>(() =>
    initialData && initialData.items.length > 0
      ? initialData.items.map((item, i) => rowFromItem(`${idBase}-${i}`, item))
      : [emptyRow(`${idBase}-0`)],
  );
  const [saving, startSaving] = useTransition();
  const [checking, startChecking] = useTransition();
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof previewMealNutritionAction>
  > | null>(null);
  const [savedIngredients, setSavedIngredients] = useState<SavedIngredientRow[]>([]);
  const [savingIngredientId, setSavingIngredientId] = useState<string | null>(null);
  const [openIngredientRow, setOpenIngredientRow] = useState<string | null>(null);
  // Snapshot of a row's values from before the current Qty edit session
  // started (set on focus, cleared on blur) — see scaleQuantity's comment.
  const qtyAnchor = useRef<Record<string, Row>>({});

  useEffect(() => {
    let cancelled = false;
    getSavedIngredientsAction().then((list) => {
      if (cancelled) return;
      setSavedIngredients(list);
      // Re-link rows loaded from an existing meal (edit/duplicate) whose
      // ingredient name already matches a saved profile, so qty edits on
      // them recompute from that profile right away.
      setRows((prev) =>
        prev.map((r) => {
          if (r.savedIngredientId || !r.description.trim()) return r;
          const match = list.find(
            (si) => si.name.toLowerCase() === r.description.trim().toLowerCase(),
          );
          return match ? { ...r, savedIngredientId: match.id } : r;
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Editing a macro by hand is a deliberate override, so it detaches the row
  // from its saved-ingredient profile (otherwise the next qty change would
  // silently clobber the override with the profile's numbers again).
  function updateNutrient(id: string, key: (typeof NUTRIENT_KEYS)[number], value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value, savedIngredientId: undefined } : r)),
    );
    setPreview(null);
  }

  function updateDescription(id: string, description: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const match = savedIngredients.find(
          (si) => si.name.toLowerCase() === description.trim().toLowerCase(),
        );
        if (!match) {
          return r.savedIngredientId
            ? { ...r, description, savedIngredientId: undefined }
            : { ...r, description };
        }
        const qty = parseFloat(r.quantity);
        return {
          ...r,
          description,
          unit: match.baseUnit,
          savedIngredientId: match.id,
          ...(qty > 0 ? nutrientsFromProfile(match, qty) : {}),
        };
      }),
    );
    setPreview(null);
  }

  function anchorQuantity(row: Row) {
    qtyAnchor.current[row.id] = row;
  }

  function releaseQuantityAnchor(id: string) {
    delete qtyAnchor.current[id];
  }

  function updateQuantity(id: string, quantity: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const profile = savedIngredients.find((si) => si.id === r.savedIngredientId);
        if (profile) {
          const qty = parseFloat(quantity);
          return qty > 0 ? { ...r, quantity, ...nutrientsFromProfile(profile, qty) } : { ...r, quantity };
        }
        return scaleQuantity(qtyAnchor.current[id] ?? r, r, quantity);
      }),
    );
    setPreview(null);
  }

  // The unit changes the meaning of any entered macros (300 of something
  // isn't the same as 300 of something else), so clear them rather than
  // carry over now-invalid numbers — Check/Save will re-fill via AI.
  function updateUnit(id: string, unit: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, unit, savedIngredientId: undefined, calories: "", protein: "", carbs: "", fat: "", fiber: "" }
          : r,
      ),
    );
    setPreview(null);
  }

  async function handleSaveIngredient(row: Row) {
    if (!row.description.trim()) {
      toast.error("Name this ingredient before saving it");
      return;
    }
    const qty = parseFloat(row.quantity);
    if (!(qty > 0)) {
      toast.error("Enter a valid quantity before saving this ingredient");
      return;
    }
    if (row.unit !== "g" && row.unit !== "ml") {
      toast.error("Only g/ml ingredients can be saved as reusable products");
      return;
    }
    const values = NUTRIENT_KEYS.map((key) => parseOptional(row[key]));
    if (values.some((v) => v === undefined)) {
      toast.error("Fill in Cal/Protein/Carbs/Fat/Fiber (or hit Check) before saving");
      return;
    }
    const [calories, protein, carbs, fat, fiber] = values as number[];
    const ratio = 100 / qty;

    setSavingIngredientId(row.id);
    try {
      const saved = await saveIngredientAction({
        name: row.description.trim(),
        baseUnit: row.unit,
        calories: roundNutrient(calories * ratio),
        protein: roundNutrient(protein * ratio),
        carbs: roundNutrient(carbs * ratio),
        fat: roundNutrient(fat * ratio),
        fiber: roundNutrient(fiber * ratio),
      });
      setSavedIngredients((prev) =>
        [...prev.filter((si) => si.id !== saved.id), saved].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, savedIngredientId: saved.id } : r)));
      toast.success(`Saved "${saved.name}" as a reusable ingredient`);
    } catch {
      toast.error("Couldn't save this ingredient");
    } finally {
      setSavingIngredientId(null);
    }
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow(`${idBase}-${prev.length}`)]);
    setPreview(null);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
    setPreview(null);
  }

  function validateRows() {
    for (const row of rows) {
      if (!row.description.trim()) {
        toast.error("Every ingredient needs a name");
        return false;
      }
      const qty = parseFloat(row.quantity);
      if (!qty || qty <= 0) {
        toast.error(`Enter a valid quantity for ${row.description}`);
        return false;
      }
    }
    return true;
  }

  function itemsPayload() {
    return rows.map((r) => ({
      description: r.description,
      quantity: parseFloat(r.quantity),
      unit: r.unit,
      calories: parseOptional(r.calories),
      protein: parseOptional(r.protein),
      carbs: parseOptional(r.carbs),
      fat: parseOptional(r.fat),
      fiber: parseOptional(r.fiber),
    }));
  }

  function handleCheck() {
    if (!validateRows()) return;
    startChecking(async () => {
      try {
        const result = await previewMealNutritionAction(itemsPayload());
        setPreview(result);
      } catch {
        toast.error("Couldn't check nutrition");
      }
    });
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error("Give this meal a name");
      return;
    }
    if (!validateRows()) return;

    startSaving(async () => {
      try {
        const items = itemsPayload();

        if (editMealId) {
          await updateMealAction(editMealId, name, items);
          toast.success(`Updated "${name}"`);
        } else {
          await createMealAction(name, items);
          toast.success(`Saved "${name}"`);
          setName("");
          setRows([emptyRow(`${idBase}-reset`)]);
        }
        setPreview(null);
        onCreated?.();
        closeDialog();
      } catch {
        toast.error(editMealId ? "Couldn't update meal" : "Couldn't save meal");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="meal-name">Meal name</Label>
          <Input
            id="meal-name"
            placeholder="e.g. Post-workout shake"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPreview(null);
            }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheck}
          disabled={checking}
          className="mt-6"
        >
          {checking ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          Check
        </Button>
      </div>

      {preview && (
        <div className="space-y-2 rounded-lg bg-secondary/40 p-3 text-xs">
          <p className="font-semibold text-muted-foreground">Preview — not saved yet</p>
          <ul className="space-y-1">
            {preview.items.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                <span className="font-medium text-foreground">{item.description}</span> (
                {item.quantity}
                {item.unit}) — {Math.round(item.calories)} kcal · {Math.round(item.protein)}g
                protein · {Math.round(item.carbs)}g carbs · {Math.round(item.fat)}g fat ·{" "}
                {Math.round(item.fiber)}g fiber
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-2 text-sm font-medium text-foreground">
            Total: {Math.round(preview.total.calories)} kcal · {Math.round(preview.total.protein)}
            g protein · {Math.round(preview.total.carbs)}g carbs · {Math.round(preview.total.fat)}g
            fat · {Math.round(preview.total.fiber)}g fiber
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="space-y-2 rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-end gap-2">
              <div className="relative min-w-[140px] flex-1 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ingredient</Label>
                <Input
                  placeholder="e.g. Greek yogurt"
                  value={row.description}
                  onFocus={() => setOpenIngredientRow(row.id)}
                  onChange={(e) => {
                    updateDescription(row.id, e.target.value);
                    setOpenIngredientRow(row.id);
                  }}
                  onBlur={() => setOpenIngredientRow(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setOpenIngredientRow(null);
                  }}
                />
                {row.savedIngredientId && (
                  <p className="text-[10px] text-muted-foreground">
                    Using saved per-100{row.unit} profile
                  </p>
                )}
                {openIngredientRow === row.id && savedIngredients.length > 0 && (
                  <IngredientDropdown
                    query={row.description}
                    ingredients={savedIngredients}
                    onSelect={(name) => {
                      updateDescription(row.id, name);
                      setOpenIngredientRow(null);
                    }}
                  />
                )}
              </div>
              <div className="w-20 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Qty</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={row.quantity}
                  onFocus={() => anchorQuantity(row)}
                  onBlur={() => releaseQuantityAnchor(row.id)}
                  onChange={(e) => updateQuantity(row.id, e.target.value)}
                />
              </div>
              <div className="w-24 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Unit</Label>
                <Select
                  value={row.unit}
                  onValueChange={(v) => updateUnit(row.id, v as string)}
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
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleSaveIngredient(row)}
                disabled={savingIngredientId === row.id}
                title={
                  row.savedIngredientId
                    ? "Update saved ingredient profile"
                    : "Save as a reusable ingredient (per 100g/100ml)"
                }
              >
                {savingIngredientId === row.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bookmark className={row.savedIngredientId ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                )}
              </Button>
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
                  onChange={(v) => updateNutrient(row.id, "calories", v)}
                />
                <NutrientField
                  label="Protein"
                  value={row.protein}
                  onChange={(v) => updateNutrient(row.id, "protein", v)}
                />
                <NutrientField
                  label="Carbs"
                  value={row.carbs}
                  onChange={(v) => updateNutrient(row.id, "carbs", v)}
                />
                <NutrientField
                  label="Fat"
                  value={row.fat}
                  onChange={(v) => updateNutrient(row.id, "fat", v)}
                />
                <NutrientField
                  label="Fiber"
                  value={row.fiber}
                  onChange={(v) => updateNutrient(row.id, "fiber", v)}
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
        {editMealId ? "Update meal" : "Save meal"}
      </Button>
    </div>
  );
}

// Visible list of saved ingredients to pick from — an empty query shows all
// of them (so it doubles as a browsable list, not just filtered suggestions).
// Uses onMouseDown+preventDefault so a click registers before the input's
// onBlur closes the dropdown.
function IngredientDropdown({
  query,
  ingredients,
  onSelect,
}: {
  query: string;
  ingredients: SavedIngredientRow[];
  onSelect: (name: string) => void;
}) {
  const matches = ingredients.filter((si) =>
    si.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
      {matches.length === 0 ? (
        <p className="px-3 py-2 text-xs text-muted-foreground">
          No saved match — this will be added as a custom ingredient
        </p>
      ) : (
        matches.map((si) => (
          <button
            key={si.id}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(si.name);
            }}
            className="flex w-full items-baseline justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-secondary"
          >
            <span>{si.name}</span>
            <span className="text-[10px] text-muted-foreground">per 100{si.baseUnit}</span>
          </button>
        ))
      )}
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
