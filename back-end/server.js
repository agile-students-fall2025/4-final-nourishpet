import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import { applyDailyNutritionXP } from "./db/petDB.js";
import AuthUser from "./schemas/AuthUser.js";
import NutritionUser from "./schemas/User.js";
import {
  creatUser,
  getAllUsers,
  findUserById,
  updateUserById,
} from "./db/userDB.js";
import * as ArchiveDB from "./db/archiveDB.js"
import * as FoodDB from "./db/foodDB.js"
import { showPetInfo, updatePetByUserId, createPet} from "./db/petDB.js"
import Pet from "./schemas/Pet.js"

dotenv.config();

// ---------- PATH SETUP ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- APP ----------
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected");
        // --- 🔍 DEBUGGING: PRINT DB INFO ---
    console.log("---------------------------------------");
    console.log("📂 Current Database Name:", mongoose.connection.name);
    console.log("------------------------------------------------");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// ==========================================================
// 🔐 AUTH MIDDLEWARE — requires JWT for protected routes
// ==========================================================
import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      success: false,
      message: "No token provided.",
    });
  }

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user info from token
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

// ==========================================================
// 🔐 AUTH ROUTES
// ==========================================================

// --------------------- SIGNUP -------------------------
app.post("/auth/signup", async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "username, password, and name required.",
      });
    }

    const exists = await AuthUser.findOne({ username });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    const auth = await new AuthUser({
      username,
      password,
    }).save();

    console.log("AuthUser created:", auth._id);

    try {
      const nutritionUser = await creatUser({
        _id: auth._id,
        name: name
      });
      console.log("User created:", nutritionUser._id);
      
      // Create pet for the new user
      try {
        await createPet(auth._id);
      } catch (petErr) {
        console.error("Failed to create Pet:", petErr);
        // Don't fail signup if pet creation fails, but log it
      }
    } catch (userErr) {
      console.error("Failed to create User:", userErr);
      await AuthUser.findByIdAndDelete(auth._id);
      throw new Error(`Failed to create user profile: ${userErr.message}`);
    }

    const token = auth.generateJWT();

    res.json({
      success: true,
      token,
      username: auth.username,
      id: auth._id,
    });
  } catch (err) {
    console.error("Signup error:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Signup failed.",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
});

// --------------------- LOGIN -------------------------
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password required.",
      });
    }

    const user = await AuthUser.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.validPassword(password)) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = user.generateJWT();

    res.json({
      success: true,
      token,
      username: user.username,
      id: user._id,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed." });
  }
});

// --------------------- LOGOUT -------------------------
app.get("/auth/logout", (req, res) => {
  res.json({
    success: true,
    message: "Delete your token on the client to logout.",
  });
});

// ==========================================================
// 🔐 PROTECTED NUTRITION API ROUTES
// ==========================================================

const readJson = (fileName) => {
  const rawData = readFileSync(
    path.join(__dirname, "temp_data", fileName),
    "utf-8"
  );
  return JSON.parse(rawData);
};

// HOME PAGE
app.get("/api/home/nutrition", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const histData = await ArchiveDB.getWeeklyLogs(userId);
    const dateObj = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const todayString = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    const todayData = histData.find((entry) => entry.date === todayString);

    if (!todayData) {
      return res.json({
        date: todayString,
        total_intake: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      })
    }

    res.json(todayData);
  } catch (error) {
    console.error("Error fetching home page nutrition data:", error.message);
    res.status(500).json({ error: "Failed to fetch home page data" });
  }
});

// HISTORY
app.get("/api/histdata", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const histData = await ArchiveDB.getWeeklyLogs(userId);
    res.json(histData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// FOOD TABLE - Get all foods from MongoDB
app.get("/api/fooddata", authMiddleware, async (req, res) => {
  try {
    const foods = await FoodDB.getAllFoods();
    res.json(foods);
  } catch (error) {
    console.error("Error fetching food data:", error.message);
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});

// FOOD SEARCH - Search foods by name
app.get("/api/foods/search", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const foods = await FoodDB.searchFoods(q);
    res.json(foods);
  } catch (error) {
    console.error("Error searching foods:", error.message);
    res.status(500).json({ error: "Failed to search foods" });
  }
});

app.post("/api/addfooditem", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const token = req.headers.authorization;
    const { foodName, grams, protein, fat, carbs } = req.body;

    // 1. Insert food item
    const foodItem = {
      name: foodName,
      grams: Number(grams),
      p: Number(protein),
      f: Number(fat),
      c: Number(carbs)
    };

    const updatedLog = await ArchiveDB.addFoodEntry(userId, foodItem);

    // 2. Fetch today's nutrition (same logic as frontend)
    const today = await fetch("http://localhost:5000/api/home/nutrition", {
      headers: { Authorization: token }
    }).then(res => res.json());

    // 3. Fetch user goals (same logic as frontend)
    const goals = await fetch("http://localhost:5000/api/userdata", {
      headers: { Authorization: token }
    }).then(res => res.json());

    // 4. Use DB service to calculate XP + upgrade pet
    const { updatedPet, gainedXp } = await applyDailyNutritionXP(
      userId,
      {
        total_intake: today.total_intake,
        protein: today.protein,
        carbs: today.carbs,
        fat: today.fat
      },
      {
        total_intake_goal: goals.total_intake_goal,
        protein_goal: goals.protein_goal,
        carbs_goal: goals.carbs_goal,
        fat_goal: goals.fat_goal
      }
    );

    // 5. Respond with full update
    res.json({
      message: "Food item added",
      updatedLog,
      todayNutrition: today,
      userGoals: goals,
      updatedPet,
      gainedXp
    });

  } catch (error) {
    console.error("Food add error:", error);
    res.status(500).json({ error: "Failed to add food item" });
  }
});

// USER DATA
app.get("/api/userdata", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await findUserById(userId);
    const petData = await showPetInfo(userId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convert Mongoose document to plain object
    const userDataObj = userData.toObject ? userData.toObject() : userData;
    const userDataWithPet = { ...userDataObj, petName: petData?.name || "" };

    res.json(userDataWithPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE USER DATA
app.post("/api/updateuserdata", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    // Separate petName from userData
    const { petName, ...userData } = data;

    // Update user data
    const updated = await updateUserById(userId, userData);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update pet name if provided
    if (petName !== undefined) {
      await updatePetByUserId(userId, { name: petName });
    }

    res.json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error in update user data route:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Pet API 

function mapPetToResponse(pet) {
  const status = pet.status || "stage1";
  const stage =
    status === "stage1" ? 1 :
    status === "stage2" ? 2 :
    3; // 默认 3

  return {
    id: pet._id.toString(),
    name: pet.name,
    user_id: pet.user_id.toString(),
    xp: pet.xp,
    level: pet.level,
    stage,      
    status,      
  };
}

// GET /api/pet 
app.get("/api/pet", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    let pet = await Pet.findOne({ user_id: userId });

    if (!pet) {
      const seedPath = path.join(__dirname, "temp_data", "pet_seed.json");
      const seedArray = JSON.parse(readFileSync(seedPath, "utf-8"));
      const seed = seedArray[0] || {
        name: "My Pet",
        xp: 0,
        level: 1,
        status: "stage1",
      };

      pet = await Pet.create({
        user_id: userId,
        name: seed.name,
        xp: seed.xp,
        level: seed.level,
        status: seed.status,
      });
    }

    res.json(mapPetToResponse(pet));
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ error: "Failed to load pet" });
  }
});

// ==========================================================
// SERVER START
// ==========================================================
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;

  connectDB().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, () => {
        console.log(`Received ${signal}, shutting down server...`);
        server.close(() => process.exit(0));
      });
    });
  }).catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

export default app;
