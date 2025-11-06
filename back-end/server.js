import express from "express";
import axios from "axios";
import cors from "cors";
import { readFileSync, writeFileSync } from "fs";

const app = express();
app.use(cors()); // allow React frontend to access backend
app.use(express.json());

app.get("/api/petdata", async (req, res) => {
  try {
    const rawData = readFileSync("./temp_data/todayData.json", "utf-8");
    const petData = JSON.parse(rawData); // convert to JS object
    res.json(petData);
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));