// Footer.js
import React from 'react';
import './Footer.css'; 
import { Link } from 'react-router-dom';
import FooterBottom from './FooterBottom'; // Import the FooterBottom component
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => (
    <div>
    <footer className="footer">
        <div className="footer-container">
            {/* Logo and About Section */}
            <div className="footer-section about">
                <div className="logo-cont">
                    <img src={`${process.env.PUBLIC_URL}/logo-photoaidcom-cropped.png`} alt="StockInsight Logo" className="log" />
                    <h1 className="logo-tex">StockInsight</h1>
                </div>
                <p>
                    <FaMapMarkerAlt /> 2500 University Dr NW Calgary, AB<br />
                    <FaPhoneAlt /> (012)-345-6789 <br />
                    <FaEnvelope /> <a href="mailto:contact@stockinsight.com">contact@stockinsight.com</a>
                </p>
            </div>

            {/* Useful Links Section */}
            <div className="footer-section links">
                <h2>Useful Links</h2>
                <ul>
                    <li className="nav-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about">About</Link>
                    </li>
                    <li className="nav-item serv">
                        Services
                        <ul className="ser-drop">
                            <li>
                                <Link to="/portfolio">Portfolio</Link>
                            </li>
                            <li>
                                <Link to="/predict">Predict</Link>
                            </li>
                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link to="/currency-converter">Currency Converter</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
            </div>

            {/* Contact Form Section */}
            <div className="footer-section contact-form">
                <h2>Contact Form</h2>
                <form>
                    <input
                        type="text"
                        name="name"
                        className="text-input contact-input"
                        placeholder="Full Name*"
                    />
                    <input
                        type="email"
                        name="email"
                        className="text-input contact-input"
                        placeholder="Email*"
                    />
                    <textarea
                        name="message"
                        className="text-input contact-input"
                        placeholder="Message*"
                    ></textarea>
                    <button type="submit" className="btn btn-big contact-btn">
                        Submit Now
                    </button>
                </form>
            </div>
        </div>

       
       
    </footer>
    <FooterBottom />
    </div>
);

export default Footer;
