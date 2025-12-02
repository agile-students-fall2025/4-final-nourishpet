import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GoalsPanel from "../petpage/GoalsPanel";
import StatusPie from "../petpage/StatusPie";
import "./Archive.css";

import '../css/HomePage.css';

import Footer from '../components/Footer';

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

        // If ID is "today", fetch from home/nutrition endpoint
        let fetchRecordPromise;
        if (id === 'today') {
            fetchRecordPromise = axios.get('http://localhost:5000/api/home/nutrition', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                return { data: [res.data] };
            });
        } else {
            fetchRecordPromise = axios.get('http://localhost:5000/api/histdata', {
                headers: { Authorization: `Bearer ${token}` }
            });
        }

        const fetchUserGoals = axios.get('http://localhost:5000/api/userdata', {
            headers: { Authorization: `Bearer ${token}` }
        });

        Promise.all([fetchRecordPromise, fetchUserGoals])
            .then(([histResponse, userResponse]) => {

                const allRecords = histResponse.data;

                let specificRecord;
                if (id === 'today') {
                    // For today, we just take the first (and only) item returned
                    specificRecord = allRecords[0];
                } else {
                    specificRecord = allRecords.find(item =>
                        // use date as id
                        String(item._id) === String(id) || item.date === id
                    );
                }

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
        <div className="homepage">
            <header className="homepage-header">
                <Link to="/archives" className="user-button">
                    Back
                </Link>
            </header>

            <main className="homepage-main">
                <h1>{record.date}</h1>

                <div className="nutrition-record">
                    <GoalsPanel nutrition={record.nutrition} goals={userGoal.goals} />
                    <StatusPie nutrition={record.nutrition} />
                </div>

                <div className="food-details">
                    <p>Detailed Intake List</p>

                    <table className="food-table">
                        <thead>
                            <tr>
                                <th>Food</th>
                                <th>Protein</th>
                                <th>Carbs</th>
                                <th>Fat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foodlist.foods.map((foodName, index) => (
                                <tr key={index}>
                                    <td className="food-name">{foodName}: {foodlist.grams?.[index]}g</td>
                                    <td className="food-protein">{foodlist.protein?.[index]}g</td>
                                    <td className="food-carbs">{foodlist.carbs?.[index]}g</td>
                                    <td className="food-fat">{foodlist.fat?.[index]}g</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
        </div>
    );
}


export default HistRecord;
