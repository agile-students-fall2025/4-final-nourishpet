import React, { useEffect, useState } from "react";
import PetImage from "./PetImage";
import XPBar from "./XPBar";
import GoalsPanel from "./GoalsPanel";
import StatusPie from "./StatusPie";
import "./PetPage.css";

function PetPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Fake "database fetch"
  const [petData, setPetData] = useState(null);

  useEffect(() => {
    // Simulate async DB fetch
    setTimeout(() => {
      setPetData({
        petName: "Charlie",
        level: 4,
        xp: 60,
        nutrition: { calories: 1240, protein: 62, carbs: 140, fat: 38 },
        goals: { calories: 2000, protein: 120, carbs: 250, fat: 70 }
      });
    }, 600); // pretend we fetched from DB
  }, []);

  if (!petData) {
    return <p style={{ textAlign: "center" }}>Loading pet data...</p>;
  }

  const { petName, level, xp, nutrition, goals } = petData;

  return (
    <div className="pet-page">
      <h3>Pet Page</h3>
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
    </div>
  );
}

export default PetPage;
