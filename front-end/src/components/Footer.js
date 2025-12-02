import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';
import logo from '../logo.svg';

function Footer() {
  return (
    <footer className="footer">
      <Link to="/feedpage" className="footer-link">
        <div className="footer-item">Feed</div>
      </Link>

      <Link to="/home" className="footer-link">
        <div className="footer-item logo-item">
          <img src={logo} alt="Home" className="footer-logo" />
        </div>
      </Link>

      <Link to="/archives" className="footer-link">
        <div className="footer-item">Records/History</div>
      </Link>
    </footer>
  );
}

export default Footer;

