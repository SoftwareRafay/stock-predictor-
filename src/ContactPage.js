import React, { useEffect } from 'react';
import './ContactPage.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// New coordinates for the address
const location = [51.078621, -114.136719]; // Calgary coordinates

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function ContactPage() {
  useEffect(() => {
    // Function to inject Leaflet CSS
    const injectLeafletCSS = () => {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    };

    // Inject Leaflet CSS
    injectLeafletCSS();
  }, []);

  return (
    <div className="contact-container">
      <div className="left-side">
        <h1>Leave us your info</h1>
        <p className="description">
        We value your thoughts, inquiries, and feedback. Please feel free to reach out to us with any questions or comments you may have. We're here to assist you and ensure you have the best experience possible. Your connection is important to us.
        </p>
        <form className="contact-form">
          <div className="form-group">
            <input type="text" placeholder="Full Name*" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email*" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Subject*" required />
          </div>
          <div className="form-group">
            <textarea placeholder="Message*" rows="5" required></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="right-side">
        <div className="social-media">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="location">
          <h2>Location</h2>
          <p className='address'> <FaMapMarkerAlt /> 2500 University Dr NW<br />Calgary, AB T2N 1N4, Canada</p>
          <p><FaPhoneAlt /> contact@stockinsight.com</p>
          <p><FaEnvelope /> (012)-345-6789</p>
        </div>

        <div className="map">
          <h2>Map</h2>
          <MapContainer center={location} zoom={15} style={{ height: '300px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={location} icon={customIcon}>
              <Popup>
                2500 University Dr NW, Calgary, AB T2N 1N4, Canada
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
