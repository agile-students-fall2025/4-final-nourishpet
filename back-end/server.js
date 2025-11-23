import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

import AuthUser from "./schemas/AuthUser.js";
import NutritionUser from "./schemas/User.js";
import {
  creatUser,
  getAllUsers,
  findUserById,
  updateUserById,
} from "./db/userDB.js";

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
    const histData = readJson("histData.json");
    const recordId = Number(req.query.id) || 1;
    const todayData = histData.find((entry) => entry.id === recordId);

    if (!todayData) {
      return res
        .status(404)
        .json({ error: `No nutrition record found for id ${recordId}` });
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
    const histData = readJson("histData.json");
    res.json(histData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// FOOD TABLE
app.get("/api/fooddata", authMiddleware, async (req, res) => {
  try {
    const rawData = readFileSync(
      path.join(__dirname, "temp_data", "foodData.json"),
      "utf-8"
    );
    res.json(JSON.parse(rawData));
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ADD FOOD ENTRY
app.post("/api/addfooditem", authMiddleware, async (req, res) => {
  try {
    const { foodName, grams, protein, fat, carbs } = req.body;

    const histDataPath = path.join(__dirname, "temp_data", "histData.json");
    let histData = JSON.parse(readFileSync(histDataPath, "utf-8"));

    const todayDateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    let index = histData.findIndex((log) => log.Date === todayDateStr);
    let todayLog;
    const newTotalIntake = protein + carbs + fat;

    if (index !== -1) {
      todayLog = histData[index];
      todayLog["Food List"].push(foodName);
      todayLog["Gram List"].push(grams);
      todayLog["Protein List"].push(protein);
      todayLog["Fat List"].push(fat);
      todayLog["Carbs List"].push(carbs);

      todayLog["Total Intake"] += newTotalIntake;
      todayLog["Protein"] += protein;
      todayLog["Carbs"] += carbs;
      todayLog["Fat"] += fat;

      histData[index] = todayLog;
    } else {
      histData.forEach((log) => (log.id += 1));

      todayLog = {
        id: 1,
        Date: todayDateStr,
        "Total Intake": newTotalIntake,
        Protein: protein,
        Carbs: carbs,
        Fat: fat,
        "Total Intake Goal": 2000,
        "Protein Goal": 900,
        "Carbs Goal": 900,
        "Fat Goal": 900,
        "Food List": [foodName],
        "Gram List": [grams],
        "Protein List": [protein],
        "Fat List": [fat],
        "Carbs List": [carbs],
      };

      histData.unshift(todayLog);
    }

    writeFileSync(histDataPath, JSON.stringify(histData, null, 2));

    res
      .status(200)
      .json({ message: "Food item added successfully", updatedLog: todayLog });
  } catch (error) {
    console.error("Error adding food item:", error.message);
    res.status(500).json({ error: "Failed to add food item" });
  }
});

// USER DATA
app.get("/api/userdata", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await await findUserById(userId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE USER DATA
app.post("/api/updateuserdata", authMiddleware, async (req, res) => {
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
