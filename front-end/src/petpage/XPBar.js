import React from "react";
import "./PetPage.css";

const XP_PER_LEVEL = 50;
const LEVELS_PER_STAGE = 33;
const XP_PER_STAGE = XP_PER_LEVEL * LEVELS_PER_STAGE;


function getStageFromLevel(level) {
  if (level <= 33) return 1;
  if (level <= 66) return 2;
  return 3;
}


function getStageStartLevel(stage) {
  if (stage === 1) return 1;
  if (stage === 2) return 34;
  return 67;
}

function XPBar({ xp, level }) {
  const stage = getStageFromLevel(level);
  const stageStartLevel = getStageStartLevel(stage);


  const xpAtStageStart = (stageStartLevel - 1) * XP_PER_LEVEL;


  const xpInStage = Math.max(0, xp - xpAtStageStart);


  const stageProgress = Math.min(1, xpInStage / XP_PER_STAGE);

  return (
    <div className="xp-container">
      <p>
        Stage {stage} · Lv {level}
      </p>
      <div className="xp-bar-bg">
        <div
          className="xp-bar-fill"
          style={{ width: `${stageProgress * 100}%` }}
        ></div>
      </div>
      <p>
        XP in Stage: {xpInStage}/{XP_PER_STAGE}
      </p>
    </div>
  );
}

export default XPBar;
