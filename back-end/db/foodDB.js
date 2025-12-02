import Food from "../schemas/Food.js";

// Get all foods
export const getAllFoods = async () => {
  return await Food.find({}).sort({ food: 1 });
};

// Search foods by name (case-insensitive partial match)
export const searchFoods = async (query) => {
  if (!query || query.trim() === "") {
    return await getAllFoods();
  }
  
  const regex = new RegExp(query.trim(), "i");
  return await Food.find({ food: regex }).sort({ food: 1 });
};

// Get food by exact name
export const getFoodByName = async (name) => {
  return await Food.findOne({ food: name });
};

// Add a new food
export const addFood = async (foodData) => {
  const food = new Food(foodData);
  return await food.save();
};

// Add multiple foods (for seeding)
export const addManyFoods = async (foodsArray) => {
  return await Food.insertMany(foodsArray, { ordered: false });
};

// Check if food collection has data
export const getFoodCount = async () => {
  return await Food.countDocuments();
};

