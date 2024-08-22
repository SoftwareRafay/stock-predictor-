// src/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css'; // For styling

function Header() {
  const location = useLocation();

  return (
    <div className="homepage-header">
      <nav className="navbar">
        <ul className='navbar-list'>
          <li className='logo-container'>
            <Link to='/'>
              <img src={`${process.env.PUBLIC_URL}/logo-photoaidcom-cropped.png`} alt="StockInsight Logo" className="logo" />
            </Link>
          </li>
          
          <li className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/">🏠︎ Home</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link to="/about">About</Link>
          </li>
          <li className={`navbar-item services ${location.pathname.startsWith('/services') ? 'active' : ''}`}>
            Services 
            <ul className="dropdown">
              <li className={`${location.pathname === '/portfolio' ? 'active' : ''}`}>
                <Link to="/portfolio">Portfolio</Link>
              </li>
              <li className={`${location.pathname === '/Predict' ? 'active' : ''}`}>
                <Link to="/Predict">Predict</Link>
              </li>
              <li className={`${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </li>
          <li className={`navbar-item ${location.pathname === '/currency-converter' ? 'active' : ''}`}>
            <Link to="/currency-converter">Currency Converter</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/contact' ? 'active' : ''}`}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
