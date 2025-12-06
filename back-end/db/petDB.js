// back-end/db/petDB.js
// back-end/db/petDB.js
import Pet from "../schemas/Pet.js";

const XP_PER_LEVEL = 50;   // match wth frontend XPBar 
const LEVELS_PER_STAGE = 33;

export const getAllPets = async () => {
    return await Pet.find({}).sort({ name: 1 });
  };

export async function createPet(userId, petData = {}) {
    if (!userId) throw new Error("userId is required");
    
    // Check if pet already exists
    const existingPet = await Pet.findOne({ user_id: userId });
    if (existingPet) {
        return existingPet;
    }
    
    // Create new pet with default values
    const newPet = await Pet.create({
        user_id: userId,
        name: petData.name || "Your Pet",
        xp: petData.xp || 0,
        level: petData.level || 1,
        status: petData.status || "stage1"
    });
    
    return newPet;
}

export async function showPetInfo(userId) {
        if (!userId) throw new Error("userId is required");
        const pet = await Pet.findOne({ user_id: userId });
        return pet || null;
    };

export async function updatePetByUserId(userId, updateData) {
    if (!userId) throw new Error("userId is required");
    const updatedPet = await Pet.findOneAndUpdate(
        { user_id: userId },
        updateData,
        { new: true }
    );
    return updatedPet;
}

export async function applyDailyNutritionXP(userId, nutrition, goals, targetDate) {
  if (!userId) throw new Error("userId is required");
  if (!targetDate) throw new Error("targetDate is required");

  // 1. Load pet
  const pet = await Pet.findOne({ user_id: userId });
  if (!pet) throw new Error("Pet not found");

  // 2. Compute XP
  const gainedXp = computeDailyXP(nutrition, goals);


  if (gainedXp > 0) {
    pet.xp += gainedXp;
  }

  // 4. Recalculate level
  const newLevel = Math.floor(pet.xp / XP_PER_LEVEL) + 1;
  pet.level = newLevel;

  // 5. Recalculate stage
  if (newLevel <= LEVELS_PER_STAGE) {
    pet.status = "stage1";
  } else if (newLevel <= LEVELS_PER_STAGE * 2) {
    pet.status = "stage2";
  } else {
    pet.status = "stage3";
  }

  // 6. Save pet
  await pet.save();

  return { updatedPet: pet, gainedXp };
}



export function computeDailyXP(nutrition, goals) {
  let xp = 0;
  let goalsReached = 0;

  if (nutrition.total_intake >= goals.total_intake_goal && 
      nutrition.total_intake <= goals.total_intake_goal * 1.2) {
    xp += 20; goalsReached++;
  }
  if (nutrition.protein >= goals.protein_goal && 
      nutrition.protein <= goals.protein_goal * 1.2) {
    xp += 20; goalsReached++;
  }
  if (nutrition.carbs >= goals.carbs_goal && 
      nutrition.carbs <= goals.carbs_goal * 1.2) {
    xp += 20; goalsReached++;
  }
  if (nutrition.fat >= goals.fat_goal && 
      nutrition.fat <= goals.fat_goal * 1.2) {
    xp += 20; goalsReached++;
  }

  if (goalsReached === 4) xp += 50;

  return xp;
}

function getTodayString() {
  const dateObj = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

function getYesterdayString() {
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() - 1);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

function dateStringToDate(dateString) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateString.split(", ");
  const year = parseInt(parts[1]);
  const monthDay = parts[0].split(" ");
  const month = monthNames.indexOf(monthDay[0]);
  const day = parseInt(monthDay[1]);
  return new Date(year, month, day);
}

export async function addFoodXP(userId) {
  if (!userId) throw new Error("userId is required");

  // 1. Load pet
  const pet = await Pet.findOne({ user_id: userId });
  if (!pet) throw new Error("Pet not found");

  // 2. Add 2 XP
  pet.xp += 2;

  // 3. Recalculate level
  const newLevel = Math.floor(pet.xp / XP_PER_LEVEL) + 1;
  pet.level = newLevel;

  // 4. Recalculate stage
  if (newLevel <= LEVELS_PER_STAGE) {
    pet.status = "stage1";
  } else if (newLevel <= LEVELS_PER_STAGE * 2) {
    pet.status = "stage2";
  } else {
    pet.status = "stage3";
  }

  // 5. Save pet
  await pet.save();

  return { updatedPet: pet, gainedXp: 2 };
}