"use server";

import { db } from "@/lib/db";
import { dayRange, lastNDaysRange, dayKey, labelForDay } from "@/lib/date";
import { cached } from "@/lib/query-cache";

export type DailySummary = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  caloriesBurned: number;
  net: number;
  weightKg: number | null;
};

export async function getDailySummary(date: Date = new Date()): Promise<DailySummary> {
  const key = `summary:daily:${dayKey(date)}`;
  return cached(key, async () => {
    const range = dayRange(date);

    const [foodEntries, exerciseEntries, weightEntry] = await Promise.all([
      db.foodEntry.findMany({ where: { loggedAt: range } }),
      db.exerciseEntry.findMany({ where: { loggedAt: range } }),
      db.weightEntry.findFirst({ where: { loggedAt: range }, orderBy: { loggedAt: "desc" } }),
    ]);

    const totals = foodEntries.reduce(
      (acc, e) => {
        acc.calories += e.calories;
        acc.protein += e.protein;
        acc.carbs += e.carbs;
        acc.fat += e.fat;
        acc.fiber += e.fiber;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    );

    const caloriesBurned = exerciseEntries.reduce((sum, e) => sum + e.caloriesBurned, 0);

    return {
      ...totals,
      caloriesBurned,
      net: totals.calories - caloriesBurned,
      weightKg: weightEntry?.weightKg ?? null,
    };
  });
}

export type TrendPoint = {
  date: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  caloriesBurned: number;
  net: number;
  weightKg: number | null;
};

export async function getTrends(days: number): Promise<TrendPoint[]> {
  const cacheKey = `summary:trends:${days}:${dayKey(new Date())}`;
  return cached(cacheKey, async () => {
    const range = lastNDaysRange(days);

    const [foodEntries, exerciseEntries, weightEntries] = await Promise.all([
      db.foodEntry.findMany({ where: { loggedAt: range } }),
      db.exerciseEntry.findMany({ where: { loggedAt: range } }),
      db.weightEntry.findMany({ where: { loggedAt: range }, orderBy: { loggedAt: "asc" } }),
    ]);

    const byDay = new Map<string, TrendPoint>();
    for (let i = 0; i < days; i++) {
      const d = new Date(range.gte);
      d.setDate(d.getDate() + i);
      const key = dayKey(d);
      byDay.set(key, {
        date: key,
        label: labelForDay(d),
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        caloriesBurned: 0,
        net: 0,
        weightKg: null,
      });
    }

    for (const e of foodEntries) {
      const key = dayKey(e.loggedAt);
      const point = byDay.get(key);
      if (!point) continue;
      point.calories += e.calories;
      point.protein += e.protein;
      point.carbs += e.carbs;
      point.fat += e.fat;
      point.fiber += e.fiber;
    }

    for (const e of exerciseEntries) {
      const key = dayKey(e.loggedAt);
      const point = byDay.get(key);
      if (!point) continue;
      point.caloriesBurned += e.caloriesBurned;
    }

    for (const e of weightEntries) {
      const key = dayKey(e.loggedAt);
      const point = byDay.get(key);
      if (point) point.weightKg = e.weightKg;
    }

    const points = Array.from(byDay.values());
    for (const p of points) p.net = p.calories - p.caloriesBurned;
    return points;
  });
}
