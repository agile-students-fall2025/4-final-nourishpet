// back-end/schemas/Pet.js
import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
    // 1. 宠物名字
    name: { type: String, required: true },

    // 2. 所属用户（关联 users 集合）
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 3. 当前总经验值
    xp: { type: Number, default: 0 },

    // 4. 当前等级（至少 1 级）
    level: { type: Number, default: 1 },

    // 5. 宠物阶段状态：根据等级区间来算
    //  1–33  -> stage1
    // 34–66  -> stage2
    // 67+    -> stage3
    status: {
      type: String,
      enum: ["stage1", "stage2", "stage3"],
      default: "stage1",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pet", PetSchema);
