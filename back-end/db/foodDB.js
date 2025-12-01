// back-end/db/foodDB.js
import mongoose from "mongoose";
import Food from "../schemas/Food.js";

// ---------- Get all foods or search ----------
export async function getFoods(searchQuery = null, limit = 100) {
  try {
    let query = {};
    
    // If search query exists, use text search or regex
    if (searchQuery) {
      query = {
        food: { $regex: searchQuery, $options: 'i' } // case-insensitive search
      };
    }
    
    const foods = await Food.find(query).limit(limit).lean();
    return foods;
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw error;
  }
}

// ---------- Get food by ID ----------
export async function getFoodById(foodId) {
  if (!foodId) throw new Error("foodId is required");
  
  const food = await Food.findById(foodId);
  return food;
}

// ---------- Create new food ----------
export async function createFood(foodData) {
  const { food, carbs, protein, fat } = foodData;
  
  if (!food || carbs === undefined || protein === undefined || fat === undefined) {
    throw new Error("Missing required food fields");
  }
  
  const newFood = new Food({
    food,
    carbs: Number(carbs),
    protein: Number(protein),
    fat: Number(fat)
  });
  
  await newFood.save();
  return newFood;
}

// ---------- Update food ----------
export async function updateFood(foodId, updateData) {
  if (!foodId) throw new Error("foodId is required");
  
  const food = await Food.findByIdAndUpdate(
    foodId,
    updateData,
    { new: true, runValidators: true }
  );
  
  return food;
}

// ---------- Delete food ----------
export async function deleteFood(foodId) {
  if (!foodId) throw new Error("foodId is required");
  
  await Food.findByIdAndDelete(foodId);
  return true;
}

