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

const ParsedFoodSchema = z.object({
  description: z
    .string()
    .describe(
      "A short, clean food name, keeping any ingredient-quantity detail that gives context (e.g. " +
        "'Paneer bhurji (75g paneer)' from 'paneer bhurji with 75gm of paneer' — don't just say " +
        "'Paneer bhurji', since that loses the anchor amount).",
    ),
  quantity: z
    .number()
    .describe(
      "The numeric quantity parsed from the text (e.g. 75 from '75gm'). If no quantity is mentioned, use a reasonable typical serving size.",
    ),
  unit: z
    .string()
    .describe(
      "The unit for the quantity — one of g, ml, oz, cup, tbsp, tsp, piece, serving. Infer the most natural one from the text.",
    ),
  calories: z.number().describe("Total calories in kcal for the whole dish/portion described"),
  protein: z.number().describe("Protein in grams for the whole dish/portion described"),
  carbs: z.number().describe("Total carbohydrates in grams for the whole dish/portion described"),
  fat: z.number().describe("Total fat in grams for the whole dish/portion described"),
  fiber: z.number().describe("Dietary fiber in grams for the whole dish/portion described"),
});

export type ParsedFood = z.infer<typeof ParsedFoodSchema>;

// Lets the user type quantity inline (e.g. "75g paneer bhurji", "2 idlis with
// sambar") instead of filling separate Quantity/Unit fields — the AI parses
// out the amount and returns a cleaned-up food name alongside the estimate.
export async function estimateNutritionFromDescription(text: string): Promise<ParsedFood> {
  const { object } = await generateObject({
    model: MODEL,
    schema: ParsedFoodSchema,
    system:
      "You are a nutrition estimation engine. The user describes a food in free text, which may " +
      "already include a quantity and unit inline (e.g. '75gm of paneer', 'a bowl of rice', '2 idlis'). " +
      "Parse out that quantity and unit. Watch for composite/mixed dishes (bhurji, curry, sabzi, fried " +
      "rice, etc.) where the stated quantity names one key ingredient rather than the whole plate — " +
      "e.g. 'paneer bhurji with 75gm of paneer' means 75g of paneer went into the dish, which also " +
      "realistically includes onions, capsicum, oil, and spices in normal home-cooking proportions. " +
      "In that case, estimate nutrition for the full dish as typically prepared around that amount of " +
      "the named ingredient — never just the named ingredient eaten raw and alone, which would " +
      "understate calories and fat. If the text calls out a modifier that overrides a typical " +
      "assumption (e.g. 'no oil', 'without butter', 'boiled not fried', 'extra paneer', 'low spice'), " +
      "honor that instead of the default preparation — the user's explicit wording always wins over " +
      "your prior on how the dish is usually made. Use standard food composition data (e.g. USDA " +
      "FoodData Central) as your mental reference. If no quantity is mentioned at all, pick a typical " +
      "single-serving amount and unit. Return plain numbers (no units, no ranges).",
    prompt: `Food description: ${text}`,
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
