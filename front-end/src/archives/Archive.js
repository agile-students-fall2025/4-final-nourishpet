import './Archive.css';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

//fake nutrition and goal data fetch from db (count=7)
const mockurl = 'https://api.mockaroo.com/api/e721fed0?count=7&key=927ba720'

function WeekArchive() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //fetch from url
        axios.get(mockurl)
        .then(response => {
            setRecords(response.data);
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
    return <div className="loading">Loading Charlie's records...</div>;
    }

    return (
        <main className="Archive">
            <h1>Charlie's Nutrition Record</h1>
            
            <div className='record-list'>
                {records.map(record =>{
                    const goalstatus = (record['Total Intake'] >=record['Total Intake Goal'])
                    const statusText = goalstatus ? 'Goal Reached' : 'Goal Not Reached'

                    return (
                        
                        <div className='record-row' key={record.id}>
                        
                            <Link to={`/archives/histrecord/${record.id}`} className='date-link'>
                                <div className='date-item'>{record.Date}</div>
                            </Link> 

                            <div className='record-status'>
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