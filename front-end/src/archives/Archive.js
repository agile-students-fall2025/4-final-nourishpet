import './Archive.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import { API } from "../api";
import '../css/HomePage.css';

function WeekArchive() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState([]);
    const [userGoal, setUserGoal] = useState(null);
    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const token = getToken();

        //fetch from url
        axios.get(`${API}/api/histdata`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setRecords(response.data.slice(0, 7));
            })
            .catch(error => {
                console.error("Error fetching nutrition data:", error);
            })
            .finally(() => {
                setLoading(false);
            });

        //fetch username
        axios.get(`${API}/api/userdata`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const foundUserGoal = response.data
                if (foundUserGoal) {
                    setUserGoal(foundUserGoal.total_intake_goal);
                    setUserName(response.data.name);
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    //loading message
    if (loading) {
        return <div className="loading">Loading records...</div>;
    }

    return (
        <div className="homepage">
            <header className="homepage-header">
                <Link to="/home" className="user-button">
                    Home
                </Link>
            </header>

            <main className="homepage-main">
                <h1 className="archive-title">{userName}'s Nutrition Record</h1>

                <div className='record-list'>
                    {records.map(record => {
                        const currentIntake = record.total_intake || 0;

                        const goalstatus = (currentIntake >= userGoal);
                        const statusText = goalstatus ? 'Goal Reached' : 'Goal Not Reached';
                        const rowHighlighted = goalstatus ? '' : 'record-row-goal-notreached';

                        return (

                            <div className={`record-row ${rowHighlighted}`} key={record._id}>

                                <Link to={`/archives/histrecord/${record._id}`} className='date-link'>
                                    <div className='date-item'>{record.date}</div>
                                </Link>

                                <div className={`record-status`}>
                                    {statusText}
                                </div>
                            </div>
                        );
                    })}

                    {records.length === 0 && (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>
                            No records found. Go add some food!
                        </p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}


export default WeekArchive;