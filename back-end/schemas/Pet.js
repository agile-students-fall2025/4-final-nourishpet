import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "" },
  height: { type: Number, default: 0 },    // cm
  weight: { type: Number, default: 0 },    // kg
  target_weight: { type: Number, default: 0 },
  bmi: { type: Number, default: 0 },

  // Nutrition goals
  total_intake_goal: { type: Number, default: 2000 },
  protein_goal: { type: Number, default: 900 },
  fat_goal: { type: Number, default: 900 },
  carbs_goal: { type: Number, default: 900 },

}, { timestamps: true });

export default mongoose.model("User", UserSchema);