import express from "express";
import cors from "cors";
import { readFileSync, writeFileSync } from "fs";
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
app.use(morgan("dev"));
app.use(cors()); 
app.use(express.json());

const readJson = (fileName) => {
  const rawData = readFileSync(path.join(__dirname, "temp_data", fileName), "utf-8");
  return JSON.parse(rawData);
};

app.get("/api/petdata", async (req, res) => {
  try {
    const petData = readJson("todayData.json"); // convert to JS object
    res.json(petData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/home/nutrition", async (req, res) => {
  try {
    const histData = readJson("histData.json");
    const recordId = Number(req.query.id) || 1;
    const todayData = histData.find((entry) => entry.id === recordId);

    if (!todayData) {
      return res.status(404).json({ error: `No nutrition record found for id ${recordId}` });
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

app.get("/api/histdata", async (req, res) => {
  try {
    //const idToFind = parseInt(req.params.id);
    const histData = readJson("histData.json");
    //const recordToFind = histData.find(r => r.id === idToFind)
    res.json(histData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/userdata", async (req, res) => {
  const userData = readJson("userData.json");
  res.json(userData);
});

app.post("/api/updateuserdata", async (req, res) => {
  const userData = req.body;
  writeFileSync(path.join(__dirname, "temp_data", "userData.json"), JSON.stringify(userData, null, 2));
  res.json({ message: "User data updated successfully" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on("error", (err) => {
  console.error("HTTP server error:", err);
});

process.on("exit", (code) => {
  console.log(`Server process exiting with code ${code}`);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down server...`);
    server.close(() => process.exit(0));
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
