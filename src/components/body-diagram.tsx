import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { relativeDayLabel } from "@/lib/date";
import type { MuscleRecency } from "@/lib/actions/exercise";

const UNTRACKED = "#e2e2e2";
const NEVER_TRAINED = "#e5e7eb";

function bucketColor(daysAgo: number | null): string {
  if (daysAgo === null) return NEVER_TRAINED;
  if (daysAgo <= 1) return "#4a3aa7";
  if (daysAgo <= 3) return "#7a6cc4";
  if (daysAgo <= 7) return "#b0a6dd";
  return "#ded8f2";
}

function labelFor(entry: MuscleRecency | undefined): string {
  if (!entry?.lastTrainedAt) return "Not trained yet";
  return relativeDayLabel(entry.lastTrainedAt);
}

type Region = { fill: string; title: string };

function regionFor(byMuscle: Map<string, MuscleRecency>, muscle: string): Region {
  const entry = byMuscle.get(muscle);
  return { fill: bucketColor(entry?.daysAgo ?? null), title: `${muscle} — ${labelFor(entry)}` };
}

export function BodyDiagram({ recency }: { recency: MuscleRecency[] }) {
  const byMuscle = new Map(recency.map((r) => [r.muscle, r]));

  return (
    <div className="space-y-4">
      <Tabs defaultValue="front">
        <TabsList>
          <TabsTrigger value="front">Front</TabsTrigger>
          <TabsTrigger value="back">Back</TabsTrigger>
        </TabsList>
        <TabsContent value="front" className="pt-4">
          <FrontFigure byMuscle={byMuscle} />
        </TabsContent>
        <TabsContent value="back" className="pt-4">
          <BackFigure byMuscle={byMuscle} />
        </TabsContent>
      </Tabs>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {recency.map((m) => (
          <li
            key={m.muscle}
            className="flex items-center gap-2 rounded-lg bg-secondary/40 px-2.5 py-2 text-xs"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: bucketColor(m.daysAgo) }}
            />
            <span className="min-w-0 flex-1 truncate font-medium text-foreground">{m.muscle}</span>
            <span className="shrink-0 text-muted-foreground">{labelFor(m)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FrontFigure({ byMuscle }: { byMuscle: Map<string, MuscleRecency> }) {
  const chest = regionFor(byMuscle, "Chest");
  const shoulders = regionFor(byMuscle, "Shoulders");
  const biceps = regionFor(byMuscle, "Biceps");
  const legs = regionFor(byMuscle, "Legs");

  return (
    <svg
      viewBox="0 0 200 380"
      className="mx-auto h-auto w-full max-w-[220px]"
      role="img"
      aria-label="Front view of body, colored by how recently each muscle group was trained"
    >
      <circle cx="100" cy="28" r="22" fill={UNTRACKED} />
      <rect x="92" y="46" width="16" height="16" fill={UNTRACKED} />

      <rect x="62" y="60" width="76" height="115" rx="20" fill={chest.fill}>
        <title>{chest.title}</title>
      </rect>

      <rect x="28" y="80" width="24" height="75" rx="12" fill={biceps.fill}>
        <title>{biceps.title}</title>
      </rect>
      <rect x="148" y="80" width="24" height="75" rx="12" fill={biceps.fill}>
        <title>{biceps.title}</title>
      </rect>

      <circle cx="55" cy="75" r="18" fill={shoulders.fill}>
        <title>{shoulders.title}</title>
      </circle>
      <circle cx="145" cy="75" r="18" fill={shoulders.fill}>
        <title>{shoulders.title}</title>
      </circle>

      <rect x="30" y="150" width="18" height="65" rx="9" fill={UNTRACKED} />
      <rect x="152" y="150" width="18" height="65" rx="9" fill={UNTRACKED} />

      <rect x="70" y="178" width="60" height="32" rx="14" fill={UNTRACKED} />

      <rect x="68" y="212" width="28" height="95" rx="14" fill={legs.fill}>
        <title>{legs.title}</title>
      </rect>
      <rect x="104" y="212" width="28" height="95" rx="14" fill={legs.fill}>
        <title>{legs.title}</title>
      </rect>

      <rect x="70" y="305" width="24" height="55" rx="11" fill={UNTRACKED} />
      <rect x="106" y="305" width="24" height="55" rx="11" fill={UNTRACKED} />
    </svg>
  );
}

function BackFigure({ byMuscle }: { byMuscle: Map<string, MuscleRecency> }) {
  const back = regionFor(byMuscle, "Back");
  const shoulders = regionFor(byMuscle, "Shoulders");
  const triceps = regionFor(byMuscle, "Triceps");
  const legs = regionFor(byMuscle, "Legs");

  return (
    <svg
      viewBox="0 0 200 380"
      className="mx-auto h-auto w-full max-w-[220px]"
      role="img"
      aria-label="Back view of body, colored by how recently each muscle group was trained"
    >
      <circle cx="100" cy="28" r="22" fill={UNTRACKED} />
      <rect x="92" y="46" width="16" height="16" fill={UNTRACKED} />

      <rect x="62" y="60" width="76" height="115" rx="20" fill={back.fill}>
        <title>{back.title}</title>
      </rect>

      <rect x="28" y="80" width="24" height="75" rx="12" fill={triceps.fill}>
        <title>{triceps.title}</title>
      </rect>
      <rect x="148" y="80" width="24" height="75" rx="12" fill={triceps.fill}>
        <title>{triceps.title}</title>
      </rect>

      <circle cx="55" cy="75" r="18" fill={shoulders.fill}>
        <title>{shoulders.title}</title>
      </circle>
      <circle cx="145" cy="75" r="18" fill={shoulders.fill}>
        <title>{shoulders.title}</title>
      </circle>

      <rect x="30" y="150" width="18" height="65" rx="9" fill={UNTRACKED} />
      <rect x="152" y="150" width="18" height="65" rx="9" fill={UNTRACKED} />

      <rect x="70" y="178" width="60" height="32" rx="14" fill={UNTRACKED} />

      <rect x="68" y="212" width="28" height="95" rx="14" fill={legs.fill}>
        <title>{legs.title}</title>
      </rect>
      <rect x="104" y="212" width="28" height="95" rx="14" fill={legs.fill}>
        <title>{legs.title}</title>
      </rect>

      <rect x="70" y="305" width="24" height="55" rx="11" fill={UNTRACKED} />
      <rect x="106" y="305" width="24" height="55" rx="11" fill={UNTRACKED} />
    </svg>
  );
}
