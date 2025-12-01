// back-end/db/petDB.js
import mongoose from "mongoose";
import Pet from "../schemas/Pet.js";   // ✅ 修正路径！

// each 50 XP upgrades 1 level
const XP_PER_LEVEL = 50;

// ---------- pet info ----------
export async function showPetInfo(userId) {
  if (!userId) throw new Error("userId is required");

  const pet = await Pet.findOne({ user_id: userId });

  if (!pet) return null;

  return pet;
}

// ---------- upgrade  ----------
export async function upgrade(userId, gainedXp) {
  if (!userId) throw new Error("userId is required");

  const pet = await Pet.findOne({ user_id: userId });
  if (!pet) throw new Error("Pet not found");

  pet.xp += gainedXp;

  // Level ：floor(xp/50)+1
  const newLevel = Math.floor(pet.xp / XP_PER_LEVEL) + 1;
  pet.level = newLevel;

  //  Stage 33 elvel -> one stage
  if (newLevel <= 33) pet.status = "stage1";
  else if (newLevel <= 66) pet.status = "stage2";
  else pet.status = "stage3";

  await pet.save();

  return pet;
}
