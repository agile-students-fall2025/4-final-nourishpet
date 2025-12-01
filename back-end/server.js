import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import jwt from "jsonwebtoken";

import AuthUser from "./schemas/AuthUser.js";
import Pet from "./schemas/Pet.js";
import NutritionUser from "./schemas/User.js"; // if you actually use it
import { upgrade } from "./db/petDB.js";
import * as ArchiveDB from "./db/archiveDB.js";
import {
  creatUser,
  getAllUsers,
  findUserById,
  updateUserById,
} from "./db/userDB.js";
import { getFoods } from "./db/foodDB.js";


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
    throw error; 
  }
};


// ================= JWT UTILS =================
function getUserIdFromRequest(req) {
const authHeader = req.headers.authorization || "";
const token = authHeader.startsWith("Bearer ")
? authHeader.substring(7)
: authHeader;


if (!token) return null;


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // it should be { userId: user._id }
    return decoded.userId;
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return null;
  }
}

// ==========================================================
// 🔐 AUTH MIDDLEWARE — requires JWT for protected routes
// ==========================================================
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
    req.user = decoded; // user info from token (e.g. { userId: ... })
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
        name: name,
      });
      console.log("User created:", nutritionUser._id);
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
      error:
        process.env.NODE_ENV === "development" ? err.stack : undefined,
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

// ---------- get JSON ----------
const readJson = (fileName) => {
  const rawData = readFileSync(
    path.join(__dirname, "temp_data", fileName),
    "utf-8"
  );
  return JSON.parse(rawData);
};

// ============== API ==============
// nurtition
app.get("/api/home/nutrition", async (req, res) => {
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

// food list
app.get("/api/fooddata", async (req, res) => {
  try {
    const searchQuery = req.query.search || null;
    const limit = parseInt(req.query.limit) || 100;
    
    const foods = await getFoods(searchQuery, limit);
    res.json(foods);
  } catch (error) {
    console.error("Error fetching food data:", error.message);
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});

// add record
app.post("/api/addfooditem", async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodName, grams, protein, fat, carbs } = req.body;
    const histDataPath = path.join(__dirname, "temp_data", "histData.json");

    // entry validation
    if (
      !foodName ||
      !grams ||
      protein === undefined ||
      fat === undefined ||
      carbs === undefined
    ) {
      return res.status(400).json({ error: "Missing food data fields." });
    }

    const todayDateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const rawData = readFileSync(histDataPath, "utf-8");
    let histData = JSON.parse(rawData);

    let todayLogIndex = histData.findIndex(
      (log) => log.Date === todayDateStr
    );
    let todayLog;
    const newTotalIntake = protein + carbs + fat;

    if (todayLogIndex !== -1) {
      todayLog = histData[todayLogIndex];
      // append to temp data
      todayLog["Food List"].push(foodName);
      todayLog["Gram List"].push(grams);
      todayLog["Protein List"].push(protein);
      todayLog["Fat List"].push(fat);
      todayLog["Carbs List"].push(carbs);

      // Update totals to temp data
      todayLog["Total Intake"] += protein + carbs + fat;
      todayLog["Protein"] += protein;
      todayLog["Carbs"] += carbs;
      todayLog["Fat"] += fat;

      // update temp data to histData
      histData[todayLogIndex] = todayLog;
    } else {
      console.log(`No log found for ${todayDateStr}. Creating new entry.`);

      histData.forEach((log) => {
        log.id += 1;
      });

      let defaultGoals = {
        "Total Intake Goal": 2000,
        "Protein Goal": 900,
        "Carbs Goal": 900,
        "Fat Goal": 900,
      };

      if (histData.length > 0) {
        defaultGoals["Total Intake Goal"] = histData[0]["Total Intake Goal"];
        defaultGoals["Protein Goal"] = histData[0]["Protein Goal"];
        defaultGoals["Carbs Goal"] = histData[0]["Carbs Goal"];
        defaultGoals["Fat Goal"] = histData[0]["Fat Goal"];
      }

      todayLog = {
        'id': 1,
        'Date': todayDateStr,
        'Total Intake': newTotalIntake,
        'Protein': protein,
        'Carbs': carbs,
        'Fat': fat,
        ...defaultGoals,
        "Food List": [foodName],
        "Gram List": [grams],
        "Protein List": [protein],
        "Fat List": [fat],
        "Carbs List": [carbs],
      };

      histData.unshift(todayLog);
    }

    const foodItem = {
      name: foodName,
      grams: Number(grams),
      p: Number(protein),
      f: Number(fat),
      c: Number(carbs)
    };
    
    const updatedLog = await ArchiveDB.addFoodEntry(userId, foodItem);

    res
      .status(200)
      .json({ message: "Food item added successfully", updatedLog});
  } catch (error) {
    console.error("Error adding food item:", error.message);
    res.status(500).json({ error: "Failed to add food item" });
  }
});

// ============== User API（use token to get userId） ==============

app.get("/api/userdata", async (req, res) => {
  try {
    const userId = req.headers.authorization;
    const userData = await findUserById(userId); 

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/updateuserdata", async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = req.body;

    const updated = await updateUserById(userId, userData);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error in update user data route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============== Pet API ==============

// GET /api/pet —— back to pet
app.get("/api/pet", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    // get from DB 
    let pet = await Pet.findOne({ user_id: userId });

    // 如果没有宠物，就从 pet_seed.json 初始化一只
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

    res.json({
      id: pet._id.toString(),
      name: pet.name,
      user_id: pet.user_id.toString(),
      xp: pet.xp,
      level: pet.level,
      status: pet.status,
    });
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ error: "Failed to load pet" });
  }
});

// POST /api/pet/xp 
app.post("/api/pet/xp", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const { gainedXp } = req.body;

    if (typeof gainedXp !== "number") {
      return res.status(400).json({ error: "gainedXp must be a number" });
    }

    const updatedPet = await upgrade(userId, gainedXp);

    res.json(updatedPet);
  } catch (error) {
    console.error("Error upgrading pet:", error);
    res.status(500).json({ error: "Failed to update pet XP" });
  }
});

// ============== Server ==============

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, () => {
          console.log(`Received ${signal}, shutting down server...`);
          server.close(() => process.exit(0));
        });
      });

      // HTTP server error
      server.on("error", (err) => {
        console.error("HTTP server error:", err);
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
