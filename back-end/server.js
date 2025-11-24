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

connectDB();
function getUserIdFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}


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
    const histData = await ArchiveDB.getHistory(userId);
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
