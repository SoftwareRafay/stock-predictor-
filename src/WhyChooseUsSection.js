import React, { useState } from 'react';
import './WhyChooseUsSection.css';

function WhyChooseUsSection() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="why-choose-us-container">
      <div className="left-container">
        <p className="title">Why Choose Us?</p>
      </div>
      <div className="right-container">
        <div className="section-box" onClick={() => toggleSection('section1')}>
          <div className={`toggle-box ${activeSection === 'section1' ? 'active' : ''}`}>
            {activeSection === 'section1' ? '-' : '+'}
          </div>
          <div className="heading">Advanced Stock Predictions</div>
        </div>
        {activeSection === 'section1' && (
          <div className="section-content">
            <p>
              Our platform utilizes state-of-the-art machine learning models to provide accurate stock market predictions. With our advanced algorithms, you can make informed investment decisions and maximize your portfolio returns. By analyzing vast amounts of market data, historical trends, and real-time fluctuations, our models deliver predictions that help you stay ahead of the market. Whether you're a seasoned investor or just starting out, our tools empower you to make smarter, data-driven decisions that align with your financial goals.
            </p>
          </div>
        )}

        <div className="section-box" onClick={() => toggleSection('section2')}>
          <div className={`toggle-box ${activeSection === 'section2' ? 'active' : ''}`}>
            {activeSection === 'section2' ? '-' : '+'}
          </div>
          <div className="heading">Personalized Portfolio Management</div>
        </div>
        {activeSection === 'section2' && (
          <div className="section-content">
            <p>
              Our personalized portfolio management tools allow you to track and optimize your investments in real-time. Tailor your portfolio based on your risk appetite and financial goals, with expert recommendations at your fingertips. With comprehensive analytics and insights, you can monitor your portfolio's performance, rebalance assets, and make strategic adjustments. Our intuitive interface ensures that you have the information you need to manage your investments effectively, whether you're focused on growth, income, or long-term security.
            </p>
          </div>
        )}

        <div className="section-box" onClick={() => toggleSection('section3')}>
          <div className={`toggle-box ${activeSection === 'section3' ? 'active' : ''}`}>
            {activeSection === 'section3' ? '-' : '+'}
          </div>
          <div className="heading">Cutting-Edge Technology</div>
        </div>
        {activeSection === 'section3' && (
          <div className="section-content">
            <p>
              We leverage cutting-edge technology to ensure fast, secure, and reliable performance. Our platform is designed to handle large datasets and provide you with the most up-to-date market insights. From advanced encryption to ensure your data's security to high-speed processing that delivers results in real-time, our technology is at the forefront of the industry. We continuously invest in our infrastructure to enhance speed, reliability, and user experience, ensuring that you can focus on what matters most: making the right investment decisions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhyChooseUsSection;
