"use client";

import {
  LineChart,
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

const SERIES = [
  { key: "protein", name: "Protein", color: CHART_COLORS.protein },
  { key: "carbs", name: "Carbs", color: CHART_COLORS.carbs },
  { key: "fat", name: "Fat", color: CHART_COLORS.fat },
  { key: "fiber", name: "Fiber", color: CHART_COLORS.fiber },
] as const;

export function MacrosChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
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
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: CHART_INK.surface,
            border: `1px solid ${CHART_INK.grid}`,
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
          formatter={(value) => `${Math.round(Number(value))} g`}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: CHART_INK.secondary, paddingTop: 8 }}
        />
        {SERIES.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2, stroke: CHART_INK.surface }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
