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
import { Loader2 } from "lucide-react";
import { logWeightAction } from "@/lib/actions/weight";
import { useQuickAddClose } from "@/components/quick-add-dialog";
import { useSelectedDateKey } from "@/components/selected-date-context";
import { combineDayKeyWithNow, todayKey } from "@/lib/date";

const LBS_PER_KG = 2.20462262;

export function WeightLogForm() {
  const closeDialog = useQuickAddClose();
  const dateKey = useSelectedDateKey();
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [saving, startSaving] = useTransition();

  function handleLog() {
    const num = parseFloat(value);
    if (!num || num <= 0) {
      toast.error("Enter a valid weight");
      return;
    }
    const weightKg = unit === "kg" ? num : num / LBS_PER_KG;
    startSaving(async () => {
      try {
        await logWeightAction(
          weightKg,
          dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey),
        );
        toast.success(`Logged ${num} ${unit}`);
        setValue("");
        closeDialog();
      } catch {
        toast.error("Couldn't save weight");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <Label>Weight</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 72.5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="w-24 space-y-1.5">
          <Label>Unit</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as "kg" | "lb")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lb">lb</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleLog} disabled={saving} className="w-full">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Log weight
      </Button>
    </div>
  );
}
