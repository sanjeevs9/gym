"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS, CHART_INK } from "@/lib/chart-colors";
import type { TrendPoint } from "@/lib/actions/summary";

export function WeightChart({ data }: { data: TrendPoint[] }) {
  const hasAny = data.some((d) => d.weightKg !== null);

  if (!hasAny) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
        No weight entries in this range yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          domain={["dataMin - 1", "dataMax + 1"]}
        />
        <Tooltip
          contentStyle={{
            background: CHART_INK.surface,
            border: `1px solid ${CHART_INK.grid}`,
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
          formatter={(value) => `${Number(value).toFixed(1)} kg`}
        />
        <Line
          dataKey="weightKg"
          name="Weight"
          stroke={CHART_COLORS.weight}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, stroke: CHART_INK.surface }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
