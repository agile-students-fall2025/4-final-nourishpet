import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import '../css/HomePage.css';
import { API } from "../api";

import stage1Img from "../petpage/pet_stage1.png";
import stage2Img from "../petpage/pet_stage2.png";
import stage3Img from "../petpage/pet_stage3.png";

const stageImages = {
  1: stage1Img,
  2: stage2Img,
  3: stage3Img,
};

const fmt = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v.toFixed(1) : "0.0";
};

function HomePage() {
  const [nutritionData, setNutritionData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [petData, setPetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();

    Promise.all([
      axios.get(`${API}/api/home/nutrition`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${API}/api/userdata`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${API}/api/pet`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
      .then(([nutritionResponse, userResponse, petResponse]) => {
        setNutritionData(nutritionResponse.data);
        setPetData(petResponse.data);

        const foundUserData = userResponse.data;
        if (foundUserData) {
          setUserData({
            pet_name: foundUserData.pet_name || "Your Pet",
            total_intake_goal: foundUserData.total_intake_goal || 2000,
            protein_goal: foundUserData.protein_goal || 150,
            carbs_goal: foundUserData.carbs_goal || 250,
            fat_goal: foundUserData.fat_goal || 70
          });
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, []);

  return (
    <div className="homepage">
      {/* Header with User button */}
      <header className="homepage-header">
        <Link to="/userpage" className="user-button">
          User
        </Link>
      </header>

      {/* Main content */}
      <main className="homepage-main">
        {/* App title section */}
        <section className="app-intro">
          <div className="intro-box">
            <h1 className="app-title">NourishPet</h1>
            <p className="app-tagline">Nutrition meets companionship</p>
          </div>
        </section>

        {/* Pet image - clickable to go to pet page */}
        <section className="pet-section">
          <Link to="/petpage" className="pet-image-link">
            <div className="pet-image-circle">
              <p className="pet-name">{userData ? userData.pet_name : "Loading..."}</p>
              <img
                src={petData ? (stageImages[petData.stage] || stage1Img) : stage1Img}
                alt="Pet"
                className="pet-photo-circle"
              />
              <p className="pet-hint">(go to pet page)</p>
            </div>
          </Link>
        </section>

        {/* Nutrition chart section */}
        <section className="nutrition-section" aria-live="polite">
          <div className="nutrition-chart">
            <h3>Simple nutrition chart</h3>
            {nutritionData?.date && !error && (
              <p className="nutrition-date">Date: {nutritionData.date}</p>
            )}
            {isLoading && <p>Loading...</p>}
            {error && !isLoading && <p className="error-text">{error}</p>}
            {!isLoading && !error && nutritionData && userData ? (
              <>
                <div className="nutrition-stats">
                  <div className="nutrition-item">
                    <span className="nutrition-label">Calories:</span>
                    <span className="nutrition-value">
                      {fmt(nutritionData.total_intake)} / {fmt(userData.total_intake_goal)}
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Protein:</span>
                    <span className="nutrition-value">
                      {fmt(nutritionData.protein)}g / {fmt(userData.protein_goal)}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Carbs:</span>
                    <span className="nutrition-value">
                      {fmt(nutritionData.carbs)}g / {fmt(userData.carbs_goal)}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fat:</span>
                    <span className="nutrition-value">
                      {fmt(nutritionData.fat)}g / {fmt(userData.fat_goal)}g
                    </span>
                  </div>
                </div>
              </>
            ) : (
              !isLoading &&
              !error && <p>Simple nutrition chart</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
