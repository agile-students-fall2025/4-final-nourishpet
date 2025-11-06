import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors()); // allow React frontend to access backend

const MOCKAROO_URL_PetPage = "https://api.mockaroo.com/api/0571eeb0?count=1&key=ee5ed170";

app.get("/api/petdata", async (req, res) => {
  try {
    const response = await axios.get(MOCKAROO_URL_PetPage);
    res.json(response.data[0]);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));