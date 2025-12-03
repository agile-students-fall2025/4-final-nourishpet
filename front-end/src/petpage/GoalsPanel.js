import React from 'react';
import './PetPage.css';

const fmt = (n) => {
    const v = Number(n);
    return Number.isFinite(v) ? v.toFixed(1) : "0.0";
};

function GoalsPanel({ nutrition, goals }) {
    return (
        <div className='goals-panel'>
            <h4>Goals</h4>
            {Object.keys(goals).map((key) => (
                <div key={key} className='goal-item'>
                    <p>
                        {key}: {fmt(nutrition[key])}/{fmt(goals[key])}
                    </p>
                    <div className='goal-bar-bg'>
                        <div
                            className='goal-bar-fill'
                            style={{ width: `${(nutrition[key] / goals[key]) * 100}%` }}
                        ></div>

                    </div>
                </div>
            ))}
        </div>
    );
}

export default GoalsPanel;