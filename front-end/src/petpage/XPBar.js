import React from "react";
import './PetPage.css';

function XPBar({xp,level}){
    return (
        <div className="xp-container">
        <p>Lv {level}</p>
        <div className="xp-bar-bg">
            <div
            className="xp-bar-fill"
            style={{ width: `${(xp / (level * 100)) * 100}%` }}
            ></div>
        </div>
        <p>XP {xp}/{level * 100}</p>
        </div>
    );
}

export default XPBar;
