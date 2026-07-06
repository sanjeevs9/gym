"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Dumbbell } from "lucide-react";
import { ExercisePhotoLoop } from "@/components/exercise-photo-loop";
import {
  estimateStrengthCaloriesAction,
  logExerciseAction,
  type StrengthSet,
} from "@/lib/actions/exercise";
import { useSelectedDateKey } from "@/components/selected-date-context";
import { combineDayKeyWithNow, relativeDayLabel, parseDayKey, todayKey } from "@/lib/date";

export function PlanExerciseRow({
  name,
  equipment,
  images,
}: {
  name: string;
  equipment: string | null;
  images: [string, string];
}) {
  const isBodyweight = equipment?.toLowerCase() === "body only";
  const [open, setOpen] = useState(false);
  const [sets, setSets] = useState<StrengthSet[]>([{ reps: 10, weightKg: isBodyweight ? 0 : 20 }]);
  const [saving, startSaving] = useTransition();
  const dateKey = useSelectedDateKey();
  const dayLabel = relativeDayLabel(parseDayKey(dateKey)).toLowerCase();

  function updateSet(i: number, patch: Partial<StrengthSet>) {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function handleLog() {
    startSaving(async () => {
      try {
        const estimate = await estimateStrengthCaloriesAction(name, sets);
        await logExerciseAction({
          type: "STRENGTH",
          description: name,
          detailsJson: JSON.stringify({ exerciseName: name, sets }),
          caloriesBurned: estimate.caloriesBurned,
          estimatedByAi: true,
          loggedAt: dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey),
        });
        toast.success(`Logged ${name} — ${Math.round(estimate.caloriesBurned)} kcal burned`);
        setOpen(false);
        setSets([{ reps: 10, weightKg: isBodyweight ? 0 : 20 }]);
      } catch {
        toast.error("Couldn't log this exercise");
      }
    });
  }

  return (
    <li className="rounded-lg border border-border bg-card p-2.5">
      <div className="flex items-center gap-3">
        <ExercisePhotoLoop images={images} alt={name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          {equipment && <p className="text-xs text-muted-foreground capitalize">{equipment}</p>}
        </div>
        <Button variant={open ? "secondary" : "outline"} size="sm" onClick={() => setOpen((o) => !o)}>
          <Dumbbell className="h-3.5 w-3.5" />
          Log
        </Button>
      </div>

      {open && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <Label className="text-xs text-muted-foreground">Sets</Label>
          {sets.map((set, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-[10px] text-muted-foreground">Reps</Label>
                <Input
                  type="number"
                  min="0"
                  value={set.reps}
                  onChange={(e) => updateSet(i, { reps: parseFloat(e.target.value) || 0 })}
                />
              </div>
              {!isBodyweight && (
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Weight (kg)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={set.weightKg}
                    onChange={(e) => updateSet(i, { weightKg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSets((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={sets.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSets((prev) => [...prev, { reps: 10, weightKg: isBodyweight ? 0 : 20 }])
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add set
            </Button>
            <Button size="sm" onClick={handleLog} disabled={saving} className="flex-1">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Log it for {dayLabel}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
