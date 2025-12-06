import React, { useEffect, useState } from "react";

// ---- Stage 1: 4 帧 ----
import s1_0 from "./pet_stage1.png";
import s1_1 from "./pet_stage1 1.png";
import s1_2 from "./pet_stage1 2.png";
import s1_3 from "./pet_stage1 3.png";

// ---- Stage 2: 4 帧 ----
import s2_0 from "./pet_stage2.png";
import s2_1 from "./pet_stage2 1.png";
import s2_2 from "./pet_stage2 2.png";
import s2_3 from "./pet_stage2 3.png";

// ---- Stage 3: 4 帧 ----
import s3_0 from "./pet_stage3.png";
import s3_1 from "./pet_stage3 1.png";
import s3_2 from "./pet_stage3 2.png";
import s3_3 from "./pet_stage3 3.png";

// 每个 stage 的 4 帧
const FRAMES = {
  1: [s1_0, s1_1, s1_2, s1_3],
  2: [s2_0, s2_1, s2_2, s2_3],
  3: [s3_0, s3_1, s3_2, s3_3],
};

export default function PetImage({
  stage = 1,  
  style = {},
}) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const frames = FRAMES[stage] || FRAMES[1];
    const frameCount = frames.length || 1;

    setFrameIndex(0);

    const intervalMs = 250;

    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameCount);
    }, intervalMs);

    return () => clearInterval(id);
  }, [stage]);

  const frames = FRAMES[stage] || FRAMES[1];
  const currentFrame = frames[frameIndex] || frames[0];

  return (
    <img
      src={currentFrame}
      alt={`Pet stage ${stage}`}
      style={{ width: "200px", ...style }}
      draggable={false}
    />
  );
}
