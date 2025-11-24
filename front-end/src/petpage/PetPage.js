import React, { useEffect, useState } from "react";
import axios from "axios";
import PetImage from "./PetImage";
import XPBar from "./XPBar";
import GoalsPanel from "./GoalsPanel";
import StatusPie from "./StatusPie";
import "./PetPage.css";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";

function PetPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const [petData, setPetData] = useState(null);
  const [userData, setUserData] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ 没 token 直接踢回登录
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ---------- 获取用户数据 ----------
  useEffect(() => {
    axios.get("http://localhost:5000/api/userdata", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setUserData(res.data);
    })
    .catch((err) => console.error("Error fetching user data:", err));
  }, [token]);

  // ---------- 获取宠物 & 营养数据 ----------
  useEffect(() => {
    if (!userData) return;

    axios
      .get("http://localhost:5000/api/home/nutrition?id=1", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const todayData = res.data;

        setPetData({
          petName: userData.petName || "My Pet",
          level: userData.level || 1,
          xp: userData.xp || 0,
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
      .catch((err) => console.error("Error fetching pet data:", err));
  }, [userData, token]);

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
        <GoalsPanel nutrition={nutrition} goals={goals} />
        <StatusPie nutrition={nutrition} />
      </div>

      <Footer />
    </div>
  );
}

export default PetPage;
