export type WorkoutExercise = {
  name: string;
  equipment: string | null;
  images: [string, string];
};

export type WorkoutDay = {
  day: number;
  muscle: string;
  exercises: WorkoutExercise[];
};

// Exercise names are the user's own 6-day split, including warm-up stretches.
// Photos are two public-domain still frames (start/end position) from the
// free-exercise-db project (github.com/yuhonas/free-exercise-db, Unlicense /
// public domain) — matched by closest movement to the named exercise, not
// scraped from any commercial app. Stretches are tagged equipment: "body only"
// so the logger hides the weight field for them.
export const WORKOUT_PLAN: WorkoutDay[] = [
  {
    day: 1,
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