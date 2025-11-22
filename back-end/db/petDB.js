// back-end/db/petDB.js
import Pet from "../schemas/Pet.js";

/**
 * 每 50 XP 升 1 Level
 * level = floor(xp / 50) + 1
 */
function calcLevelFromXp(xp) {
  if (xp < 0) xp = 0;
  return Math.floor(xp / 50) + 1;
}

/**
 * Stage 规则：
 * 每 33 level 升一个 stage，最多 stage3
 *
 * 1 - 33  -> stage1
 * 34 - 66 -> stage2
 * 67+    -> stage3 (封顶)
 */
function calcStatusFromLevel(level) {
  if (level <= 33) return "stage1";
  if (level <= 66) return "stage2";
  return "stage3"; // 超过也固定为 stage3
}

// 获取宠物信息
export async function showPetInfo(userId) {
  const pet = await Pet.findOne({ user_id: userId }).lean();

  if (!pet) {
    throw new Error("Pet not found for this user");
  }

  return {
    id: pet._id.toString(),
    name: pet.name,
    user_id: pet.user_id.toString(),
    xp: pet.xp,
    level: pet.level,
    status: pet.status,
  };
}

// 增加经验并自动升级
export async function upgrade(userId, gainedXp) {
  const pet = await Pet.findOne({ user_id: userId });

  if (!pet) {
    throw new Error("Pet not found for this user");
  }

  // 增加经验
  pet.xp += gainedXp;

  // 重新计算 level
  pet.level = calcLevelFromXp(pet.xp);

  // 根据 level 计算 stage
  pet.status = calcStatusFromLevel(pet.level);

  await pet.save();

  return {
    id: pet._id.toString(),
    name: pet.name,
    user_id: pet.user_id.toString(),
    xp: pet.xp,
    level: pet.level,
    status: pet.status,
  };
}
