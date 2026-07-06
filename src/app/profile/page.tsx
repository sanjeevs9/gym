export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/forms/profile-form";
import { getProfileAction } from "@/lib/actions/profile";
import { getLatestWeightKg } from "@/lib/actions/weight";
import { calculateBmi, bmiCategory } from "@/lib/bmi";

export default async function ProfilePage() {
  const [profile, latestWeightKg] = await Promise.all([getProfileAction(), getLatestWeightKg()]);

  const bmi =
    profile?.heightCm && latestWeightKg ? calculateBmi(latestWeightKg, profile.heightCm) : null;
  const category = bmi ? bmiCategory(bmi) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Personal stats used to calculate your BMI and dashboard metrics.
        </p>
      </div>

      {bmi && category && (
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Current BMI</p>
              <p className="text-3xl font-semibold tracking-tight">{bmi.toFixed(1)}</p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: `${category.color}1a`, color: category.color }}
            >
              {category.label}
            </span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal stats</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialHeightCm={profile?.heightCm ?? null}
            initialBodyFatPercent={profile?.bodyFatPercent ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
