import React, { useState, useEffect, useRef } from 'react';
import './StatsSection.css'; // Ensure you have this CSS file

function StatsSection() {
  const [allTimeClients, setAllTimeClients] = useState(0);
  const [clientsThisYear, setClientsThisYear] = useState(0);
  const [avgProfitIncrease, setAvgProfitIncrease] = useState(0);
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !hasAnimated) {
        startIncrementing();
        setHasAnimated(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.5, 
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const startIncrementing = () => {
    const incrementNumbers = (setter, target) => {
      let currentNumber = 0;
      const incrementStep = Math.ceil(target / 100);
      const interval = setInterval(() => {
        currentNumber += incrementStep;
        if (currentNumber >= target) {
          clearInterval(interval);
          setter(target); 
        } else {
          setter(currentNumber);
        }
      }, 20); 
    };

    incrementNumbers(setAllTimeClients, 1000);
    incrementNumbers(setClientsThisYear, 271);
    incrementNumbers(setAvgProfitIncrease, 45);
  };

  return (
    <div className="stats-container" ref={statsRef}>
      <div className="stats-item">
        <h2>{allTimeClients}</h2>
        <p>All Time Clients</p>
      </div>
      <div className="stats-item">
        <h2>{clientsThisYear}</h2>
        <p>Clients In This Year</p>
      </div>
      <div className="stats-item">
        <h2>{avgProfitIncrease}%</h2>
        <p>Avg Profit Increased</p>
      </div>
    </div>
  );
}

export default StatsSection;
