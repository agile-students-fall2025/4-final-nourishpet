import './Archive.css';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

function WeekArchive() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState([]);
    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const token = getToken();

        //fetch from url
        axios.get('http://localhost:5000/api/histdata', {
            headers: { Authorization: `Bearer ${token}` } 
        })
        .then(response => {
            setRecords(response.data.slice(0,7));
        })
        .catch(error => {
            console.error("Error fetching nutrition data:", error);
        })
        .finally(() => {
            setLoading(false);
        });

        //fetch from url
        axios.get('http://localhost:5000/api/userdata', {
            headers: { Authorization: `Bearer ${token}` } 
        })
        .then(response => {
            setUserName(response.data.name);
        })
        .catch(error => {
            console.error("Error fetching user name:", error);
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
            <h1>{userName}'s Nutrition Record</h1>
            
            <div className='record-list'>
                {records.map(record =>{
                    const currentIntake = record.total_intake || 0;
                    
                    const goalstatus = (record['Total Intake'] >=record['Total Intake Goal'])
                    const statusText = goalstatus ? 'Goal Reached' : 'Goal Not Reached'
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
                    <p style={{textAlign: 'center', marginTop: '20px'}}>
                        No records found. Go add some food!
                    </p>
                )}
            </div>
            <Footer />
        </main>
    )
}


export default WeekArchive;