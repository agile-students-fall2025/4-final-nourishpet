// back-end/schemas/Food.js
import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    food: { 
      type: String, 
      required: true,
      trim: true
    },
    carbs: { 
      type: Number, 
      required: true,
      min: 0
    },
    protein: { 
      type: Number, 
      required: true,
      min: 0
    },
    fat: { 
      type: Number, 
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

// Create index for searching
FoodSchema.index({ food: 'text' });

export default mongoose.model("Food", FoodSchema);

