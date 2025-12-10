import mongoose from "mongoose";

/**
 * Pet Schema
 * Stores virtual pet data for each user:
 * - Name
 * - XP and Level
 * - Evolution stage (stage1 → stage2 → stage3)
 * - lastDailyXPDate (used to calculate daily XP once per day)
 */
const PetSchema = new mongoose.Schema(
  {

    name: { type: String, default: "Your Pet" },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    xp: { type: Number, default: 0 },

    lastDailyXPDate: { type: String, default: null }, // 记录最后计算daily XP的日期

    level: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["stage1", "stage2", "stage3"],
      default: "stage1",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pet", PetSchema);