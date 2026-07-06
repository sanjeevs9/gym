import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const MODEL = openai(process.env.AI_MODEL || "gpt-5.4-mini");

const NutritionSchema = z.object({
  calories: z.number().describe("Total calories in kcal for the given quantity"),
  protein: z.number().describe("Protein in grams for the given quantity"),
  carbs: z.number().describe("Total carbohydrates in grams for the given quantity"),
  fat: z.number().describe("Total fat in grams for the given quantity"),
  fiber: z.number().describe("Dietary fiber in grams for the given quantity"),
});

export type Nutrition = z.infer<typeof NutritionSchema>;

export async function estimateNutrition(
  description: string,
  quantity: number,
  unit: string,
): Promise<Nutrition> {
  const { object } = await generateObject({
    model: MODEL,
    schema: NutritionSchema,
    system:
      "You are a nutrition estimation engine. Given a food description and a quantity, " +
      "return your best-estimate nutrition facts using standard food composition data " +
      "(e.g. USDA FoodData Central) as your mental reference. Always scale the values to " +
      "the exact quantity given, not a generic serving size. Return plain numbers (no units, no ranges).",
    prompt: `Food: ${description}\nQuantity: ${quantity} ${unit}`,
  });
  return object;
}

const ExerciseCaloriesSchema = z.object({
  caloriesBurned: z.number().describe("Best-estimate total calories burned (kcal), a single number"),
  reasoning: z.string().describe("One short sentence (<20 words) explaining how the estimate was derived"),
});

export type ExerciseCaloriesEstimate = z.infer<typeof ExerciseCaloriesSchema>;

export async function estimateExerciseCalories(
  activityPrompt: string,
  bodyWeightKg?: number,
): Promise<ExerciseCaloriesEstimate> {
  const { object } = await generateObject({
    model: MODEL,
    schema: ExerciseCaloriesSchema,
    system:
      "You are an exercise energy-expenditure estimation engine. Given a description of an activity " +
      "(cardio, strength training with sets/reps/weight, or step count) and optionally the person's body " +
      "weight, estimate total calories burned using standard MET-value based calculations. " +
      "Be realistic and conservative rather than generous. Return a single numeric estimate.",
    prompt: `${activityPrompt}${
      bodyWeightKg ? `\nPerson's body weight: ${bodyWeightKg} kg` : ""
    }`,
  });
  return object;
}
