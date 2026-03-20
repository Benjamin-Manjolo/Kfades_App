import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/services');
  };

  return (
    <div className="h-screen w-full relative">
      

      

      {/* Content - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 md:pb-16">
        <div className="max-w-lg">
          {/* KFADES - Large Bold Uppercase */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-black uppercase ">
            KFADES
          </h1>
          
          {/* Upscale your looks - Medium black Text */}
          <p className="text-lg md:text-xl text-black">
            Upscale your looks
          </p>
          
          {/* come get a cut - Small Italic Light black */}
          <p className="text-sm text-gray-300 mb-3">
            come get a cut
          </p>

          {/* Get Started Button */}
          <button
            onClick={handleGetStarted}
            className="text-black text-center rounded-xl shadow-md bg-orange-500 p-3"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

