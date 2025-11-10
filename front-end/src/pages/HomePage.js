import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import '../css/HomePage.css';

function HomePage() {
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const petName = "Charlie";
  const recordId = 1;

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get("/api/home/nutrition", {
          params: { id: recordId },
        });
        setNutritionData(data);
      } catch (error) {
        console.error("Error fetching nutrition data:", error.message);
        setError("Can't load nutrients info.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutrition();
  }, [recordId]);

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
              <p className="pet-name">{petName}</p>
              <img
                src="https://picsum.photos/200/200"
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
            {isLoading && <p>加载中...</p>}
            {error && !isLoading && <p className="error-text">{error}</p>}
            {!isLoading && !error && nutritionData ? (
              <>
                <div className="nutrition-stats">
                  <div className="nutrition-item">
                    <span className="nutrition-label">Calories:</span>
                    <span className="nutrition-value">
                      {nutritionData.calories} / {nutritionData.caloriesGoal}
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Protein:</span>
                    <span className="nutrition-value">
                      {nutritionData.protein}g / {nutritionData.proteinGoal}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Carbs:</span>
                    <span className="nutrition-value">
                      {nutritionData.carbs}g / {nutritionData.carbsGoal}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fat:</span>
                    <span className="nutrition-value">
                      {nutritionData.fat}g / {nutritionData.fatGoal}g
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
