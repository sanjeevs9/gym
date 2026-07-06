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
import { Loader2 } from "lucide-react";
import { logFoodAction } from "@/lib/actions/food";
import { useQuickAddClose } from "@/components/quick-add-dialog";
import { useSelectedDateKey } from "@/components/selected-date-context";
import { combineDayKeyWithNow, todayKey } from "@/lib/date";
import { MealPicker } from "@/components/forms/meal-picker";

const UNITS = ["g", "ml", "oz", "cup", "tbsp", "tsp", "piece", "serving"];

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
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState("g");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [saving, startSaving] = useTransition();

  function handleLog() {
    if (!description.trim()) {
      toast.error("Describe what you ate first");
      return;
    }
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    const parseOptional = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));

    startSaving(async () => {
      try {
        const result = await logFoodAction({
          description,
          quantity: qty,
          unit,
          calories: parseOptional(calories),
          protein: parseOptional(protein),
          carbs: parseOptional(carbs),
          fat: parseOptional(fat),
          fiber: parseOptional(fiber),
          loggedAt: dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey),
        });
        toast.success(
          `Logged ${description} — ${Math.round(result.calories)} kcal${
            result.aiEstimated ? " (AI-estimated)" : ""
          }`,
        );
        setDescription("");
        setQuantity("100");
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
          placeholder="e.g. apple, boiled egg, chicken breast"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="food-quantity">Quantity</Label>
          <Input
            id="food-quantity"
            type="number"
            min="0"
            step="any"
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

      <Button onClick={handleLog} disabled={saving} className="w-full">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Log it
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
