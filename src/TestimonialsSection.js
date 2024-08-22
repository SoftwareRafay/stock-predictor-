import React, { useState } from 'react';
import './TestimonialsSection.css';

function TestimonialsSection() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const testimonials = [
    {
      text: "Using this stock prediction platform has completely transformed the way I manage my investments. The predictions are incredibly accurate, and the portfolio management tools are top-notch! I've been able to make more informed decisions and optimize my portfolio with ease. The interface is intuitive and user-friendly, making it accessible even for those new to stock trading. Highly recommended for anyone looking to gain a competitive edge in the market!",
      author: "John Doe",
      position: "CEO, InvestSmart"
    },
    {
      text: "The portfolio insights and detailed analytics provided by this platform have given me a significant advantage in the market. The accuracy of the predictions is remarkable, and the depth of the data available is unparalleled. I particularly appreciate the advanced analytics features that help me track market trends and make strategic investments. This platform has become an essential tool in my investment strategy and I can't imagine managing my portfolio without it!",
      author: "Jane Smith",
      position: "CFO, WealthCorp"
    }
  ];

  const handleDotClick = (index) => {
    setFade(false);
    setTimeout(() => {
      setTestimonialIndex(index);
      setFade(true);
    }, 300);
  };

  return (
    <div className="testimonials-container">
      <h2>Clients' Testimonials</h2>
      <div className={`testimonial-content ${fade ? 'fade-in' : 'fade-out'}`}>
        <p>"{testimonials[testimonialIndex].text}"</p>
        <div className="testimonial-author">
          <strong>{testimonials[testimonialIndex].author}</strong>
          <p>{testimonials[testimonialIndex].position}</p>
        </div>
      </div>
      <div className="testimonial-navigation">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`nav-dot ${testimonialIndex === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialsSection;
