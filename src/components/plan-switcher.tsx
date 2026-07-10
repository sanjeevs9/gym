"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkoutPlan } from "@/lib/workout-plan";

export function PlanSwitcher({
  plans,
  activePlanId,
  defaultPlanId,
}: {
  plans: WorkoutPlan[];
  activePlanId: string;
  defaultPlanId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function go(planId: string) {
    const params = new URLSearchParams(searchParams);
    if (planId === defaultPlanId) {
      params.delete("plan");
    } else {
      params.set("plan", planId);
    }
    const query = params.toString();
    router.push(query ? `/plan?${query}` : "/plan");
  }

  return (
    <Select value={activePlanId} onValueChange={(v) => go(v as string)}>
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {plans.map((plan) => (
          <SelectItem key={plan.id} value={plan.id}>
            {plan.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
