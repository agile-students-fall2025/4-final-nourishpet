import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./PetPage.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function StatusPie({
  nutrition = { protein: 0, carbs: 0, fat: 0 }, // ⭐ 默认值
}) {
  const pieData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [nutrition.protein, nutrition.carbs, nutrition.fat],
        backgroundColor: ["#6fa3ef", "#ffd166", "#ef6f6c"],
      },
    ],
  };
  return (
    <div className="status-pie">
      <h4>Status</h4>
      <Pie data={pieData} />
    </div>
  );
}

export default StatusPie;
