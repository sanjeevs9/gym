"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { logMealAction } from "@/lib/actions/meals";
import { useSelectedDateKey } from "@/components/selected-date-context";
import { combineDayKeyWithNow, todayKey } from "@/lib/date";

export function LogMealButton({ mealId, mealName }: { mealId: string; mealName: string }) {
  const [pending, startTransition] = useTransition();
  const dateKey = useSelectedDateKey();

  function handleLog() {
    startTransition(async () => {
      try {
        const loggedAt = dateKey === todayKey() ? undefined : combineDayKeyWithNow(dateKey);
        await logMealAction(mealId, loggedAt);
        toast.success(`Logged ${mealName}`);
      } catch {
        toast.error("Couldn't log meal");
      }
    });
  }

  return (
    <Button size="sm" onClick={handleLog} disabled={pending}>
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <PlusCircle className="h-3.5 w-3.5" />
      )}
      Log it
    </Button>
  );
}
