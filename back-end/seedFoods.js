import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./schemas/Food.js";

dotenv.config();

const commonFoods = [
  // --- FRUITS ---
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
  { food: "Peach", carbs: 10, protein: 0.9, fat: 0.3 },
  { food: "Pear", carbs: 15, protein: 0.4, fat: 0.1 },
  { food: "Plum", carbs: 11, protein: 0.7, fat: 0.3 },
  { food: "Cherry", carbs: 16, protein: 1.1, fat: 0.2 },
  { food: "Raspberry", carbs: 12, protein: 1.2, fat: 0.7 },
  { food: "Blackberry", carbs: 10, protein: 1.4, fat: 0.5 },
  { food: "Cranberry", carbs: 12, protein: 0.4, fat: 0.1 },
  { food: "Coconut Meat", carbs: 15, protein: 3.3, fat: 33 },
  { food: "Lemon", carbs: 9, protein: 1.1, fat: 0.3 },
  { food: "Lime", carbs: 11, protein: 0.7, fat: 0.2 },
  { food: "Grapefruit", carbs: 11, protein: 0.8, fat: 0.1 },
  { food: "Melon (Cantaloupe)", carbs: 8, protein: 0.8, fat: 0.2 },
  { food: "Melon (Honeydew)", carbs: 9, protein: 0.5, fat: 0.1 },
  { food: "Papaya", carbs: 11, protein: 0.5, fat: 0.3 },
  { food: "Apricot", carbs: 11, protein: 1.4, fat: 0.4 },
  { food: "Fig (Fresh)", carbs: 19, protein: 0.8, fat: 0.3 },
  { food: "Date (Dried)", carbs: 75, protein: 2.5, fat: 0.4 },
  { food: "Raisins", carbs: 79, protein: 3.1, fat: 0.5 },
  { food: "Lychee", carbs: 17, protein: 0.8, fat: 0.4 },
  { food: "Pomegranate", carbs: 19, protein: 1.7, fat: 1.2 },
  { food: "Dragon Fruit", carbs: 13, protein: 1.2, fat: 0 },
  { food: "Avocado", carbs: 9, protein: 2, fat: 15 },

  // --- VEGETABLES ---
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
  { food: "Asparagus", carbs: 3.9, protein: 2.2, fat: 0.1 },
  { food: "Green Beans", carbs: 7, protein: 1.8, fat: 0.2 },
  { food: "Zucchini", carbs: 3.1, protein: 1.2, fat: 0.3 },
  { food: "Eggplant", carbs: 6, protein: 1, fat: 0.2 },
  { food: "Brussels Sprouts", carbs: 9, protein: 3.4, fat: 0.3 },
  { food: "Cabbage", carbs: 6, protein: 1.3, fat: 0.1 },
  { food: "Cauliflower", carbs: 5, protein: 1.9, fat: 0.3 },
  { food: "Kale", carbs: 9, protein: 2.9, fat: 1.5 },
  { food: "Celery", carbs: 3, protein: 0.7, fat: 0.2 },
  { food: "Corn", carbs: 19, protein: 3.2, fat: 1.2 },
  { food: "Peas", carbs: 14, protein: 5, fat: 0.4 },
  { food: "Sweet Potato", carbs: 20, protein: 1.6, fat: 0.1 },
  { food: "Potato", carbs: 17, protein: 2, fat: 0.1 },
  { food: "Pumpkin", carbs: 6.5, protein: 1, fat: 0.1 },
  { food: "Squash", carbs: 12, protein: 1, fat: 0.5 },
  { food: "Radish", carbs: 3.4, protein: 0.7, fat: 0.1 },
  { food: "Beetroot", carbs: 10, protein: 1.6, fat: 0.2 },
  { food: "Artichoke", carbs: 11, protein: 3.3, fat: 0.2 },
  { food: "Okra", carbs: 7, protein: 1.9, fat: 0.2 },

  // --- PROTEINS (MEAT/FISH/EGGS/ETC) ---
  { food: "Chicken Breast", carbs: 0, protein: 31, fat: 3.6 },
  { food: "Chicken Thigh", carbs: 0, protein: 24, fat: 8 },
  { food: "Turkey", carbs: 0, protein: 29, fat: 1.5 },
  { food: "Duck", carbs: 0, protein: 19, fat: 28 },
  { food: "Beef Steak", carbs: 0, protein: 25, fat: 19 },
  { food: "Ground Beef 80/20", carbs: 0, protein: 26, fat: 20 },
  { food: "Beef Jerky", carbs: 11, protein: 33, fat: 26 },
  { food: "Pork Chop", carbs: 0, protein: 27, fat: 14 },
  { food: "Bacon", carbs: 1.4, protein: 37, fat: 42 },
  { food: "Ham", carbs: 1.5, protein: 21, fat: 6 },
  { food: "Sausage", carbs: 2, protein: 12, fat: 27 },
  { food: "Salami", carbs: 1, protein: 22, fat: 26 },
  { food: "Lamb Chop", carbs: 0, protein: 25, fat: 21 },
  { food: "Salmon", carbs: 0, protein: 20, fat: 13 },
  { food: "Tuna", carbs: 0, protein: 28, fat: 1 },
  { food: "Cod", carbs: 0, protein: 18, fat: 0.7 },
  { food: "Tilapia", carbs: 0, protein: 26, fat: 2.7 },
  { food: "Trout", carbs: 0, protein: 20, fat: 6 },
  { food: "Shrimp", carbs: 0.2, protein: 24, fat: 0.3 },
  { food: "Crab", carbs: 0, protein: 19, fat: 1.5 },
  { food: "Lobster", carbs: 1.3, protein: 19, fat: 0.9 },
  { food: "Scallops", carbs: 5, protein: 21, fat: 0.8 },
  { food: "Oysters", carbs: 5, protein: 9, fat: 2 },
  { food: "Clams", carbs: 5, protein: 26, fat: 2 },
  { food: "Egg (Whole)", carbs: 1.1, protein: 13, fat: 11 },
  { food: "Egg White", carbs: 0.7, protein: 11, fat: 0.2 },
  { food: "Tofu (Firm)", carbs: 1.9, protein: 8, fat: 4.8 },
  { food: "Tempeh", carbs: 9, protein: 19, fat: 11 },
  { food: "Seitan", carbs: 14, protein: 75, fat: 1.9 },

  // --- GRAINS / STARCH ---
  { food: "White Rice (Cooked)", carbs: 28, protein: 2.7, fat: 0.3 },
  { food: "Brown Rice (Cooked)", carbs: 23, protein: 2.6, fat: 0.9 },
  { food: "Basmati Rice", carbs: 25, protein: 3.5, fat: 0.4 },
  { food: "Jasmine Rice", carbs: 28, protein: 2.4, fat: 0.2 },
  { food: "Quinoa (Cooked)", carbs: 21, protein: 4.4, fat: 1.9 },
  { food: "Oatmeal (Cooked)", carbs: 12, protein: 2.4, fat: 1.4 },
  { food: "Rolled Oats (Dry)", carbs: 66, protein: 17, fat: 7 },
  { food: "Pasta (Cooked)", carbs: 25, protein: 5, fat: 0.9 },
  { food: "Spaghetti (Cooked)", carbs: 31, protein: 6, fat: 1 },
  { food: "Noodles (Egg)", carbs: 25, protein: 4.5, fat: 2 },
  { food: "Ramen (Instant)", carbs: 60, protein: 10, fat: 20 },
  { food: "Bread (White)", carbs: 49, protein: 9, fat: 3.2 },
  { food: "Bread (Whole Wheat)", carbs: 41, protein: 13, fat: 3 },
  { food: "Sourdough Bread", carbs: 52, protein: 10, fat: 2 },
  { food: "Bagel", carbs: 48, protein: 10, fat: 1.5 },
  { food: "Croissant", carbs: 46, protein: 8, fat: 21 },
  { food: "Tortilla (Flour)", carbs: 50, protein: 8, fat: 8 },
  { food: "Tortilla (Corn)", carbs: 45, protein: 6, fat: 3 },
  { food: "Pancake", carbs: 28, protein: 6, fat: 10 },
  { food: "Waffle", carbs: 33, protein: 8, fat: 14 },
  { food: "Couscous", carbs: 23, protein: 3.8, fat: 0.2 },
  { food: "Barley", carbs: 28, protein: 2.3, fat: 0.4 },
  { food: "Buckwheat", carbs: 20, protein: 3.4, fat: 0.6 },
  { food: "Granola", carbs: 54, protein: 10, fat: 20 },

  // --- DAIRY / ALTERNATIVES ---
  { food: "Milk (Whole)", carbs: 5, protein: 3.4, fat: 3.3 },
  { food: "Milk (2%)", carbs: 5, protein: 3.4, fat: 2 },
  { food: "Milk (Skim)", carbs: 5, protein: 3.4, fat: 0.2 },
  { food: "Almond Milk", carbs: 0.6, protein: 0.5, fat: 1.1 },
  { food: "Soy Milk", carbs: 6, protein: 3.3, fat: 1.8 },
  { food: "Oat Milk", carbs: 6.5, protein: 1, fat: 1.5 },
  { food: "Coconut Milk", carbs: 6, protein: 2, fat: 24 },
  { food: "Yogurt (Plain)", carbs: 4.7, protein: 3.5, fat: 3.3 },
  { food: "Greek Yogurt", carbs: 3.6, protein: 10, fat: 0.4 },
  { food: "Cheese (Cheddar)", carbs: 1.3, protein: 25, fat: 33 },
  { food: "Cheese (Mozzarella)", carbs: 3, protein: 28, fat: 17 },
  { food: "Cheese (Parmesan)", carbs: 4, protein: 38, fat: 29 },
  { food: "Cottage Cheese", carbs: 3.4, protein: 11, fat: 4.3 },
  { food: "Cream Cheese", carbs: 4, protein: 6, fat: 34 },
  { food: "Sour Cream", carbs: 4.6, protein: 2.4, fat: 19 },
  { food: "Butter", carbs: 0.1, protein: 0.9, fat: 81 },
  { food: "Heavy Cream", carbs: 2.8, protein: 2.1, fat: 37 },
  { food: "Ice Cream (Vanilla)", carbs: 24, protein: 3.5, fat: 11 },

  // --- NUTS / SEEDS ---
  { food: "Almonds", carbs: 22, protein: 21, fat: 49 },
  { food: "Walnuts", carbs: 14, protein: 15, fat: 65 },
  { food: "Peanuts", carbs: 16, protein: 26, fat: 49 },
  { food: "Cashews", carbs: 30, protein: 18, fat: 44 },
  { food: "Pecans", carbs: 14, protein: 9, fat: 72 },
  { food: "Pistachios", carbs: 28, protein: 20, fat: 45 },
  { food: "Macadamia Nuts", carbs: 14, protein: 8, fat: 76 },
  { food: "Hazelnuts", carbs: 17, protein: 15, fat: 61 },
  { food: "Sunflower Seeds", carbs: 20, protein: 21, fat: 51 },
  { food: "Pumpkin Seeds", carbs: 10, protein: 19, fat: 49 },
  { food: "Chia Seeds", carbs: 42, protein: 17, fat: 31 },
  { food: "Flax Seeds", carbs: 29, protein: 18, fat: 42 },
  { food: "Sesame Seeds", carbs: 23, protein: 18, fat: 50 },
  { food: "Peanut Butter", carbs: 20, protein: 25, fat: 50 },
  { food: "Almond Butter", carbs: 19, protein: 21, fat: 50 },

  // --- LEGUMES (COOKED) ---
  { food: "Black Beans", carbs: 23, protein: 9, fat: 0.5 },
  { food: "Kidney Beans", carbs: 23, protein: 9, fat: 0.5 },
  { food: "Lentils", carbs: 20, protein: 9, fat: 0.4 },
  { food: "Chickpeas", carbs: 27, protein: 9, fat: 2.6 },
  { food: "Soybeans (Edamame)", carbs: 10, protein: 11, fat: 5 },
  { food: "Hummus", carbs: 14, protein: 8, fat: 10 },

  // --- SNACKS / SWEETS ---
  { food: "Potato Chips", carbs: 53, protein: 7, fat: 35 },
  { food: "Tortilla Chips", carbs: 63, protein: 7, fat: 21 },
  { food: "Popcorn", carbs: 74, protein: 11, fat: 4 },
  { food: "Pretzels", carbs: 80, protein: 10, fat: 2 },
  { food: "Crackers", carbs: 67, protein: 9, fat: 23 },
  { food: "Donut", carbs: 51, protein: 5, fat: 25 },
  { food: "Muffin (Blueberry)", carbs: 46, protein: 5, fat: 16 },
  { food: "Brownie", carbs: 50, protein: 4, fat: 23 },
  { food: "Chocolate Chip Cookie", carbs: 64, protein: 5, fat: 25 },
  { food: "Cake (Chocolate)", carbs: 55, protein: 4.3, fat: 15 },
  { food: "Cheesecake", carbs: 26, protein: 6, fat: 23 },
  { food: "Dark Chocolate (70%)", carbs: 46, protein: 8, fat: 43 },
  { food: "Milk Chocolate", carbs: 59, protein: 8, fat: 30 },
  { food: "Gummy Bears", carbs: 77, protein: 7, fat: 0 },
  { food: "Hard Candy", carbs: 98, protein: 0, fat: 0 },
  { food: "Marshmallow", carbs: 81, protein: 1.8, fat: 0.2 },
  // Honey moved to Snacks/Sweets? Wait, let's keep it there and remove from Fats/Oils if present? No, Honey was in Snacks.
  // Check if it was in fruits? No.
  { food: "Honey", carbs: 82, protein: 0.3, fat: 0 },
  { food: "Maple Syrup", carbs: 67, protein: 0, fat: 0.1 },
  { food: "Sugar (White)", carbs: 100, protein: 0, fat: 0 },

  // --- FATS / OILS ---
  { food: "Olive Oil", carbs: 0, protein: 0, fat: 100 },
  { food: "Vegetable Oil", carbs: 0, protein: 0, fat: 100 },
  { food: "Coconut Oil", carbs: 0, protein: 0, fat: 100 },
  // Butter moved to Dairy
  { food: "Mayonnaise", carbs: 0.6, protein: 1, fat: 75 },
  { food: "Ketchup", carbs: 27, protein: 1, fat: 0.1 },
  { food: "Mustard", carbs: 5, protein: 4, fat: 3 },
  { food: "BBQ Sauce", carbs: 41, protein: 1, fat: 0.6 },
  { food: "Soy Sauce", carbs: 5, protein: 8, fat: 0.6 },

  // --- BEVERAGES ---
  { food: "Water", carbs: 0, protein: 0, fat: 0 },
  { food: "Coffee (Black)", carbs: 0, protein: 0.1, fat: 0 },
  { food: "Espresso", carbs: 1.7, protein: 0.1, fat: 0.2 },
  { food: "Latte", carbs: 4.4, protein: 2.8, fat: 2.8 },
  { food: "Cappuccino", carbs: 4, protein: 3, fat: 2.5 },
  { food: "Tea (Black/Green)", carbs: 0, protein: 0, fat: 0 },
  { food: "Orange Juice", carbs: 10, protein: 0.7, fat: 0.2 },
  { food: "Apple Juice", carbs: 11, protein: 0.1, fat: 0.1 },
  { food: "Cranberry Juice", carbs: 12, protein: 0, fat: 0 },
  { food: "Soda (Cola)", carbs: 11, protein: 0, fat: 0 },
  { food: "Lemonade", carbs: 10, protein: 0.1, fat: 0 },
  { food: "Energy Drink", carbs: 11, protein: 0, fat: 0 },
  { food: "Beer", carbs: 3.6, protein: 0.5, fat: 0 },
  { food: "Wine (Red)", carbs: 2.6, protein: 0.1, fat: 0 },
  { food: "Wine (White)", carbs: 2.6, protein: 0.1, fat: 0 },
  { food: "Whiskey/Vodka/Gin", carbs: 0, protein: 0, fat: 0, note: "Alcohol calories not listed" },
  { food: "Protein Shake (Whey)", carbs: 3, protein: 20, fat: 1 } // generic
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
