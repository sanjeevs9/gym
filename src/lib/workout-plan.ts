export type WorkoutExercise = {
  name: string;
  equipment: string | null;
  images: [string, string];
  // Canonical muscle group for body-diagram recency tracking. Overrides the
  // day's `muscle` fallback; omit for exercises with no single-muscle mapping
  // (e.g. core work), which simply won't show up on the diagram.
  muscle?: string;
  // Prescribed sets x reps, display only, e.g. "4x8-10".
  targetSets?: string;
};

export type WorkoutDay = {
  day: number;
  label: string; // tab label, e.g. "Day 1" or "Mon"
  title: string; // heading shown above the exercise list, e.g. "Chest" or "Push"
  muscle?: string; // canonical muscle-group fallback for exercises without their own override
  note?: string; // optional freeform note shown under the heading
  exercises: WorkoutExercise[];
};

export type WorkoutPlan = {
  id: string;
  name: string;
  description: string;
  days: WorkoutDay[];
};

// Exercise names are the user's own 6-day split, including warm-up stretches.
// Photos are two public-domain still frames (start/end position) from the
// free-exercise-db project (github.com/yuhonas/free-exercise-db, Unlicense /
// public domain) — matched by closest movement to the named exercise, not
// scraped from any commercial app. Stretches are tagged equipment: "body only"
// so the logger hides the weight field for them.
const MUSCLE_SPLIT_DAYS: WorkoutDay[] = [
  {
    day: 1,
    label: "Day 1",
    title: "Chest",
    muscle: "Chest",
    exercises: [
      {
        name: "Push Ups",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/1.jpg"],
      },
      {
        name: "Barbell Bench Press (Flat_Overhand Grip)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg"],
      },
      {
        name: "Flat Dumbbell Press",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/1.jpg"],
      },
      {
        name: "Barbell Bench Press (Incline_Overhand Grip)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip/1.jpg"],
      },
      {
        name: "Dumbbell Fly (Incline Bench)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes/1.jpg"],
      },
      {
        name: "Barbell Bench Press (Decline_Overhand Grip)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/1.jpg"],
      },
      {
        name: "Pec Deck",
        equipment: "machine",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/1.jpg"],
      },
      {
        name: "Dumbbell Pullover (Flat Bench)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Dumbbell_Pullover/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Dumbbell_Pullover/1.jpg"],
      },
      {
        name: "Stretch - Pectoralis Major (Standing_Arms Swing)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dynamic_Chest_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dynamic_Chest_Stretch/1.jpg"],
      },
    ],
  },
  {
    day: 2,
    label: "Day 2",
    title: "Back",
    muscle: "Back",
    exercises: [
      {
        name: "Cable Lat Pulldown (Seated_Behind Neck_Wide Overhand Grip)",
        equipment: "cable",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Pulldown_Behind_The_Neck/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Pulldown_Behind_The_Neck/1.jpg"],
      },
      {
        name: "Cable Lat Pulldown (Seated_Wide Overhand Grip)",
        equipment: "cable",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg"],
      },
      {
        name: "Plate Loaded Row (Lying)",
        equipment: "machine",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_T-Bar_Row/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_T-Bar_Row/1.jpg"],
      },
      {
        name: "Cable Row (Seated_Low)",
        equipment: "cable",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg"],
      },
      {
        name: "Barbell Row (Bent Over_Overhand Grip)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/1.jpg"],
      },
      {
        name: "One-Arm Dumbbell Row",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/1.jpg"],
      },
      {
        name: "Barbell Deadlift",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/1.jpg"],
      },
      {
        name: "Stretch - Lower Back (Kneeling_Cat Pose)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cat_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cat_Stretch/1.jpg"],
      },
      {
        name: "Stretch - Lower Back (Prone_Arms Assist)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cat_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cat_Stretch/1.jpg"],
      },
    ],
  },
  {
    day: 3,
    label: "Day 3",
    title: "Shoulders",
    muscle: "Shoulders",
    exercises: [
      {
        name: "Barbell Shoulder Press (Military)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/1.jpg"],
      },
      {
        name: "Barbell Shoulder Press (Military_Behind Neck)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Barbell_Military_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Barbell_Military_Press/1.jpg"],
      },
      {
        name: "Dumbbell Shoulder Press (Military)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/1.jpg"],
      },
      {
        name: "Dumbbell Raise (Lateral)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/1.jpg"],
      },
      {
        name: "EZ Curl Bar Raise (Front)",
        equipment: "other",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Plate_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Plate_Raise/1.jpg"],
      },
      {
        name: "Dumbbell Raise (Front)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/1.jpg"],
      },
      {
        name: "Selectorized Fly (Rear Delt)",
        equipment: "cable",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear_Delt_Fly/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear_Delt_Fly/1.jpg"],
      },
      {
        name: "EZ Curl Bar Shrug",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/1.jpg"],
      },
      {
        name: "Stretch - Deltoids (Standing_Circles_Arms Out)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Round_The_World_Shoulder_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Round_The_World_Shoulder_Stretch/1.jpg"],
      },
      {
        name: "Stretch - Deltoids (Standing_Circles_Hands To Shoulders)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shoulder_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shoulder_Stretch/1.jpg"],
      },
      {
        name: "Stretch - Deltoids (Standing_Cross Body_Arms Cross)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_And_Front_Of_Shoulder_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_And_Front_Of_Shoulder_Stretch/1.jpg"],
      },
    ],
  },
  {
    day: 4,
    label: "Day 4",
    title: "Biceps",
    muscle: "Biceps",
    exercises: [
      {
        name: "Barbell Biceps Curl",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/1.jpg"],
      },
      {
        name: "Standing Dumbbell Curl",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/1.jpg"],
      },
      {
        name: "Dumbbell Biceps Curl (Incline Bench)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/1.jpg"],
      },
      {
        name: "Barbell Biceps Curl (Preacher_Sitting)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/1.jpg"],
      },
      {
        name: "Kettlebell Biceps Curl (Firm Grip_Concentration_Single Arm)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Concentration_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Concentration_Curl/1.jpg"],
      },
      {
        name: "Dumbbell Hammer Curl",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/1.jpg"],
      },
      {
        name: "Cable Wrist Curl (Overhand Grip)",
        equipment: "cable",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/1.jpg"],
      },
      {
        name: "Cable Wrist Curl (Behind Back_Underhand Grip)",
        equipment: "cable",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/1.jpg"],
      },
    ],
  },
  {
    day: 5,
    label: "Day 5",
    title: "Triceps",
    muscle: "Triceps",
    exercises: [
      {
        name: "Bodyweight Dip (Bench_Bent Knees)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/1.jpg"],
      },
      {
        name: "Cable Push Down",
        equipment: "cable",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/1.jpg"],
      },
      {
        name: "Dumbbell Triceps Extension (Seated_Cross Body)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension/1.jpg"],
      },
      {
        name: "EZ Curl Bar Triceps Extension (Seated)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_EZ_Bar_Triceps_Extension/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_EZ_Bar_Triceps_Extension/1.jpg"],
      },
      {
        name: "Barbell Triceps Extension (Flat Bench)",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Close-Grip_Barbell_Triceps_Extension_Behind_The_Head/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Close-Grip_Barbell_Triceps_Extension_Behind_The_Head/1.jpg"],
      },
      {
        name: "Dumbbell Triceps Extension (Flat Bench_Cross Body)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Dumbbell_Triceps_Extension/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Dumbbell_Triceps_Extension/1.jpg"],
      },
      {
        name: "Dumbbell Triceps Kickback (On Bench_Neutral Grip)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dumbbell_Kickback/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dumbbell_Kickback/1.jpg"],
      },
      {
        name: "Stretch - Triceps Brachii (Standing_Behind Head)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Stretch/1.jpg"],
      },
    ],
  },
  {
    day: 6,
    label: "Day 6",
    title: "Legs",
    muscle: "Legs",
    exercises: [
      {
        name: "Squats",
        equipment: "barbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/1.jpg"],
      },
      {
        name: "Dumbbell Lunge (Walking)",
        equipment: "dumbbell",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/1.jpg"],
      },
      {
        name: "Leg Press",
        equipment: "machine",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/1.jpg"],
      },
      {
        name: "Plate Loaded Squat (Hack)",
        equipment: "machine",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hack_Squat/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hack_Squat/1.jpg"],
      },
      {
        name: "Seated Leg Curls",
        equipment: "machine",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/1.jpg"],
      },
      {
        name: "Leg Extension",
        equipment: "machine",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/1.jpg"],
      },
      {
        name: "Seated Calf raises",
        equipment: "machine",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/1.jpg"],
      },
      {
        name: "Stretch - Hamstrings (Standing_Knee To Chest)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Knee_To_Chest/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Knee_To_Chest/1.jpg"],
      },
      {
        name: "Stretch - Hamstrings (Standing_Legs Apart)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/The_Straddle/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/The_Straddle/1.jpg"],
      },
      {
        name: "Stretch - Hamstrings (Standing_Leg Kick)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring_Stretch/1.jpg"],
      },
      {
        name: "Stretch - Hamstrings (Standing_Runner Pose)",
        equipment: "body only",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Runners_Stretch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Runners_Stretch/1.jpg"],
      },
    ],
  },
];

// A 6-day Push/Pull/Legs-style split with a dedicated V-taper focus day
// (Thursday) and a core-only home day (Wednesday, no gym equipment).
const V_TAPER_DAYS: WorkoutDay[] = [
  {
    day: 1,
    label: "Mon",
    title: "Push",
    exercises: [
      {
        name: "Incline Dumbbell Bench Press",
        equipment: "dumbbell",
        muscle: "Chest",
        targetSets: "4x8-10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Bench_With_Palms_Facing_In/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Bench_With_Palms_Facing_In/1.jpg"],
      },
      {
        name: "Machine Chest Press",
        equipment: "machine",
        muscle: "Chest",
        targetSets: "3x10-12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Chest_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Chest_Press/1.jpg"],
      },
      {
        name: "Cable Crossover",
        equipment: "cable",
        muscle: "Chest",
        targetSets: "3x12-15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/1.jpg"],
      },
      {
        name: "Dumbbell Shoulder Press",
        equipment: "dumbbell",
        muscle: "Shoulders",
        targetSets: "3x8-10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/1.jpg"],
      },
      {
        name: "Cable Lateral Raise",
        equipment: "cable",
        muscle: "Shoulders",
        targetSets: "4x12-15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/1.jpg"],
      },
      {
        name: "Cable Pushdown",
        equipment: "cable",
        muscle: "Triceps",
        targetSets: "3x10-12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/1.jpg"],
      },
      {
        name: "Overhead Cable Tricep Extension",
        equipment: "cable",
        muscle: "Triceps",
        targetSets: "3x10-12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/1.jpg"],
      },
    ],
  },
  {
    day: 2,
    label: "Tue",
    title: "Pull",
    exercises: [
      {
        name: "Lat Pulldown (Wide Grip)",
        equipment: "cable",
        muscle: "Back",
        targetSets: "4x8-10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg"],
      },
      {
        name: "Single-Arm Dumbbell Row",
        equipment: "dumbbell",
        muscle: "Back",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/1.jpg"],
      },
      {
        name: "Seated Cable Row",
        equipment: "cable",
        muscle: "Back",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg"],
      },
      {
        name: "Face Pull",
        equipment: "cable",
        muscle: "Shoulders",
        targetSets: "3x15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/1.jpg"],
      },
      {
        name: "Straight-Arm Pulldown",
        equipment: "cable",
        muscle: "Back",
        targetSets: "3x12-15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight-Arm_Pulldown/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight-Arm_Pulldown/1.jpg"],
      },
      {
        name: "EZ-Bar Curl",
        equipment: "barbell",
        muscle: "Biceps",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/EZ-Bar_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/EZ-Bar_Curl/1.jpg"],
      },
      {
        name: "Hammer Curl",
        equipment: "dumbbell",
        muscle: "Biceps",
        targetSets: "3x12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/1.jpg"],
      },
    ],
  },
  {
    day: 3,
    label: "Wed",
    title: "Home",
    note: "+ 30–45 minute walk.",
    exercises: [
      {
        name: "Bicycle Crunch",
        equipment: "body only",
        targetSets: "3x20",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cross-Body_Crunch/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cross-Body_Crunch/1.jpg"],
      },
      {
        name: "Toe Touches",
        equipment: "body only",
        targetSets: "3x20",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Toe_Touchers/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Toe_Touchers/1.jpg"],
      },
      {
        name: "Mountain Climbers",
        equipment: "body only",
        targetSets: "3x30 sec",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Mountain_Climbers/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Mountain_Climbers/1.jpg"],
      },
      {
        name: "Standard Plank",
        equipment: "body only",
        targetSets: "3x60 sec",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/1.jpg"],
      },
      {
        name: "Russian Twists",
        equipment: "body only",
        targetSets: "3x20",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Russian_Twist/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Russian_Twist/1.jpg"],
      },
    ],
  },
  {
    day: 4,
    label: "Thu",
    title: "Upper (V-Taper Focus)",
    exercises: [
      {
        name: "Incline Barbell Bench Press",
        equipment: "barbell",
        muscle: "Chest",
        targetSets: "4x8",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip/1.jpg"],
      },
      {
        name: "Lat Pulldown (Wide Grip)",
        equipment: "cable",
        muscle: "Back",
        targetSets: "4x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg"],
      },
      {
        name: "Lever Row Machine",
        equipment: "machine",
        muscle: "Back",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Iso_Row/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Iso_Row/1.jpg"],
      },
      {
        name: "Cable Lateral Raise",
        equipment: "cable",
        muscle: "Shoulders",
        targetSets: "4x15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/1.jpg"],
      },
      {
        name: "Machine Rear Delt Fly",
        equipment: "machine",
        muscle: "Shoulders",
        targetSets: "3x15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/1.jpg"],
      },
      {
        name: "Concentration Curl",
        equipment: "dumbbell",
        muscle: "Biceps",
        targetSets: "3x12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curls/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curls/1.jpg"],
      },
    ],
  },
  {
    day: 5,
    label: "Fri",
    title: "Back & Shoulders",
    exercises: [
      {
        name: "Hammer Strength Pulldown",
        equipment: "machine",
        muscle: "Back",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Front_Lat_Pulldown/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Front_Lat_Pulldown/1.jpg"],
      },
      {
        name: "Incline Dumbbell Row",
        equipment: "dumbbell",
        muscle: "Back",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Incline_Row/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Incline_Row/1.jpg"],
      },
      {
        name: "Face Pull",
        equipment: "cable",
        muscle: "Shoulders",
        targetSets: "3x15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/1.jpg"],
      },
      {
        name: "Arnold Press",
        equipment: "dumbbell",
        muscle: "Shoulders",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/1.jpg"],
      },
      {
        name: "Cable Lateral Raise",
        equipment: "cable",
        muscle: "Shoulders",
        targetSets: "4x15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/1.jpg"],
      },
      {
        name: "Front Dumbbell Raise",
        equipment: "dumbbell",
        muscle: "Shoulders",
        targetSets: "3x12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/1.jpg"],
      },
      {
        name: "Close-Grip Bench Press",
        equipment: "barbell",
        muscle: "Triceps",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/1.jpg"],
      },
    ],
  },
  {
    day: 6,
    label: "Sat",
    title: "Legs",
    muscle: "Legs",
    exercises: [
      {
        name: "Barbell Back Squat",
        equipment: "barbell",
        targetSets: "4x8",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/1.jpg"],
      },
      {
        name: "Leg Press",
        equipment: "machine",
        targetSets: "3x12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/1.jpg"],
      },
      {
        name: "Leg Curl Machine",
        equipment: "machine",
        targetSets: "3x12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/1.jpg"],
      },
      {
        name: "Leg Extension Machine",
        equipment: "machine",
        targetSets: "3x12",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/1.jpg"],
      },
      {
        name: "Barbell Hip Thrust",
        equipment: "barbell",
        targetSets: "3x10",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/1.jpg"],
      },
      {
        name: "Dumbbell Calf Raise",
        equipment: "dumbbell",
        targetSets: "4x15",
        images: ["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Raise_On_A_Dumbbell/0.jpg", "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Raise_On_A_Dumbbell/1.jpg"],
      },
    ],
  },
];

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "muscle-split",
    name: "6-Day Split",
    description: "One muscle group per day.",
    days: MUSCLE_SPLIT_DAYS,
  },
  {
    id: "v-taper",
    name: "V-Taper Split",
    description: "Push / pull / legs with a dedicated V-taper focus day and a core-only home day.",
    days: V_TAPER_DAYS,
  },
];