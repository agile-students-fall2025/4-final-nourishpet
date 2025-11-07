import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import UserImage from './UserImage';
import '../css/UserPage.css';
import Footer from '../components/Footer.js'
import axios from "axios";

function UserPage(){
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      axios
        .get("http://localhost:5000/api/userdata")
        .then((res) => {
          console.log(res.data);
          const userData = res.data; 

          setUserData({
            name: userData.name,
            petName: userData.petName,
            age: userData.age,
            gender: userData.gender,
            height: userData.height,
            currentWeight: userData.currentWeight,
            targetWeight: userData.targetWeight,
            bmi: userData.bmi,
          });
          setLoading(false);
        })
        .catch((err) => console.error("Error fetching data:", err));
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>Failed to load user data</div>;
    }
    
    return(
      <div className="homepage">
          <header className="homepage-header">
              <EditButton />
          </header>

          <main className="homepage-main">
              <div className="page-header">
                  <h1 className="app-title">User Page</h1>
              </div>
          
              <UserInfoDisplay userData={userData} />
              
              <LogoutButton />
          </main>

          < Footer/>
      </div>
  )
}

function UserInfoDisplay({ userData }){
    return (
        <section className="nutrition-section">
            <div className="nutrition-chart">
                <UserImage />
                
                <h2 className="app-title" style={{marginTop: '20px', marginBottom: '15px'}}>{userData.name}</h2>
                
                <div className="user-details-simple">
                    <p><span className="detail-label">Pet Name:</span> <span className="detail-value">{userData.petName}</span></p>
                    <p><span className="detail-label">Age:</span> <span className="detail-value">{userData.age}</span></p>
                    <p><span className="detail-label">Gender:</span> <span className="detail-value">{userData.gender}</span></p>
                    <p><span className="detail-label">Height:</span> <span className="detail-value">{userData.height}cm</span></p>
                    <p><span className="detail-label">Current Weight:</span> <span className="detail-value">{userData.currentWeight}kg</span></p>
                    <p><span className="detail-label">Target Weight:</span> <span className="detail-value">{userData.targetWeight}kg</span></p>
                    <p><span className="detail-label">BMI:</span> <span className="detail-value">{userData.bmi}</span></p>
                </div>
            </div>
        </section>
    );
}

function LogoutButton() {
    return (
      <Link to='/login' className="user-button" style={{display: 'inline-block', textAlign: 'center', marginTop: '20px'}}>
        Log Out
      </Link>
    );
  }

function EditButton() {
return (
    <Link to='/editUserInfo' className="user-button">
        Edit
    </Link>
);
}

export default UserPage;