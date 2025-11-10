import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/RegisterPage.css';
import logo from '../logo.svg';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Registration functionality will be implemented when backend is ready
    console.log('Registration attempted with:', { username, password });
    // TODO: Add registration logic here
    
    navigate('/');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="logo-container">
          <div className="logo-placeholder">
            <img src={logo} alt="NourishPet Logo" className="logo-image" />
          </div>
        </div>
        
        <h1 className="register-title">Register</h1>
        
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="register-input"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="register-input"
              required
            />
          </div>
          
          <button type="submit" className="register-button">
            Sign up
          </button>
        </form>
        
        <div className="login-link">
          Already have an account? <Link to="/login" className="link-text">Click here to log in</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

