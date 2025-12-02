import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  carbs: {
    type: Number,
    required: true,
    default: 0,
  },
  protein: {
    type: Number,
    required: true,
    default: 0,
  },
  fat: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

// Add text index for search
FoodSchema.index({ food: "text" });

const Food = mongoose.model("Food", FoodSchema);

export default Food;

