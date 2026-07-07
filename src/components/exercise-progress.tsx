"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS, CHART_INK } from "@/lib/chart-colors";
import { getExerciseProgressAction, type ExerciseProgressPoint } from "@/lib/actions/exercise";
import { labelForDay } from "@/lib/date";

function setsSummary(sets: { reps: number; weightKg: number }[]) {
  return sets.map((s) => (s.weightKg > 0 ? `${s.reps}×${s.weightKg}kg` : `${s.reps} reps`)).join(", ");
}

export function ExerciseProgress({ exerciseNames }: { exerciseNames: string[] }) {
  const [selected, setSelected] = useState(exerciseNames[0] ?? "");
  const [points, setPoints] = useState<ExerciseProgressPoint[]>([]);
  const [loading, startLoading] = useTransition();

  useEffect(() => {
    if (!selected) return;
    startLoading(async () => {
      const result = await getExerciseProgressAction(selected);
      setPoints(result);
    });
  }, [selected]);

  if (exerciseNames.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
        Log a strength exercise to start tracking progress over time.
      </p>
    );
  }

  const chartData = points.map((p) => ({
    label: labelForDay(new Date(p.loggedAt)),
    maxWeightKg: p.maxWeightKg,
  }));

  const first = points[0];
  const latest = points[points.length - 1];
  const weightDelta = points.length >= 2 ? latest.maxWeightKg - first.maxWeightKg : null;

  return (
    <div className="space-y-4">
      <Select value={selected} onValueChange={(v) => setSelected(v as string)}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Choose an exercise" />
        </SelectTrigger>
        <SelectContent>
          {exerciseNames.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : points.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No sessions logged for this exercise yet.
        </p>
      ) : (
        <>
          {weightDelta !== null && (
            <p className="text-sm text-muted-foreground">
              {weightDelta > 0
                ? `Max weight is up ${weightDelta}kg`
                : weightDelta < 0
                  ? `Max weight is down ${Math.abs(weightDelta)}kg`
                  : "Max weight is unchanged"}{" "}
              since your first logged session.
            </p>
          )}

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: CHART_INK.baseline }}
                tick={{ fill: CHART_INK.muted, fontSize: 11 }}
                minTickGap={20}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: CHART_INK.muted, fontSize: 11 }}
                width={40}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip
                contentStyle={{
                  background: CHART_INK.surface,
                  border: `1px solid ${CHART_INK.grid}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
                formatter={(value) => [`${value} kg`, "Max weight"]}
              />
              <Line
                dataKey="maxWeightKg"
                name="Max weight"
                stroke={CHART_COLORS.weight}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, stroke: CHART_INK.surface }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <ul className="space-y-1.5">
            {[...points]
              .reverse()
              .slice(0, 8)
              .map((p) => (
                <li
                  key={p.loggedAt}
                  className="flex items-center justify-between gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-xs"
                >
                  <span className="shrink-0 text-muted-foreground">
                    {labelForDay(new Date(p.loggedAt))}
                  </span>
                  <span className="truncate text-right font-medium text-foreground">
                    {setsSummary(p.sets)}
                  </span>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}
