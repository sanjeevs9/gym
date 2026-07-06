export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#eda100" };
  if (bmi < 25) return { label: "Healthy", color: "#0ca30c" };
  if (bmi < 30) return { label: "Overweight", color: "#eda100" };
  return { label: "Obese", color: "#e34948" };
}
