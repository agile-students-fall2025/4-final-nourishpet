import mongoose from "mongoose";

const calculate_bmi = function(height, weight){
  return weight / (height * height / 10000)
}

const UserSchema = new mongoose.Schema({

  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "" },

  height: { type: Number, default: 0 },     // cm
  weight: { type: Number, default: 0 },     // kg
  target_weight: { type: Number, default: 0 },

  bmi: { type: Number, default: 0 },

  // Nutrition goals
  total_intake_goal: { type: Number, default: 2000 },
  protein_goal: { type: Number, default: 900 },
  fat_goal: { type: Number, default: 900 },
  carbs_goal: { type: Number, default: 900 },

}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (this.height > 0 && this.weight > 0) {
    this.bmi = calculate_bmi(this.height, this.weight);
  }
  next();
});

export default mongoose.model("User", UserSchema);