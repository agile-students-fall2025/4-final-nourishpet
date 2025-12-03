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

export async function applyDailyNutritionXP(userId, nutrition, goals) {
  if (!userId) throw new Error("userId is required");

  // 1. Compute XP
  const gainedXp = computeDailyXP(nutrition, goals);

  // 2. Load pet
  const pet = await Pet.findOne({ user_id: userId });
  if (!pet) throw new Error("Pet not found");

  // 3. Apply XP
  pet.xp += gainedXp;

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

  if (nutrition.total_intake >= goals.total_intake_goal) {
    xp += 5; goalsReached++;
  }
  if (nutrition.protein >= goals.protein_goal) {
    xp += 5; goalsReached++;
  }
  if (nutrition.carbs >= goals.carbs_goal) {
    xp += 5; goalsReached++;
  }
  if (nutrition.fat >= goals.fat_goal) {
    xp += 5; goalsReached++;
  }

  if (goalsReached === 4) xp += 20;

  return xp;
}