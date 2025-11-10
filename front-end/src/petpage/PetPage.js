import React, { useEffect, useState } from "react";
import axios from "axios";
import PetImage from "./PetImage";
import XPBar from "./XPBar";
import GoalsPanel from "./GoalsPanel";
import StatusPie from "./StatusPie";
import "./PetPage.css";
import Footer from "../components/Footer";

function PetPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const [petData, setPetData] = useState(null);

    useEffect(() => {
    axios
      .get("http://localhost:5000/api/petdata")
      .then((res) => {
        console.log(res);
        const todayData = res.data; 

        setPetData({
          petName: "Charlie",
          level: 4,
          xp: 60,
          nutrition: {
            calories: todayData["Total Intake"],
            protein: todayData.Protein,
            carbs: todayData.Carbs,
            fat: todayData.Fat,
          },
          goals: {
            calories: todayData["Total Intake Goal"],
            protein: todayData["Protein Goal"],
            carbs: todayData["Carbs Goal"],
            fat: todayData["Fat Goal"],
          },
        });
      })
      .catch((err) => console.error("Error fetching mock data:", err));
  }, []);

  if (!petData) {
    return <p style={{ textAlign: "center" }}>Loading pet data...</p>;
  }

  const { petName, level, xp, nutrition, goals } = petData;

  return (
    <div className="pet-page">
      <h1>Pet Page</h1>
      <p id="date-top-right">{today}</p>

      <PetImage petName={petName} />
      <XPBar xp={xp} level={level} />

      <div className="mid-section">
        <div className="goals-panel">
        <GoalsPanel nutrition={nutrition} goals={goals} />
        </div>
        <div className="status-panel">
        <StatusPie nutrition={nutrition} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PetPage;
