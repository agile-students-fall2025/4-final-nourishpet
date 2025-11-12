import { readFileSync, writeFileSync } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PET_DATA_PATH = path.join(__dirname, "temp_data", "pet_info.json");
const XP_PER_LEVEL = 50;


export function showPetInfo() {
  try {
    const rawData = readFileSync(PET_DATA_PATH, "utf-8");
    const petData = JSON.parse(rawData);
    return petData;
  } catch (error) {
    console.error("Error reading pet info:", error.message);
    throw new Error("Failed to read pet info");
  }
}

export function calculateXP(todayArchive) {
  let totalXP = 0;
  let goalsReached = 0;

  if (todayArchive["Total Intake"] >= todayArchive["Total Intake Goal"]) {
    totalXP += 5;
    goalsReached++;
  }

  if (todayArchive["Protein"] >= todayArchive["Protein Goal"]) {
    totalXP += 5;
    goalsReached++;
  }

  if (todayArchive["Carbs"] >= todayArchive["Carbs Goal"]) {
    totalXP += 5;
    goalsReached++;
  }

  if (todayArchive["Fat"] >= todayArchive["Fat Goal"]) {
    totalXP += 5;
    goalsReached++;
  }

  if (goalsReached === 4) {
    totalXP += 20;
  }

  return totalXP;
}

export function upgrade(xpGain) {
  try {
    const petData = showPetInfo();
    let { level, xp } = petData;

    xp += xpGain;

    // From level N to level N+1, the total XP >= N * 50
    let levelUpCount = 0;
    let currentLevel = level;
    
    while (xp >= currentLevel * XP_PER_LEVEL) {
      levelUpCount++;
      currentLevel++;
    }
    
    if (levelUpCount > 0) {
      level = currentLevel;
    }

    const updatedPetData = {
      ...petData,
      level: level,
      xp: xp
    };

    writeFileSync(PET_DATA_PATH, JSON.stringify(updatedPetData, null, 2));

    return {
      ...updatedPetData,
      levelUpCount: levelUpCount,
      leveledUp: levelUpCount > 0
    };
  } catch (error) {
    console.error("Error upgrading pet:", error.message);
    throw new Error("Failed to upgrade pet");
  }
}
