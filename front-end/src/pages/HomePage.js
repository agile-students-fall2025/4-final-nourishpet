import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import logo from '../logo.svg';
import '../css/HomePage.css';

function HomePage() {
  const [nutritionData, setNutritionData] = useState(null);
  const [petName, setPetName] = useState("Charlie");

  const mockurl = 'https://api.mockaroo.com/api/e721fed0?count=7&key=927ba720';

  useEffect(() => {
    axios
      .get(mockurl)
      .then((res) => {
        console.log('Fetched nutrition data:', res.data);
        const todayData = res.data[0];
        setNutritionData({
          calories: todayData["Total Intake"],
          caloriesGoal: todayData["Total Intake Goal"],
          protein: todayData.Protein,
          proteinGoal: todayData["Protein Goal"],
          carbs: todayData.Carbs,
          carbsGoal: todayData["Carbs Goal"],
          fat: todayData.Fat,
          fatGoal: todayData["Fat Goal"],
        });
      })
      .catch((err) => {
        console.error("Error fetching nutrition data:", err);
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
        <section className="nutrition-section">
          <div className="nutrition-chart">
            {nutritionData ? (
              <>
                <h3>Simple nutrition chart</h3>
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
              <p>Simple nutrition chart</p>
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
