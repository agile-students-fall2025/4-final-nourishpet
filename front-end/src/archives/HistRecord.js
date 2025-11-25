import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GoalsPanel from "../petpage/GoalsPanel";
import StatusPie from "../petpage/StatusPie";
import "./Archive.css";

function HistRecord() {
    const { id } = useParams();
    const [record, setRecord] = useState(null);
    const [userGoal, setUserGoal] = useState(null);
    const [foodlist, setFoodList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const token = getToken();

        const fetchHistory = axios.get('http://localhost:5000/api/histdata', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const fetchUserGoals = axios.get('http://localhost:5000/api/userdata', {
            headers: { Authorization: `Bearer ${token}` }
        });

        Promise.all([fetchHistory, fetchUserGoals])
            .then(([histResponse, userResponse]) => {
                
                const allRecords = histResponse.data;
 
                const specificRecord = allRecords.find(item => 
                    // use date as id
                    String(item._id) === String(id) || item.date === id 
                );

                if (specificRecord) {
                    setRecord({
                        date: specificRecord.date,
                        nutrition: { 
                            calories: specificRecord.total_intake, 
                            protein: specificRecord.protein, 
                            carbs: specificRecord.carbs, 
                            fat: specificRecord.fat 
                        },
                    });
                    setFoodList({
                        foods: specificRecord.food_list || [], // Fallback to empty array if null
                        grams: specificRecord.grams || [],
                        protein: specificRecord.protein_list || [],
                        carbs: specificRecord.carbs_list || [],
                        fat: specificRecord.fat_list || []
                    });
                } else {
                    console.warn("Record not found in ID search");
                }

                const foundUserGoal = userResponse.data;
                if (foundUserGoal) {
                    setUserGoal({
                        goals: {
                            calories: foundUserGoal.total_intake_goal, 
                            protein: foundUserGoal.protein_goal, 
                            carbs: foundUserGoal.carbs_goal, 
                            fat: foundUserGoal.fat_goal 
                        }
                    });
                }
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setError("Could not load data.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [id]);

    if (loading) {
        return <div>Loading record details...</div>;
    }

    if (!record) {
        return <div>Record not found...</div>;
    }

    return (
        <div className="archive-page">
            <BackButton />

            <h1>{record.date}</h1>

            <div className="nutrition-record">
                <GoalsPanel nutrition={record.nutrition} goals={userGoal.goals} />
                <StatusPie nutrition={record.nutrition} />
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
    return (
        <Link to='/archives' className="back-button">
            Back
        </Link>
    )
}

export default HistRecord;
