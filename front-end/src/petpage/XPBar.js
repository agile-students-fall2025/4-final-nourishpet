import React from "react";
import "./PetPage.css";

const XP_PER_LEVEL = 50;        // 和后端一致：每 50 XP 升 1 级
const LEVELS_PER_STAGE = 33;    // 每 33 级升一个阶段
const XP_PER_STAGE = XP_PER_LEVEL * LEVELS_PER_STAGE; // 一个 stage 需要的总 XP

// 根据 level 算当前阶段
function getStageFromLevel(level) {
  if (level <= 33) return 1;
  if (level <= 66) return 2;
  return 3; // 67+ 都是 stage3
}

// 根据 stage 算这个阶段起始的 level
function getStageStartLevel(stage) {
  if (stage === 1) return 1;
  if (stage === 2) return 34;
  return 67; // stage3 起点
}

function XPBar({ xp, level }) {
  const stage = getStageFromLevel(level);
  const stageStartLevel = getStageStartLevel(stage);

  // 这个阶段开始时的总 XP（到达起始 level 所需的 XP）
  const xpAtStageStart = (stageStartLevel - 1) * XP_PER_LEVEL;

  // 当前阶段内已经获得的 XP
  const xpInStage = Math.max(0, xp - xpAtStageStart);

  // 当前阶段内的进度 0~1，最多 100%
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
