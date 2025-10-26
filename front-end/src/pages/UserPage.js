import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../services/mockApi';
import UserImage from './UserImage';
import './UserPage.css';

function UserPage(){
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadUserData = async () => {
        try {
          const data = await fetchUserData();
          setUserData(data);
        } catch (error){
          console.error('Failed to fetch user data:', error);
        } finally{
          setLoading(false);
        }
      };

      loadUserData();
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
                    <EditButton />
                </div>
            
                <UserInfoDisplay userData={userData} />
                
                <LogoutButton />

            </div>

            <button>
                <Link to="/">Home Page</Link>
            </button>
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
        <Link to='/log_out'>Log Out</Link>
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