import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Login functionality will be implemented when backend is ready
    console.log('Login attempted with:', { username, password });
    // TODO: Add authentication logic here

    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <div className="logo-placeholder">logo</div>
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

