import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function EditUserInfo(){
    const [formData, setFormData] = useState({
        username: "Charlie",
        petName: "Charlie's dog",
        targetWeight: "50kg",
        height: "160cm",
        currentWeight: "55kg"
    });

    const [tempData, setTempData] = useState(formData);

    const handleInputChange = (field, value) => {
        setTempData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConfirm = () => {
        setFormData(tempData);
        console.log('Date updated:', tempData);
    };

    return(
        <div className="edit-page">
            <div className="page-header">
                <h1>Edit Info</h1>
            </div>
            
            <UserInfo formData={tempData} onInputChange={handleInputChange} />
            
            <div className="button-section">
                <Confirm onConfirm={handleConfirm} />
                <Cancel />
            </div>
        </div>
    )
}

function UserInfo({ formData, onInputChange }){
    return (
        <div className="user-info-display">
            <div className="portrait-section">
                <div className="portrait-placeholder">
                    Set Your Portraits
                </div>
            </div>

            <div className="form-section">
                <div className="form-field">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={formData.username}
                        onChange={(e) => onInputChange('username', e.target.value)}
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
                    <label>Target Weight:</label>
                    <input 
                        type="text" 
                        value={formData.targetWeight}
                        onChange={(e) => onInputChange('targetWeight', e.target.value)}
                    />
                </div>
                
                <div className="form-field">
                    <label>Height:</label>
                    <input 
                        type="text" 
                        value={formData.height}
                        onChange={(e) => onInputChange('height', e.target.value)}
                    />
                </div>
                
                <div className="form-field">
                    <label>Current Weight:</label>
                    <input 
                        type="text" 
                        value={formData.currentWeight}
                        onChange={(e) => onInputChange('currentWeight', e.target.value)}
                    />
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