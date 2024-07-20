// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: For styling

function Header() {
  return (
    <div className="homepage-header">
      <nav className="navbar">
      
        <ul className='navbar-list'>
          <li className='logo-container'><img src={`${process.env.PUBLIC_URL}/logo.png`} alt="StockInsight Logo" className="logo"/></li>
         
          <li className="navbar-item"><Link to = "/">🏠︎ Home</Link></li>
          <li className="navbar-item"><Link to = "/about">About</Link></li>
          <li className="navbar-item services">
            Services 
            <ul className="dropdown">
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/Predict">Predict</Link></li>
            </ul>
          </li>
          <li className="navbar-item"><Link to = "/currency-converter">Currency Converter</Link></li>
          <li className="navbar-item"><Link to = "/contact">Contact</Link></li>
        </ul>

      </nav>
    </div>
  );
}

export default Header;
