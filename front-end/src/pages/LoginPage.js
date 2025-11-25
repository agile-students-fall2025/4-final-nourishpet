import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import logo from '../logo.svg';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Login failed.");
      return;
    }

    // Save token + user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("userId", data.id);

    // Redirect
    navigate("/home");
  } catch (err) {
    console.error("Login error:", err);
    alert("Network or server error during login.");
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <div className="logo-placeholder">
            <img src={logo} alt="NourishPet Logo" className="logo-image" />
          </div>
        </div>
        
        <h1 className="login-title">Log In</h1>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        
        <div className="signup-link">
          Don't have an account? <Link to="/register" className="link-text">Click here to sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

