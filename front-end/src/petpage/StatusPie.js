import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import './PetPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatusPie({nutrition}){
    const pieData = {
        labels: ["Protein","Carbs", "Fat"],
        datasets: [
            {
                data: [nutrition.protein,nutrition.carbs,nutrition.fat],
                backgroundColor: ["#a8edea", "#fcb69f", "#fed6e3"]
            }
        ]
    }
    return (
        <div className="status-pie">
        <h4>Status</h4>
        <Pie data={pieData}/>
        </div>
    );
}

export default StatusPie;
