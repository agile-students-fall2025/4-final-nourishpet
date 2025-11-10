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
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  axios.get("http://localhost:5000/api/userdata")
    .then((res) => {
      setUserData(res.data);
    })
    .catch((err) => console.error("Error fetching user data:", err));
}, []);

    useEffect(() => {
  if (!userData) return; // wait until userData is loaded

  axios
    .get("http://localhost:5000/api/home/nutrition?id=1")
    .then((res) => {
      const todayData = res.data;
      setPetData({
        petName: userData.petName, 
        level: 4,
        xp: 60,
        nutrition: {
          calories: todayData.calories,
          protein: todayData.protein,
          carbs: todayData.carbs,
          fat: todayData.fat,
        },
        goals: {
          calories: todayData.caloriesGoal,
          protein: todayData.proteinGoal,
          carbs: todayData.carbsGoal,
          fat: todayData.fatGoal,
        },
      });
    })
    .catch((err) => console.error("Error fetching mock data:", err));
}, [userData]); // reruns only when userData changes

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
