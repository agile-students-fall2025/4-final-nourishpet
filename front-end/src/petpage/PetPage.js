import XPBar from "./XPBar";
import StatusPie from "./StatusPie";
import PetImage from "./PetImage";
import GoalsPanel from "./GoalsPanel";
import { useState, useEffect } from "react";

const PetPage = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 所有 hooks 都在最外层
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/pet", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPet(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch pet failed:", err);
        setLoading(false);
      });
  }, []);

  // ✅ 条件渲染只放在 return 阶段
  if (loading) return <div>Loading pet...</div>;
  if (!pet) return <div>No pet data</div>;

  return (
    <div className="pet-container">
      <h1>{pet.name}</h1>

      <PetImage stage={pet.stage} />
      <XPBar xp={pet.xp} level={pet.level} />
      <StatusPie status={pet.status} />
      <GoalsPanel />

      <p>Level: {pet.level}</p>
      <p>Stage: {pet.stage}</p>
      <p>XP: {pet.xp}</p>
    </div>
  );
};

export default PetPage;
