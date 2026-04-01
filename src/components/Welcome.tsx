import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => navigate('/services');

  return (
    <div className="welcome-root bg-white min-h-screen overflow-hidden relative flex flex-col items-center justify-center">
      
      <img
        src="landing.svg"
        alt="cut"
        className="w-[40%] object-cover"
      />

      {showButton && (
        <div className="hero-cta fixed bottom-11 inset-x-0 flex justify-center animate-slide-up">
          <button
            className="bg-black p-3 rounded-2xl text-white"
            onClick={handleGetStarted}
          >
            Get Started →
          </button>
        </div>
      )}

    </div>
  );
};

export default Welcome;