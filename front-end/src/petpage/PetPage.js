// src/petpage/PetPage.js

import React, { useState, useEffect } from "react";
import XPBar from "./XPBar";
import StatusPie from "./StatusPie";
import PetImage from "./PetImage";
import GoalsPanel from "./GoalsPanel";

const PetPage = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 如果你之后要做 “吃东西加经验”，可以把当前这一步抽出来复用
  const fetchPet = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/pet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to load pet. Status ${res.status}. ${text || ""}`
        );
      }

      const data = await res.json();
      setPet(data);
    } catch (err) {
      console.error("Fetch pet failed:", err);
      setErrorMsg(err.message || "Failed to load pet.");
    } finally {
      setLoading(false);
    }
  };

  // 页面挂载时，拿 token 并加载宠物
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found in localStorage");
      setErrorMsg("Please log in to see your pet.");
      setLoading(false);
      return;
    }

    fetchPet(token);
  }, []);

  if (loading) {
    return <div className="pet-page">Loading pet...</div>;
  }

  if (errorMsg) {
    return <div className="pet-page">Error: {errorMsg}</div>;
  }

  if (!pet) {
    return <div className="pet-page">No pet data.</div>;
  }

  // 这里先用一些假数据给 StatusPie / GoalsPanel 占位
  // 之后你可以改成从其他接口拿当天营养和目标
  const dummyNutrition = {
    protein: 30,
    carbs: 40,
    fat: 30,
  };

  const dummyGoals = {
    protein: 80,
    carbs: 250,
    fat: 60,
  };

  return (
    <div className="pet-page">
      <h2>{pet.name}</h2>

      <PetImage stage={pet.stage} />

      <XPBar xp={pet.xp} level={pet.level} />

      <div className="mid-section">
        <StatusPie nutrition={dummyNutrition} />
        <GoalsPanel nutrition={dummyNutrition} goals={dummyGoals} />
      </div>

      <p>Level: {pet.level}</p>
      <p>Stage: {pet.stage}</p>
      <p>XP: {pet.xp}</p>
    </div>
  );
};

export default PetPage;
