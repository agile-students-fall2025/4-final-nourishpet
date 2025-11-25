import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import jwt from "jsonwebtoken";

import {
  creatUser,
  getAllUsers,
  findUserById,
  updateUserById,
} from "./db/userDB.js";
import Pet from "./schemas/Pet.js";
import { upgrade } from "./db/petDB.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected");
        // --- 🔍 DEBUGGING: PRINT DB INFO ---
    console.log("---------------------------------------");
    console.log("📂 Current Database Name:", mongoose.connection.name);
    console.log("------------------------------------------------");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // 让启动逻辑决定是否退出
  }
};

// ---------- JWT: 从请求头里拿 userId ----------
function getUserIdFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 登录时应该签的是 { userId: user._id }
    return decoded.userId;
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return null;
  }
}

// ---------- 工具：读取本地 JSON ----------
const readJson = (fileName) => {
  const rawData = readFileSync(
    path.join(__dirname, "temp_data", fileName),
    "utf-8"
  );
  return JSON.parse(rawData);
};

// ============== 现有 API ==============

// 首页营养数据
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

    res.json({
      date: todayData["Date"],
      calories: todayData["Total Intake"],
      caloriesGoal: todayData["Total Intake Goal"],
      protein: todayData["Protein"],
      proteinGoal: todayData["Protein Goal"],
      carbs: todayData["Carbs"],
      carbsGoal: todayData["Carbs Goal"],
      fat: todayData["Fat"],
      fatGoal: todayData["Fat Goal"],
    });
  } catch (error) {
    console.error("Error fetching home page nutrition data:", error.message);
    res.status(500).json({ error: "Failed to fetch home page data" });
  }
});

// 历史数据
app.get("/api/histdata", async (req, res) => {
  try {
    const histData = readJson("histData.json");
    res.json(histData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 食物列表
app.get("/api/fooddata", async (req, res) => {
  try {
    const rawData = readFileSync(
      path.join(__dirname, "temp_data", "foodData.json"),
      "utf-8"
    );
    const foodData = JSON.parse(rawData);
    res.json(foodData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 添加一条食物记录
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
        id: 1,
        Date: todayDateStr,
        Total Intake: newTotalIntake,
        Protein: protein,
        Carbs: carbs,
        Fat: fat,
        ...defaultGoals,
        "Food List": [foodName],
        "Gram List": [grams],
        "Protein List": [protein],
        "Fat List": [fat],
        "Carbs List": [carbs],
      };

      histData.unshift(todayLog);
    }

    // Write the updated array back to the file
    writeFileSync(histDataPath, JSON.stringify(histData, null, 2));

    res
      .status(200)
      .json({ message: "Food item added successfully", updatedLog: todayLog });
  } catch (error) {
    console.error("Error adding food item:", error.message);
    res.status(500).json({ error: "Failed to add food item" });
  }
});

// ============== User API（用 token 解 userId） ==============

app.get("/api/userdata", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

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
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const userData = req.body;
    const response = await updateUserById(userId, userData);

    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============== Pet API ==============

// GET /api/pet —— 根据 token 拿到 userId，返回 / 创建宠物
app.get("/api/pet", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    // 先尝试从 DB 找
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

// POST /api/pet/xp —— 增加 XP，并按规则自动升级 & 更新 stage(status)
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

// ============== Server 启动与错误处理 ==============

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      // 正常退出信号处理
      ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, () => {
          console.log(`Received ${signal}, shutting down server...`);
          server.close(() => process.exit(0));
        });
      });

      // HTTP server 错误
      server.on("error", (err) => {
        console.error("HTTP server error:", err);
      });

      process.on("exit", (code) => {
        console.log(`Server process exiting with code ${code}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}

// 全局错误兜底
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

export default app;
