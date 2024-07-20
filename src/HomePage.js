import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import img1 from './img1.jpg';
import img2 from './img2.jpeg';

function HomePage() {
  const [activeImage, setActiveImage] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);

  const images = [
    {
      src: img1,
      text1: 'Empowering you',
      text2: 'with data-driven insights',
      text3: 'We help managing money, provide stock insight.',
      links: [
        { text: 'Contact Us', to: '/contact' }
      ]
    },
    {
      src: img2,
      text1: 'StockInsight',
      text2: 'Invest with insight.',
      text3: 'We help managing money, provide stock insight.',
      links: [
        { text: 'Contact Us', to: '/contact' },
        { text: 'Learn More About Stocks', to: '/StockInfo' }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prevActiveImage) => (prevActiveImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, resetTimer]);

  const handlePrev = () => {
    setActiveImage((prevActiveImage) => (prevActiveImage - 1 + images.length) % images.length);
    setResetTimer((prev) => !prev);
  };

  const handleNext = () => {
    setActiveImage((prevActiveImage) => (prevActiveImage + 1) % images.length);
    setResetTimer((prev) => !prev);
  };

  return (
    <div className='main-body'>
      {images.map((image, index) => (
        <div key={index} className={`image-container ${index === activeImage ? 'active' : ''}`}>
          <img src={image.src} alt={`Slide ${index + 1}`} className='slide-image' />
          <div className='text-container'>
            <p className='txt1'>{image.text1} <br /> <span className='txt2'>{image.text2}</span><br/><span className='txt3'>{image.text3}</span></p>
            <div className='cont-button'>
              {image.links.map((link, linkIndex) => (
                <Link key={linkIndex} to={link.to}>
                  <button className='contact-button'>{link.text}</button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button className='nav-button left' onClick={handlePrev}>&#10094;</button>
      <button className='nav-button right' onClick={handleNext}>&#10095;</button>
    </div>
  );
}

export default HomePage;
