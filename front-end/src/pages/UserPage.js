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
            targetWeight: userData.targetWeight,
            height: userData.height,
            currentWeight: userData.currentWeight,
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
      <div>
          <div className="user-page">
              <div className="page-header">
                  <h1>User Page</h1>
              </div>
              
              <div className="edit-button-container">
                  <EditButton />
              </div>
          
              <UserInfoDisplay userData={userData} />
              
              <LogoutButton />

          </div>

          < Footer/>
      </div>
  )
}

function UserInfoDisplay({ userData }){
    return (
        <div className="user-info-display">
            <UserImage />
            
            <h2 className="user-name">{userData.name}</h2>
            
            <div className="user-details">
                <p>Pet Name: {userData.petName}</p>
                <p>Target Weight: {userData.targetWeight}kg</p>
                <p>Height: {userData.height}cm</p>
                <p>Current Weight: {userData.currentWeight}kg</p>
                <p>BMI: {userData.bmi}</p>
            </div>
        </div>
    );
}

function LogoutButton() {
    return (
      <button className="logout-button">
        <Link to='/login'>Log Out</Link>
      </button>
    );
  }

function EditButton() {
return (
    <button className="edit-button">
        <Link to='/editUserInfo'>Edit</Link>
    </button>
);
}

export default UserPage;