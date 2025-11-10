import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GoalsPanel from "../petpage/GoalsPanel";
import StatusPie from "../petpage/StatusPie";
import "./Archive.css";

function HistRecord() {
    const { id } = useParams();
    const [record, setRecord] = useState(null);
    const [foodlist, setFoodList] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fake fetch from db
        axios.get('http://localhost:5000/api/histdata')
            .then(response => {
                const foundRecord = response.data.find(re => re.id === parseInt(id));
                setRecord({
                    date: foundRecord['Date'],
                    nutrition: { calories: foundRecord['Total Intake'], protein: foundRecord['Protein'], carbs: foundRecord['Carbs'], fat: foundRecord['Fat'] },
                    goals: { calories: foundRecord['Total Intake Goal'], protein: foundRecord['Protein Goal'], carbs: foundRecord['Carbs Goal'], fat: foundRecord['Fat Goal'] }
                });
                setFoodList({
                    foods: foundRecord['Food List'],
                    grams: foundRecord['Gram List'],
                    protein: foundRecord['Protein List'],
                    carbs: foundRecord['Carbs List'],
                    fat: foundRecord['Fat List']
                });
            })
            .catch(error => console.error("Error fetching record:", error))
            .finally(() => setLoading(false));

    }, [id]); // Re-run this effect if the ID in the URL changes


    if (loading) {
        return <div>Loading record details...</div>;
    }

    if (!record) {
        return <div>Record not found...</div>;
    }

    const { date, nutrition, goals } = record;

    return (
        <div className="archive-page">
            <BackButton />
            
            <h1>{date}</h1>
           
            <div className="nutrition-record">
                <GoalsPanel nutrition={nutrition} goals={goals} />
                <StatusPie nutrition={nutrition} />
            </div>

            <div className="food-details">
                <p>Detailed Intake List</p>
                
                {foodlist.foods.map((foodName, index) => (

                    // Use the index to get the matching item from the other arrays
                    <div key={index} className="food-row">
                        <span className="food-name">{foodName}</span>
                        <span className="food-gram">{foodlist.grams?.[index]}g</span>
                        <span className="food-protein">Protein: {foodlist.protein?.[index]}g</span>
                        <span className="food-carbs">Carbs: {foodlist.carbs?.[index]}g</span>
                        <span className="food-fat">Fat: {foodlist.fat?.[index]}g</span>
                    </div>

                ))}
            </div>
           
        </div>
    );
}

function BackButton() {
    return(
        <Link to = '/archives' className="back-button">
            Back
        </Link>
    )
}

export default HistRecord;
