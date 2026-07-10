"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shiftDayKey, todayKey, parseDayKey, relativeDayLabel, formatInAppTz } from "@/lib/date";

export function DateNav({ date, basePath }: { date: string; basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = todayKey();
  const isCurrentToday = date === today;
  const selected = parseDayKey(date);
  const label = relativeDayLabel(selected);
  const showFullDate = label !== "Today" && label !== "Yesterday";

  function go(newDate: string) {
    const params = new URLSearchParams(searchParams);
    if (newDate === today) {
      params.delete("date");
    } else {
      params.set("date", newDate);
    }
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => go(shiftDayKey(date, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="relative flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium">
        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{showFullDate ? formatInAppTz(selected, "MMM d") : label}</span>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => e.target.value && go(e.target.value)}
          aria-label="Pick a date"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => go(shiftDayKey(date, 1))}
        disabled={isCurrentToday}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      {!isCurrentToday && (
        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => go(today)}>
          Today
        </Button>
      )}
    </div>
  );
}
