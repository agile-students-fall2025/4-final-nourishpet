import React from "react";
import "./PetPage.css";

function GoalsPanel({
  nutrition = {},
  goals = {},
}) {
  return (
    <div className="goals-panel">
      <h4>Goals</h4>
      {Object.keys(goals).map((key) => (
        <div key={key} className="goal-item">
          <p>
            {key}: {nutrition[key] ?? 0}/{goals[key]}
          </p>
          <div className="goal-bar-bg">
            <div
              className="goal-bar-fill"
              style={{
                width: `${Math.min(
                  100,
                  ((nutrition[key] ?? 0) / goals[key]) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GoalsPanel;
