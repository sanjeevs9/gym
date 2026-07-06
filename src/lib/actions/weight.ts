"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cached, invalidate } from "@/lib/query-cache";

export async function logWeightAction(weightKg: number, loggedAt?: Date) {
  if (!weightKg || weightKg <= 0) throw new Error("Enter a valid weight");
  const entry = await db.weightEntry.create({
    data: { weightKg, loggedAt: loggedAt ?? new Date() },
  });
  revalidatePath("/");
  revalidatePath("/weight");
  revalidatePath("/trends");
  invalidate("weight:", "summary:");
  return entry;
}

export async function deleteWeightEntryAction(id: string) {
  await db.weightEntry.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/weight");
  revalidatePath("/trends");
  invalidate("weight:", "summary:");
}

export async function getWeightEntriesInRange(gte: Date, lte: Date) {
  const key = `weight:range:${gte.toISOString()}:${lte.toISOString()}`;
  return cached(key, () =>
    db.weightEntry.findMany({
      where: { loggedAt: { gte, lte } },
      orderBy: { loggedAt: "desc" },
    }),
  );
}

export async function getLatestWeightKg(): Promise<number | undefined> {
  return cached("weight:latest", async () => {
    const latest = await db.weightEntry.findFirst({ orderBy: { loggedAt: "desc" } });
    return latest?.weightKg;
  });
}
