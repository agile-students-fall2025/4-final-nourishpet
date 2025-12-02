import XPBar from "./XPBar";
import StatusPie from "./StatusPie";
import PetImage from "./PetImage";
import GoalsPanel from "./GoalsPanel";
import { useState, useEffect } from "react";

const PetPage = () => {
  const [pet, setPet] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [userGoal, setUserGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    // fetch pet
    const petFetch = fetch("http://localhost:5000/api/pet", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());

    // fetch today's nutrition
    const nutritionFetch = fetch("http://localhost:5000/api/home/nutrition", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());

    // fetch user goals
    const goalFetch = fetch("http://localhost:5000/api/userdata", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());

    Promise.all([petFetch, nutritionFetch, goalFetch])
      .then(([petData, nutritionData, goalData]) => {
        setPet(petData);

        setNutrition({
          calories: nutritionData.total_intake,
          protein: nutritionData.protein,
          carbs: nutritionData.carbs,
          fat: nutritionData.fat
        });

        setUserGoal({
          calories: goalData.total_intake_goal,
          protein: goalData.protein_goal,
          carbs: goalData.carbs_goal,
          fat: goalData.fat_goal
        });

        setLoading(false);
      })
      .catch(err => {
        console.error("PetPage error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading pet...</div>;
  if (!pet) return <div>No pet found</div>;

  return (
    <div className="pet-page">

      {/* Show date in top right */}
      <p id="date-top-right">{new Date().toDateString()}</p>

      <h1>{pet.name}</h1>

      <PetImage stage={pet.stage} />

      <div className="xp-container">
        <XPBar xp={pet.xp} level={pet.level} />
      </div>

      {/* mid section: goals + pie */}
      <div className="mid-section">
        <div className="goals-panel">
          {userGoal && nutrition && (
            <GoalsPanel nutrition={nutrition} goals={userGoal} />
          )}
        </div>

        <div className="status-pie">
          {nutrition && <StatusPie nutrition={nutrition} />}
        </div>
      </div>

    </div>
  );
};

export default PetPage;


