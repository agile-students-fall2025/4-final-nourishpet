import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function UserPage(){
    const [userData, setUserData] = useState({
        name: "Charlie",
        petName: "Charlie's dog",
        targetWeight: "50kg",
        height: "160cm",
        currentWeight: "55kg",
        bmi: "21.5 Standard"
      });

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

function UserInfoDisplay( {userData} ){
    return (
        <div className="user-info-display">

          <div className="user-portrait">
            <div className="portrait-placeholder">
              User Portraits
            </div>
          </div>
          
          <h2 className="user-name">{userData.name}</h2>
          
          <div className="user-details">
            <p>Pet Name: {userData.petName}</p>
            <p>Target Weight: {userData.targetWeight}</p>
            <p>Height: {userData.height}</p>
            <p>Current Weight: {userData.currentWeight}</p>
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