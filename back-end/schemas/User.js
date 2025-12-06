import mongoose from "mongoose";

const calculate_bmi = function(height, weight){
  return weight / (height * height / 10000)
}

const calculate_bmr = function(weight, height, age, gender) {
  if (!weight || !height || !age || !gender) return 0;
  
  const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
  
  if (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
    return baseBMR + 5;
  } else if (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'f') {
    return baseBMR - 161;
  }
  
  return baseBMR - 78;
}

const calculate_tdee = function(bmr, activityLevel = 'moderate') {
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very_active': 1.9
  };
  
  const multiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.55;
  return bmr * multiplier;
}

const adjust_calories_for_target = function(tdee, currentWeight, targetWeight) {
  if (!targetWeight || targetWeight <= 0 || currentWeight <= 0) {
    return tdee;
  }
  
  const weightDiff = targetWeight - currentWeight;
  
  if (Math.abs(weightDiff) < 0.5) {
    return tdee;
  }
  
  if (weightDiff < 0) {
    return tdee - 400; 
  }

  return tdee + 400;
}

const calculate_nutrition_goals = function(weight, height, age, gender, targetWeight, activityLevel = 'moderate') {
  if (!weight || !height || !age || !gender) {
    return {
      total_intake_goal: 2000,
      protein_goal: 150,
      fat_goal: 67,
      carbs_goal: 250
    };
  }

  const bmr = calculate_bmr(weight, height, age, gender);

  const tdee = calculate_tdee(bmr, activityLevel);
 
  const targetCalories = adjust_calories_for_target(tdee, weight, targetWeight);

  const proteinGrams = Math.round(weight * 1.2);
  const proteinCalories = proteinGrams * 4;

  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  const carbsCalories = targetCalories - proteinCalories - fatCalories;
  const carbsGrams = Math.round(carbsCalories / 4);
  
  return {
    total_intake_goal: Math.round(targetCalories),
    protein_goal: proteinGrams,
    fat_goal: fatGrams,
    carbs_goal: carbsGrams
  };
}

const UserSchema = new mongoose.Schema({

  name: { type: String, default: "UserName" },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "" },

  height: { type: Number, default: 0 },     // cm
  weight: { type: Number, default: 0 },     // kg
  target_weight: { type: Number, default: 0 },

  bmi: { type: Number, default: 0 },

  // Nutrition goals (auto-calculated based on user info)
  total_intake_goal: { type: Number, default: 2000 },
  protein_goal: { type: Number, default: 150 },
  fat_goal: { type: Number, default: 67 },
  carbs_goal: { type: Number, default: 250 },
  
  // Activity level for TDEE calculation (optional)
  activity_level: { 
    type: String, 
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate' 
  },

}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (this.height > 0 && this.weight > 0) {
    const calculatedBmi = calculate_bmi(this.height, this.weight);
    this.bmi = Math.round(calculatedBmi * 10) / 10;
  }
  
  if (this.height > 0 && this.weight > 0 && this.age > 0 && this.gender) {
    const nutritionGoals = calculate_nutrition_goals(
      this.weight,
      this.height,
      this.age,
      this.gender,
      this.target_weight,
      this.activity_level
    );

    this.total_intake_goal = nutritionGoals.total_intake_goal;
    this.protein_goal = nutritionGoals.protein_goal;
    this.fat_goal = nutritionGoals.fat_goal;
    this.carbs_goal = nutritionGoals.carbs_goal;
  }
  
  next();
});

export default mongoose.model("User", UserSchema);