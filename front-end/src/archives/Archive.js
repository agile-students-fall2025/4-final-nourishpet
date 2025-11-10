import './Archive.css';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

function WeekArchive() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //fetch from url
        axios.get('http://localhost:5000/api/histdata')
        .then(response => {
            const weeklyRecords = response.data.filter(record => 
                record.id >= 1 && record.id <= 7
            );
            setRecords(weeklyRecords);
        })
        .catch(error => {
            console.error("Error fetching nutrition data:", error);
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
        <main className="Archive">
            <h1>Charlie's Nutrition Record</h1>
            
            <div className='record-list'>
                {records.map(record =>{
                    const goalstatus = (record['Total Intake'] >=record['Total Intake Goal'])
                    const statusText = goalstatus ? 'Goal Reached' : 'Goal Not Reached'
                    const rowHighlighted = goalstatus ? '' : 'record-row-goal-notreached';

                    return (
                        
                        <div className={`record-row ${rowHighlighted}`} key={record.id}>
                        
                            <Link to={`/archives/histrecord/${record.id}`} className='date-link'>
                                <div className='date-item'>{record.Date}</div>
                            </Link> 

                            <div className={`record-status`}>
                                {statusText}
                            </div>
                        </div>
                    );
                })}
            </div>
            <Footer />
        </main>
    )
}


export default WeekArchive;