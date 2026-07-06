"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function logWeightAction(weightKg: number, loggedAt?: Date) {
  if (!weightKg || weightKg <= 0) throw new Error("Enter a valid weight");
  const entry = await db.weightEntry.create({
    data: { weightKg, loggedAt: loggedAt ?? new Date() },
  });
  revalidatePath("/");
  revalidatePath("/weight");
  revalidatePath("/trends");
  return entry;
}

export async function deleteWeightEntryAction(id: string) {
  await db.weightEntry.delete({ where: { id } });
  revalidatePath("/weight");
  revalidatePath("/trends");
}

export async function getWeightEntriesInRange(gte: Date, lte: Date) {
  return db.weightEntry.findMany({
    where: { loggedAt: { gte, lte } },
    orderBy: { loggedAt: "desc" },
  });
}

export async function getLatestWeightKg(): Promise<number | undefined> {
  const latest = await db.weightEntry.findFirst({ orderBy: { loggedAt: "desc" } });
  return latest?.weightKg;
}
