import React from "react";

import stage1Img from "./pet_stage1.jpg";
import stage2Img from "./pet_stage2.jpg";
import stage3Img from "./pet_stage3.jpg";

const stageImages = {
  1: stage1Img,
  2: stage2Img,
  3: stage3Img,
};

export default function PetImage({ stage }) {
  return (
    <img
      src={stageImages[stage] || stage1Img}
      alt={`Pet stage ${stage}`}
      style={{ width: "200px" }} 
    />
  );
}
