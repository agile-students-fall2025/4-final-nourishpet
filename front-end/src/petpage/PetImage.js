import React from 'react';
import './PetPage.css'

import stage1Img from 'front-end/src/petpage/pet_stage1.jpg';
import stage2Img from 'front-end/src/petpage/pet_stage2.jpg';
import stage2Img from 'front-end/src/petpage/pet_stage3.jpg';

const stageImages = {
    1: stage1Img,
    2: stage2Img,
    3: stage3Img,
  };

export default function PetImage({ stage }) {
    return (
      <img
        src={stageImages[stage] || stageImages[1]}
        alt={`Pet stage ${stage}`}
        className="pet-image"
      />
    );
  }