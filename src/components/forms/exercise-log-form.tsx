"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  estimateCardioCaloriesAction,
  estimateStepsCaloriesAction,
  estimateStrengthCaloriesAction,
  logExerciseAction,
  type StrengthSet,
} from "@/lib/actions/exercise";
import { useQuickAddClose } from "@/components/quick-add-dialog";
import { useSelectedDateKey } from "@/components/selected-date-context";
import { combineDayKeyWithNow, todayKey } from "@/lib/date";

export function ExerciseLogForm() {
  return (
    <Tabs defaultValue="cardio">
      <TabsList className="w-full">
        <TabsTrigger value="cardio">Cardio</TabsTrigger>
        <TabsTrigger value="strength">Strength</TabsTrigger>
        <TabsTrigger value="steps">Steps</TabsTrigger>
      </TabsList>
      <TabsContent value="cardio" className="pt-4">
        <CardioTab />
      </TabsContent>
      <TabsContent value="strength" className="pt-4">
        <StrengthTab />
      </TabsContent>
      <TabsContent value="steps" className="pt-4">
        <StepsTab />
      </TabsContent>
    </Tabs>
  );
}

function CardioTab() {
  const closeDialog = useQuickAddClose();
  const dateKey = useSelectedDateKey();
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("30");
  const [calories, setCalories] = useState("");
  const [aiUsed, setAiUsed] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const [estimating, startEstimating] = useTransition();
  const [saving, startSaving] = useTransition();

  function handleEstimate() {
    if (!activity.trim()) {
      toast.error("Describe the activity first");
      return;
    }
    const mins = parseFloat(duration);
    if (!mins || mins <= 0) {
      toast.error("Enter a valid duration");
      return;
    }
    startEstimating(async () => {
      try {
        const result = await estimateCardioCaloriesAction(activity, mins);
        setCalories(String(Math.round(result.caloriesBurned)));
        setReasoning(result.reasoning);
        setAiUsed(true);
      } catch {
        toast.error("Couldn't estimate calories burned");
      }
    });
  }

  function handleLog() {
    const cals = parseFloat(calories);
    if (!activity.trim() || !cals || cals <= 0) {
      toast.error("Fill in the activity and calories burned");
      return;
    }
    startSaving(async () => {
      try {
        await logExerciseAction({
          type: "CARDIO",
          description: activity,
          detailsJson: JSON.stringify({ activity, durationMinutes: parseFloat(duration) }),
          caloriesBurned: cals,
          estimatedByAi: aiUsed,
          loggedAt: dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey),
        });
        toast.success(`Logged ${activity}`);
        setActivity("");
        setDuration("30");
        setCalories("");
        setReasoning("");
        setAiUsed(false);
        closeDialog();
      } catch {
        toast.error("Couldn't save entry");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Activity</Label>
        <Input
          placeholder="e.g. running, cycling, jump rope"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min="0"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Calories burned</Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 100"
            value={calories}
            onChange={(e) => {
              setCalories(e.target.value);
              setAiUsed(false);
            }}
          />
        </div>
      </div>
      {reasoning && aiUsed && <p className="text-xs text-muted-foreground">{reasoning}</p>}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleEstimate}
          disabled={estimating}
          className="flex-1"
        >
          {estimating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Estimate with AI
        </Button>
        <Button onClick={handleLog} disabled={saving} className="flex-1">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Log it
        </Button>
      </div>
    </div>
  );
}

function StrengthTab() {
  const closeDialog = useQuickAddClose();
  const dateKey = useSelectedDateKey();
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState<StrengthSet[]>([{ reps: 10, weightKg: 20 }]);
  const [calories, setCalories] = useState("");
  const [aiUsed, setAiUsed] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const [estimating, startEstimating] = useTransition();
  const [saving, startSaving] = useTransition();

  function updateSet(i: number, patch: Partial<StrengthSet>) {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function handleEstimate() {
    if (!exerciseName.trim()) {
      toast.error("Name the exercise first");
      return;
    }
    startEstimating(async () => {
      try {
        const result = await estimateStrengthCaloriesAction(exerciseName, sets);
        setCalories(String(Math.round(result.caloriesBurned)));
        setReasoning(result.reasoning);
        setAiUsed(true);
      } catch {
        toast.error("Couldn't estimate calories burned");
      }
    });
  }

  function handleLog() {
    const cals = parseFloat(calories);
    if (!exerciseName.trim() || !cals || cals <= 0) {
      toast.error("Fill in the exercise and calories burned");
      return;
    }
    startSaving(async () => {
      try {
        await logExerciseAction({
          type: "STRENGTH",
          description: exerciseName,
          detailsJson: JSON.stringify({ exerciseName, sets }),
          caloriesBurned: cals,
          estimatedByAi: aiUsed,
          loggedAt: dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey),
        });
        toast.success(`Logged ${exerciseName}`);
        setExerciseName("");
        setSets([{ reps: 10, weightKg: 20 }]);
        setCalories("");
        setReasoning("");
        setAiUsed(false);
        closeDialog();
      } catch {
        toast.error("Couldn't save entry");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Exercise</Label>
        <Input
          placeholder="e.g. bench press, squats"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
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
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] text-muted-foreground">Weight (kg)</Label>
              <Input
                type="number"
                min="0"
                value={set.weightKg}
                onChange={(e) => updateSet(i, { weightKg: parseFloat(e.target.value) || 0 })}
              />
            </div>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSets((prev) => [...prev, { reps: 10, weightKg: 20 }])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add set
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label>Calories burned</Label>
        <Input
          type="number"
          min="0"
          placeholder="e.g. 80"
          value={calories}
          onChange={(e) => {
            setCalories(e.target.value);
            setAiUsed(false);
          }}
        />
      </div>
      {reasoning && aiUsed && <p className="text-xs text-muted-foreground">{reasoning}</p>}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleEstimate}
          disabled={estimating}
          className="flex-1"
        >
          {estimating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Estimate with AI
        </Button>
        <Button onClick={handleLog} disabled={saving} className="flex-1">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Log it
        </Button>
      </div>
    </div>
  );
}

function StepsTab() {
  const closeDialog = useQuickAddClose();
  const dateKey = useSelectedDateKey();
  const [steps, setSteps] = useState("5000");
  const [calories, setCalories] = useState("");
  const [aiUsed, setAiUsed] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const [estimating, startEstimating] = useTransition();
  const [saving, startSaving] = useTransition();

  function handleEstimate() {
    const count = parseFloat(steps);
    if (!count || count <= 0) {
      toast.error("Enter a valid step count");
      return;
    }
    startEstimating(async () => {
      try {
        const result = await estimateStepsCaloriesAction(count);
        setCalories(String(Math.round(result.caloriesBurned)));
        setReasoning(result.reasoning);
        setAiUsed(true);
      } catch {
        toast.error("Couldn't estimate calories burned");
      }
    });
  }

  function handleLog() {
    const count = parseFloat(steps);
    const cals = parseFloat(calories);
    if (!count || count <= 0 || !cals || cals <= 0) {
      toast.error("Fill in step count and calories burned");
      return;
    }
    startSaving(async () => {
      try {
        await logExerciseAction({
          type: "STEPS",
          description: `${count.toLocaleString()} steps`,
          detailsJson: JSON.stringify({ steps: count }),
          caloriesBurned: cals,
          estimatedByAi: aiUsed,
          loggedAt: dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey),
        });
        toast.success(`Logged ${count.toLocaleString()} steps`);
        setSteps("5000");
        setCalories("");
        setReasoning("");
        setAiUsed(false);
        closeDialog();
      } catch {
        toast.error("Couldn't save entry");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Steps</Label>
        <Input type="number" min="0" value={steps} onChange={(e) => setSteps(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Calories burned</Label>
        <Input
          type="number"
          min="0"
          placeholder="e.g. 150"
          value={calories}
          onChange={(e) => {
            setCalories(e.target.value);
            setAiUsed(false);
          }}
        />
      </div>
      {reasoning && aiUsed && <p className="text-xs text-muted-foreground">{reasoning}</p>}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleEstimate}
          disabled={estimating}
          className="flex-1"
        >
          {estimating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Estimate with AI
        </Button>
        <Button onClick={handleLog} disabled={saving} className="flex-1">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Log it
        </Button>
      </div>
    </div>
  );
}
