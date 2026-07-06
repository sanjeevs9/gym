"use client";

import { createContext, useContext, type ReactNode } from "react";
import { todayKey } from "@/lib/date";

const SelectedDateContext = createContext<string | null>(null);

export function useSelectedDateKey() {
  return useContext(SelectedDateContext) ?? todayKey();
}

export function SelectedDateProvider({ date, children }: { date: string; children: ReactNode }) {
  return <SelectedDateContext.Provider value={date}>{children}</SelectedDateContext.Provider>;
}
