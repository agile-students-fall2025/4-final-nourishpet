import { readFileSync } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_DATA_PATH = path.join(__dirname, "temp_data", "userData.json");

export function calculateNutritionGoals() {
  const rawData = readFileSync(USER_DATA_PATH, "utf-8");
  const userData = JSON.parse(rawData);

  const age = parseInt(userData.age);
  const gender = userData.gender.toLowerCase();
  const height = parseFloat(userData.height);
  const weight = parseFloat(userData.currentWeight);

  if (!age || !gender || !height || !weight) {
    throw new Error('Missing required user data fields');
  }

  let bmr;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else if (gender === 'female') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  } else {
    throw new Error('Invalid gender');
  }

  const tdee = bmr * 1.55;

  const proteinGrams = (tdee * 0.20) / 4;
  const fatGrams = (tdee * 0.25) / 9;
  const carbGrams = (tdee * 0.55) / 4;

  return {
    "Total Intake Goal": Math.round(tdee),
    "Protein Goal": Math.round(proteinGrams),
    "Carbs Goal": Math.round(carbGrams),
    "Fat Goal": Math.round(fatGrams)
  };
}
