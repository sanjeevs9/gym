"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { upsertProfileAction } from "@/lib/actions/profile";

export function ProfileForm({
  initialHeightCm,
  initialBodyFatPercent,
}: {
  initialHeightCm: number | null;
  initialBodyFatPercent: number | null;
}) {
  const [heightCm, setHeightCm] = useState(initialHeightCm?.toString() ?? "");
  const [bodyFatPercent, setBodyFatPercent] = useState(initialBodyFatPercent?.toString() ?? "");
  const [saving, startSaving] = useTransition();

  function handleSave() {
    const height = heightCm.trim() === "" ? null : parseFloat(heightCm);
    const bodyFat = bodyFatPercent.trim() === "" ? null : parseFloat(bodyFatPercent);
    if (height !== null && (height <= 0 || height > 300)) {
      toast.error("Enter a valid height in cm");
      return;
    }
    if (bodyFat !== null && (bodyFat < 0 || bodyFat > 100)) {
      toast.error("Enter a valid body fat percentage");
      return;
    }
    startSaving(async () => {
      try {
        await upsertProfileAction({ heightCm: height, bodyFatPercent: bodyFat });
        toast.success("Profile saved");
      } catch {
        toast.error("Couldn't save profile");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="profile-height">Height (cm)</Label>
          <Input
            id="profile-height"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 175"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-bodyfat">Body fat %</Label>
          <Input
            id="profile-bodyfat"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="optional"
            value={bodyFatPercent}
            onChange={(e) => setBodyFatPercent(e.target.value)}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Height lets us calculate your BMI from your logged weight. Body fat % is self-reported
        (e.g. from a smart scale) — we don&apos;t estimate it.
      </p>
      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save profile
      </Button>
    </div>
  );
}
