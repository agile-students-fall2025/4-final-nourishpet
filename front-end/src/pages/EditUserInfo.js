import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { fetchUserData, updateUserData } from '../services/mockApi';
import UserImage from './UserImage';
import '../css/EditUserInfo.css';
import Footer from '../components/Footer.js'
import axios from "axios";


function EditUserInfo(){
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullfilled, setFullfilled] = useState(false);
    const [fullfilledinitial, setFullfilledinitial] = useState(false);
    const hasInitialized = useRef(false);
    useEffect(() => {
      axios
        .get("http://localhost:5000/api/userdata", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })
        .then((res) => {
          console.log(res.data);
          const userData = res.data; 

          setUserData({
            name: userData.name,
            // petName: userData.petName,
            age: userData.age,
            gender: userData.gender,
            height: userData.height,
            weight: userData.weight,
            target_weight: userData.target_weight,
            // bmi: userData.bmi,
          });
          setLoading(false);
        })
        .catch((err) => console.error("Error fetching data:", err));
    }, []);

    useEffect(() => {
      if (userData) {
        // const requiredFields = ['name', 'petName', 'age', 'gender', 'height', 'weight', 'target_weight'];
        const requiredFields = ['name', 'age', 'gender', 'height', 'weight', 'target_weight'];
        const hasEmptyField = requiredFields.some(field => {
          const value = userData[field];
          return value === null || value === undefined || value === '' || (typeof value === 'number' && isNaN(value));
        });
        setFullfilled(!hasEmptyField);
        
        if (!hasInitialized.current) {
          setFullfilledinitial(!hasEmptyField);
          hasInitialized.current = true;
        }
      }
    }, [userData]);


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
        if (!fullfilled) {
            alert('Please fill in all required fields before confirming the operation.');
            return;
        }
        axios
            .post("http://localhost:5000/api/updateuserdata", userData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err));
    };

    const handleCancel = (e) => {
        if (!fullfilledinitial) {
            e.preventDefault();
            alert('Please fill in all required fields before canceling the operation.');
        }
    }

    return(
        <div className="homepage">

            <main className="homepage-main">
                <div className="page-header">
                    <h1 className="app-title">Edit Info</h1>
                </div>
                
                <UserInfo formData={userData} onInputChange={handleInputChange} />
                
                <div className="button-section">
                    <Confirm onConfirm={handleConfirm} fullfilled={fullfilled} />
                    <Cancel onCancel={handleCancel} fullfilled={fullfilledinitial} />
                </div>
            </main>

        </div>
    )
}

function UserInfo({ formData, onInputChange }){
    return (
        <section className="nutrition-section">
            <div className="nutrition-chart">
                <UserImage />

                <div className="form-section-simple">
                    <div className="form-row">
                        <label>Username:</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => onInputChange('name', e.target.value)}
                            className="form-input-simple"
                        />
                    </div>
                    
                    {/* <div className="form-row">
                        <label>Pet name:</label>
                        <input 
                            type="text" 
                            value={formData.petName} 
                            onChange={(e) => onInputChange('petName', e.target.value)}
                            className="form-input-simple"
                        />
                    </div> */}

                    <div className="form-row">
                        <label>Gender:</label>
                        <input 
                            type="text" 
                            value={formData.gender}
                            onChange={(e) => onInputChange('gender', e.target.value)}
                            className="form-input-simple"
                        />
                    </div>

                    <div className="form-row">
                        <label>Age:</label>
                        <input 
                            type="number" 
                            value={formData.age}
                            onChange={(e) => onInputChange('age', e.target.value)}
                            className="form-input-simple"
                        />
                    </div>
                    
                    <div className="form-row">
                        <label>Height:</label>
                        <div className="input-with-unit-simple">
                            <input 
                                type="number" 
                                value={formData.height}
                                onChange={(e) => onInputChange('height', e.target.value)}
                                className="form-input-simple"
                            />
                            <span className="unit-simple">cm</span>
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <label>Current Weight:</label>
                        <div className="input-with-unit-simple">
                            <input 
                                type="number" 
                                value={formData.weight}
                                onChange={(e) => onInputChange('weight', e.target.value)}
                                className="form-input-simple"
                            />
                            <span className="unit-simple">kg</span>
                        </div>
                    </div>

                    <div className="form-row">
                        <label>Target Weight:</label>
                        <div className="input-with-unit-simple">
                            <input 
                                type="number" 
                                value={formData.target_weight}
                                onChange={(e) => onInputChange('target_weight', e.target.value)}
                                className="form-input-simple"
                            />
                            <span className="unit-simple">kg</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Confirm({ onConfirm, fullfilled }) {
    return (
    <button className="user-button" onClick={onConfirm} style={{cursor: fullfilled ? 'pointer' : 'not-allowed', opacity: fullfilled ? 1 : 0.6}}>
        <Link to='/userpage' onClick={(e) => !fullfilled && e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>Confirm</Link>
    </button>
    );
}

function Cancel({ onCancel, fullfilled }) {
    return (
        <button className="user-button" onClick={onCancel} style={{cursor: fullfilled ? 'pointer' : 'not-allowed', opacity: fullfilled ? 1 : 0.6, background: 'rgba(255, 255, 255, 0.7)'}}>
            <Link to='/userpage' onClick={(e) => !fullfilled && e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>Cancel</Link>
        </button>
    );
}

export default EditUserInfo;