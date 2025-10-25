import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import XPBar from "../petpage/XPBar";
import GoalsPanel from "../petpage/GoalsPanel";
import StatusPie from "../petpage/StatusPie";
import "./HistRecord.css";

//random nutrition details for the past week (count=7)
const mockurl = 'https://api.mockaroo.com/api/e721fed0?count=7&key=927ba720'

function HistRecord() {
    
    return (
        <div className="archive-page">
            <h1>Detailed Recrod</h1>
           
        </div>
    );
}

export default HistRecord;
