import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <Link to="/feedpage" className="footer-link">
        <div className="footer-item">Feed</div>
      </Link>
      
      <Link to="/" className="footer-link">
        <div className="footer-item">Logo / Home</div>
      </Link>
      
      <Link to="/archives" className="footer-link">
        <div className="footer-item">Records/History</div>
      </Link>
    </footer>
  );
}

export default Footer;

