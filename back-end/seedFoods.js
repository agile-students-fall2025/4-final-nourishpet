import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./schemas/Food.js";

dotenv.config();

const commonFoods = [
  { food: "Banana", carbs: 23, protein: 1.1, fat: 0.3 },
  { food: "Apple", carbs: 14, protein: 0.3, fat: 0.2 },
  { food: "Orange", carbs: 12, protein: 0.9, fat: 0.1 },
  { food: "Strawberry", carbs: 8, protein: 0.7, fat: 0.3 },
  { food: "Blueberry", carbs: 14, protein: 0.7, fat: 0.3 },
  { food: "Grapes", carbs: 18, protein: 0.7, fat: 0.2 },
  { food: "Watermelon", carbs: 8, protein: 0.6, fat: 0.2 },
  { food: "Mango", carbs: 15, protein: 0.8, fat: 0.4 },
  { food: "Pineapple", carbs: 13, protein: 0.5, fat: 0.1 },
  { food: "Kiwi", carbs: 15, protein: 1.1, fat: 0.5 },
  
  { food: "Chicken Breast", carbs: 0, protein: 31, fat: 3.6 },
  { food: "Salmon", carbs: 0, protein: 20, fat: 13 },
  { food: "Egg", carbs: 1.1, protein: 13, fat: 11 },
  { food: "Ground Beef", carbs: 0, protein: 26, fat: 15 },
  { food: "Pork Chop", carbs: 0, protein: 29, fat: 10 },
  { food: "Turkey", carbs: 0, protein: 29, fat: 1.5 },
  { food: "Tuna", carbs: 0, protein: 30, fat: 1 },
  { food: "Shrimp", carbs: 0.2, protein: 24, fat: 0.3 },
  
  { food: "White Rice", carbs: 28, protein: 2.7, fat: 0.3 },
  { food: "Brown Rice", carbs: 23, protein: 2.6, fat: 0.9 },
  { food: "Pasta", carbs: 25, protein: 5, fat: 0.9 },
  { food: "Bread", carbs: 49, protein: 9, fat: 3.2 },
  { food: "Oatmeal", carbs: 12, protein: 2.4, fat: 1.4 },
  { food: "Quinoa", carbs: 21, protein: 4.4, fat: 1.9 },
  { food: "Sweet Potato", carbs: 20, protein: 1.6, fat: 0.1 },
  { food: "Potato", carbs: 17, protein: 2, fat: 0.1 },
  
  { food: "Broccoli", carbs: 7, protein: 2.8, fat: 0.4 },
  { food: "Spinach", carbs: 3.6, protein: 2.9, fat: 0.4 },
  { food: "Carrot", carbs: 10, protein: 0.9, fat: 0.2 },
  { food: "Tomato", carbs: 3.9, protein: 0.9, fat: 0.2 },
  { food: "Lettuce", carbs: 2.9, protein: 1.4, fat: 0.1 },
  { food: "Cucumber", carbs: 3.6, protein: 0.7, fat: 0.1 },
  { food: "Bell Pepper", carbs: 6, protein: 1, fat: 0.3 },
  { food: "Onion", carbs: 9, protein: 1.1, fat: 0.1 },
  { food: "Garlic", carbs: 33, protein: 6.4, fat: 0.5 },
  { food: "Mushroom", carbs: 3.3, protein: 3.1, fat: 0.3 },
  
  { food: "Milk", carbs: 5, protein: 3.4, fat: 1 },
  { food: "Yogurt", carbs: 4.7, protein: 10, fat: 0.4 },
  { food: "Cheese", carbs: 1.3, protein: 25, fat: 33 },
  { food: "Butter", carbs: 0.1, protein: 0.9, fat: 81 },
  { food: "Cream", carbs: 2.8, protein: 2.1, fat: 37 },
  
  { food: "Almonds", carbs: 22, protein: 21, fat: 49 },
  { food: "Walnuts", carbs: 14, protein: 15, fat: 65 },
  { food: "Peanuts", carbs: 16, protein: 26, fat: 49 },
  { food: "Cashews", carbs: 30, protein: 18, fat: 44 },
  { food: "Sunflower Seeds", carbs: 20, protein: 21, fat: 51 },
  
  { food: "Avocado", carbs: 9, protein: 2, fat: 15 },
  { food: "Olive Oil", carbs: 0, protein: 0, fat: 100 },
  { food: "Peanut Butter", carbs: 20, protein: 25, fat: 50 },
  { food: "Honey", carbs: 82, protein: 0.3, fat: 0 },
  { food: "Dark Chocolate", carbs: 46, protein: 8, fat: 43 },
  
  { food: "Beans", carbs: 63, protein: 21, fat: 0.9 },
  { food: "Lentils", carbs: 20, protein: 9, fat: 0.4 },
  { food: "Chickpeas", carbs: 27, protein: 9, fat: 2.6 },
  { food: "Tofu", carbs: 1.9, protein: 8, fat: 4.8 },
  
  { food: "Pizza", carbs: 33, protein: 12, fat: 10 },
  { food: "Burger", carbs: 29, protein: 17, fat: 15 },
  { food: "French Fries", carbs: 41, protein: 3.4, fat: 15 },
  { food: "Ice Cream", carbs: 24, protein: 3.5, fat: 11 },
  { food: "Cake", carbs: 55, protein: 4.3, fat: 15 },
  { food: "Cookie", carbs: 68, protein: 5.6, fat: 24 }
];

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const existingCount = await Food.countDocuments();
    console.log(`Current food count: ${existingCount}`);

    if (existingCount > 0) {
      console.log("Database already has food data. Do you want to:");
      console.log("1. Skip seeding");
      console.log("2. Clear and re-seed");
      console.log("\nTo clear and re-seed, run: node seedFoods.js --clear");
      
      if (!process.argv.includes('--clear')) {
        console.log("\nSkipping seed. Database already populated.");
        process.exit(0);
      }
      
      console.log("\nClearing existing foods...");
      await Food.deleteMany({});
      console.log("Cleared!");
    }

    console.log(`\nInserting ${commonFoods.length} common foods...`);
    const inserted = await Food.insertMany(commonFoods);
    console.log(`Successfully inserted ${inserted.length} foods!`);
    
    console.log("\nSample foods:");
    const samples = await Food.find().limit(5);
    samples.forEach(f => {
      console.log(`  - ${f.food}: Carbs ${f.carbs}g, Protein ${f.protein}g, Fat ${f.fat}g`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding foods:", error);
    process.exit(1);
  }
};

seedFoods();

