import mongoose from "mongoose";

/**
 * Nutrition Schema
 * Stores a single day's nutrition log for a specific user.
 * Each document corresponds to one date and includes total macros
 * plus detailed lists (foods, grams, protein, carbs, fat).
 */
const NutritionSchema = new mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: String,   // Example: "Nov 23, 2025"
    required: true
  },

  total_intake: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },

  // Arrays matching your temp_data structure
  food_list: { type: [String], default: [] },
  grams: { type: [Number], default: [] },
  protein_list: { type: [Number], default: [] },
  fat_list: { type: [Number], default: [] },
  carbs_list: { type: [Number], default: [] }

}, { timestamps: true,
  collection: 'nutritions'
 });

export default mongoose.model("Nutrition", NutritionSchema);