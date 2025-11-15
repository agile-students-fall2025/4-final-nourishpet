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

app.post("/api/addfooditem", async (req, res) => {
  try {
    const { foodName, grams, protein, fat, carbs} = req.body;
    const histDataPath = path.join(__dirname, "temp_data", "histData.json");

    //entry validation
    if (!foodName || !grams || protein === undefined || fat === undefined || carbs === undefined) {
      return res.status(400).json({ error: "Missing food data fields." });
    }

    const todayDateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const rawData = readFileSync(histDataPath, "utf-8");
    let histData = JSON.parse(rawData); 

    let todayLogIndex = histData.findIndex(log => log.Date === todayDateStr);
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
    todayLog["Total Intake"] += protein+carbs+fat;
    todayLog["Protein"] += protein;
    todayLog["Carbs"] += carbs;
    todayLog["Fat"] += fat;
    
    // update temp data to histDta
    histData[todayLogIndex] = todayLog;

    // 9. Write the updated array back to the file
    writeFileSync(histDataPath, JSON.stringify(histData, null, 2));

    // 10. Send the *full updated log* back to the front-end
    res.status(200).json({ message: "Food item added successfully", updatedLog: todayLog });

  } else {
    console.log(`No log found for ${todayDateStr}. Creating new entry.`);

      histData.forEach(log => { log.id += 1; });

      let defaultGoals = {
        "Total Intake Goal": 2000, 
        "Protein Goal": 900,
        "Carbs Goal": 900,
        "Fat Goal": 900
      };

      if (histData.length > 0) {
        // Use goals from the most recent entry (which is now at index 0 and has id 2)
        defaultGoals["Total Intake Goal"] = histData[0]["Total Intake Goal"];
        defaultGoals["Protein Goal"] = histData[0]["Protein Goal"];
        defaultGoals["Carbs Goal"] = histData[0]["Carbs Goal"];
        defaultGoals["Fat Goal"] = histData[0]["Fat Goal"];
      }

      // Create the new log object, pre-filled with the new food item
      todayLog = {
        "id": 1,
        "Date": todayDateStr,
        "Total Intake": newTotalIntake,
        "Protein": protein,
        "Carbs": carbs,
        "Fat": fat,
        ...defaultGoals,
        "Food List": [foodName],
        "Gram List": [grams],
        "Protein List": [protein],
        "Fat List": [fat],
        "Carbs List": [carbs]
      };

      // Add the new log to the *beginning* of the array
      histData.unshift(todayLog);
    }

    // Write the updated array back to the file
    writeFileSync(histDataPath, JSON.stringify(histData, null, 2));

    // Send the updated log back to the front-end
    res.status(200).json({ message: "Food item added successfully", updatedLog: todayLog });
  }
  catch (error) {
      console.error("Error adding food item:", error.message);
      res.status(500).json({ error: "Failed to add food item" });
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

if (process.env.NODE_ENV !== 'test') {

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  process.on('SIGTERM', () => server.close());

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
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

export default app;