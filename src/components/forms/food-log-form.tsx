"use client";

import { useState, useTransition } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles } from "lucide-react";
import { logFoodAction, previewFoodNutritionAction } from "@/lib/actions/food";
import { useQuickAddClose } from "@/components/quick-add-dialog";
import { useSelectedDateKey } from "@/components/selected-date-context";
import { combineDayKeyWithNow, todayKey } from "@/lib/date";
import { MealPicker } from "@/components/forms/meal-picker";

const UNITS = ["g", "ml", "oz", "cup", "tbsp", "tsp", "piece", "serving"];
const parseOptional = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));

export function FoodLogForm() {
  return (
    <Tabs defaultValue="custom">
      <TabsList className="w-full">
        <TabsTrigger value="custom">Custom food</TabsTrigger>
        <TabsTrigger value="meals">My meals</TabsTrigger>
      </TabsList>
      <TabsContent value="custom" className="pt-4">
        <CustomFoodTab />
      </TabsContent>
      <TabsContent value="meals" className="pt-4">
        <MealPicker />
      </TabsContent>
    </Tabs>
  );
}

function CustomFoodTab() {
  const closeDialog = useQuickAddClose();
  const dateKey = useSelectedDateKey();
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("g");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [saving, startSaving] = useTransition();
  const [estimating, startEstimating] = useTransition();

  function currentQty() {
    // Quantity is optional — leaving it blank means the amount is already in
    // the description (e.g. "75g paneer bhurji"), so the server parses both
    // the quantity/unit and the macros out of that free text in one AI call.
    return quantity.trim() === "" ? undefined : parseFloat(quantity);
  }

  function handleEstimate() {
    if (!description.trim()) {
      toast.error("Describe what you ate first");
      return;
    }
    const qty = currentQty();
    if (quantity.trim() !== "" && (!qty || qty <= 0)) {
      toast.error("Enter a valid quantity, or leave it blank and describe the amount above");
      return;
    }

    startEstimating(async () => {
      try {
        const preview = await previewFoodNutritionAction({
          description,
          quantity: qty,
          unit: qty ? unit : undefined,
          calories: parseOptional(calories),
          protein: parseOptional(protein),
          carbs: parseOptional(carbs),
          fat: parseOptional(fat),
          fiber: parseOptional(fiber),
        });
        setDescription(preview.description);
        setQuantity(String(preview.quantity));
        setUnit(preview.unit);
        setCalories(String(preview.calories));
        setProtein(String(preview.protein));
        setCarbs(String(preview.carbs));
        setFat(String(preview.fat));
        setFiber(String(preview.fiber));
        toast.success("Estimated — review the numbers below, then Log it");
      } catch {
        toast.error("Couldn't estimate that");
      }
    });
  }

  function handleLog() {
    if (!description.trim()) {
      toast.error("Describe what you ate first");
      return;
    }
    const qty = currentQty();
    if (quantity.trim() !== "" && (!qty || qty <= 0)) {
      toast.error("Enter a valid quantity, or leave it blank and describe the amount above");
      return;
    }

    startSaving(async () => {
      try {
        const result = await logFoodAction({
          description,
          quantity: qty,
          unit: qty ? unit : undefined,
          calories: parseOptional(calories),
          protein: parseOptional(protein),
          carbs: parseOptional(carbs),
          fat: parseOptional(fat),
          fiber: parseOptional(fiber),
          loggedAt: dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey),
        });
        toast.success(
          `Logged ${result.description} — ${Math.round(result.calories)} kcal${
            result.aiEstimated ? " (AI-estimated)" : ""
          }`,
        );
        setDescription("");
        setQuantity("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        setFiber("");
        closeDialog();
      } catch {
        toast.error("Couldn't save entry");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="food-description">What did you eat?</Label>
        <Input
          id="food-description"
          placeholder="e.g. apple, 75g paneer bhurji, 2 idlis with sambar"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-[11px] text-muted-foreground">
          Quantity below is optional — you can describe the amount here instead.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="food-quantity">Quantity</Label>
          <Input
            id="food-quantity"
            type="number"
            min="0"
            step="any"
            placeholder="Optional"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as string)}>
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

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <Label className="text-xs text-muted-foreground">Nutrition (optional)</Label>
          <span className="text-[11px] text-muted-foreground">Blank = AI estimates it</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          <NutrientField label="Cal" value={calories} onChange={setCalories} />
          <NutrientField label="Protein" value={protein} onChange={setProtein} />
          <NutrientField label="Carbs" value={carbs} onChange={setCarbs} />
          <NutrientField label="Fat" value={fat} onChange={setFat} />
          <NutrientField label="Fiber" value={fiber} onChange={setFiber} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleEstimate}
          disabled={estimating || saving}
          className="shrink-0"
        >
          {estimating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Estimate
        </Button>
        <Button onClick={handleLog} disabled={saving || estimating} className="flex-1">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Log it
        </Button>
      </div>
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
