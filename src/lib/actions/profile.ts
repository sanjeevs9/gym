"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cached, invalidate } from "@/lib/query-cache";

export async function getProfileAction() {
  return cached("profile:singleton", () => db.profile.findUnique({ where: { id: "profile" } }));
}

export type UpsertProfileInput = {
  heightCm?: number | null;
  bodyFatPercent?: number | null;
};

export async function upsertProfileAction(input: UpsertProfileInput) {
  const profile = await db.profile.upsert({
    where: { id: "profile" },
    create: { id: "profile", ...input },
    update: input,
  });
  revalidatePath("/");
  revalidatePath("/profile");
  invalidate("profile:");
  return profile;
}
