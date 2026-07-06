// App-wide accent used for active nav state and the Overview panel's avatar
// badge — kept distinct from the categorical chart palette below.
export const BRAND = "#4a3aa7";

// Fixed categorical hue assignment — an entity always keeps the same color
// everywhere it appears across the app (dashboard, trends, tooltips).
export const CHART_COLORS = {
  caloriesIn: "#2a78d6",
  caloriesBurned: "#eb6834",
  protein: "#1baf7a",
  carbs: "#008300",
  fat: "#eda100",
  fiber: "#e87ba4",
  weight: "#2a78d6",
} as const;

export const CHART_INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
  baseline: "#c3c2b7",
  surface: "#fcfcfb",
} as const;
