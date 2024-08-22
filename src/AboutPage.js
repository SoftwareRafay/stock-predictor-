import React from 'react';
import AboutPage from './About'; // Your existing AboutPage component
import StatsSection from './StatsSection'; // The StatsSection component
import WhyChooseUsSection from './WhyChooseUsSection';
import TestimonialsSection from './TestimonialsSection';

function App() {
  return (
    <div>
      <AboutPage />
      <StatsSection />
      <WhyChooseUsSection/>
      <TestimonialsSection/>
    </div>
  );
}

export default App;
