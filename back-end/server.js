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

app.get("/api/petdata", async (req, res) => {
  try {
    const rawData = readFileSync(path.join(__dirname, "temp_data", "todayData.json"), "utf-8");
    const petData = JSON.parse(rawData); // convert to JS object
    res.json(petData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/histdata", async (req, res) => {
  try {
    //const idToFind = parseInt(req.params.id);
    const rawData = readFileSync(path.join(__dirname, "temp_data", "histData.json"), "utf-8");
    const histData = JSON.parse(rawData);
    //const recordToFind = histData.find(r => r.id === idToFind)
    res.json(histData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/fooddata", async (req, res) => {
  try {
    //const idToFind = parseInt(req.params.id);
    const rawData = readFileSync(path.join(__dirname, "temp_data", "foodData.json"), "utf-8");
    const foodData = JSON.parse(rawData);
    //const recordToFind = histData.find(r => r.id === idToFind)
    res.json(foodData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/userdata", async (req, res) => {
  const userData = readFileSync("./temp_data/userData.json", "utf8");
  res.json(JSON.parse(userData));
});

app.post("/api/updateuserdata", async (req, res) => {
  const userData = req.body;
  writeFileSync("./temp_data/userData.json", JSON.stringify(userData, null, 2));
  res.json({ message: "User data updated successfully" });
});

function archiveTodayData() {
  const todayPath = path.join(__dirname, "temp_data", "todayData.json");
  const savePath = path.join(__dirname, "temp_data", "save.json");

  try {
    const todayData = JSON.parse(readFileSync(todayPath, "utf8"));

    writeFileSync(
      savePath,
      JSON.stringify(
        {
          date: new Date().toISOString().split("T")[0],
          ...todayData
        },
        null,
        2
      )
    );

    const reset = {
      "Total Intake": 0,
      "Protein": 0,
      "Carbs": 0,
      "Fat": 0,
      "Total Intake Goal": 2000,
      "Protein Goal": 120,
      "Carbs Goal": 250,
      "Fat Goal": 70
    };

    writeFileSync(todayPath, JSON.stringify(reset, null, 2));
  } catch {}
}

setInterval(() => {
  const now = new Date();
  if (now.getHours() === 23 && now.getMinutes() === 59) archiveTodayData();
}, 60000);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));