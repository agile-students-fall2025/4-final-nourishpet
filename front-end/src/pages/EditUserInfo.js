import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchUserData, updateUserData } from '../services/mockApi';
import UserImage from './UserImage';
import '../css/UserPage.css';
import Footer from '../components/Footer.js'
import axios from "axios";


function EditUserInfo(){
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

    const handleInputChange = (field, value) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConfirm = async() => {
        axios
            .post("http://localhost:5000/api/updateuserdata", userData)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err));
    };

    return(
        <div className="edit-page">
            <div className="page-header">
                <h1>Edit Info</h1>
            </div>
            
            <UserInfo formData={userData} onInputChange={handleInputChange} />
            
            <div className="button-section">
                <Confirm onConfirm={handleConfirm} />
                <Cancel />
            </div>

        </div>
    )
}

function UserInfo({ formData, onInputChange }){
    return (
        <div className="edit-user-info-display">
            <UserImage />

            <div className="form-section">
                <div className="form-field">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                    />
                </div>
                
                <div className="form-field">
                    <label>Pet name:</label>
                    <input 
                        type="text" 
                        value={formData.petName} 
                        onChange={(e) => onInputChange('petName', e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label>Gender:</label>
                    <input 
                        type="text" 
                        value={formData.gender}
                        onChange={(e) => onInputChange('gender', e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label>Age:</label>
                    <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => onInputChange('age', e.target.value)}
                    />
                </div>
                
                <div className="form-field">
                    <label>Height:</label>
                    <div className="input-with-unit">
                        <input 
                            type="number" 
                            value={formData.height}
                            onChange={(e) => onInputChange('height', e.target.value)}
                        />
                        <span className="unit">cm</span>
                    </div>
                </div>
                
                <div className="form-field">
                    <label>Current Weight:</label>
                    <div className="input-with-unit">
                        <input 
                            type="number" 
                            value={formData.currentWeight}
                            onChange={(e) => onInputChange('currentWeight', e.target.value)}
                        />
                        <span className="unit">kg</span>
                    </div>
                </div>

                <div className="form-field">
                    <label>Target Weight:</label>
                    <div className="input-with-unit">
                        <input 
                            type="number" 
                            value={formData.targetWeight}
                            onChange={(e) => onInputChange('targetWeight', e.target.value)}
                        />
                        <span className="unit">kg</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Confirm({ onConfirm }) {
    return (
      <button className="confirm" onClick={onConfirm}>
        <Link to='/userpage'>Confirm</Link>
      </button>
    );
}

function Cancel() {
    return (
      <button className="cancel">
        <Link to='/userpage'>Cancel</Link>
      </button>
    );
}

export default EditUserInfo;