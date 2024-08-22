import React from 'react';
import './AboutPage.css'; // Ensure you have this CSS file

function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Us</h1>
        <p>We provide solutions for efficient stock management</p>
      </div>

      <div className="second-about">
        <div className="left">
          <p>Read The Story Behind Our Success</p>
        </div>
        <div className="right">
          <p>We provide solutions for efficient stock management, helping you to keep track of your investments with ease and precision.</p>
          <p>Our platform offers advanced tools and insights for analyzing stock trends, optimizing your portfolio, and making informed decisions.</p>
          <p>Join us to take control of your financial future with confidence.</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
