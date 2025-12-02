// back-end/db/petDB.js
import Pet from "../schemas/Pet.js";

const XP_PER_LEVEL = 50;   // match wth frontend XPBar 
const LEVELS_PER_STAGE = 33;

// show pet
export async function showPetInfo(userId) {
  if (!userId) throw new Error("userId is required");
  const pet = await Pet.findOne({ user_id: userId });
  return pet || null;
}

// upgrade
export async function upgrade(userId, gainedXp) {
  if (!userId) throw new Error("userId is required");

  const pet = await Pet.findOne({ user_id: userId });
  if (!pet) throw new Error("Pet not found");

  pet.xp += gainedXp;

  // Level：floor(xp / 50) + 1
  const newLevel = Math.floor(pet.xp / XP_PER_LEVEL) + 1;
  pet.level = newLevel;

  // Stage
  if (newLevel <= LEVELS_PER_STAGE) {
    pet.status = "stage1";
  } else if (newLevel <= LEVELS_PER_STAGE * 2) {
    pet.status = "stage2";
  } else {
    pet.status = "stage3";
  }

  await pet.save();
  return pet;
}
