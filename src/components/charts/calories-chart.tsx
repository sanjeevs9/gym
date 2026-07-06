"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, CHART_INK } from "@/lib/chart-colors";
import type { TrendPoint } from "@/lib/actions/summary";

export function CaloriesChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          width={44}
        />
        <Tooltip
          contentStyle={{
            background: CHART_INK.surface,
            border: `1px solid ${CHART_INK.grid}`,
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
          formatter={(value) => `${Math.round(Number(value))} kcal`}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: CHART_INK.secondary, paddingTop: 8 }}
        />
        <Bar
          dataKey="calories"
          name="Calories in"
          fill={CHART_COLORS.caloriesIn}
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
        <Bar
          dataKey="caloriesBurned"
          name="Calories burned"
          fill={CHART_COLORS.caloriesBurned}
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
        <Line
          dataKey="net"
          name="Net"
          stroke={CHART_COLORS.net}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, stroke: CHART_INK.surface }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
