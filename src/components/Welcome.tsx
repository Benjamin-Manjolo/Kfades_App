import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/services');
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/kfades.mp4" type="video/mp4" />
      </video>

      {/* Dark Gradient Overlay - bottom 60% */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent" 
           style={{ background: 'linear-gradient(to top, black 0%, black 15%, transparent 100%)' }}>
      </div>

      {/* Content - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 md:pb-16">
        <div className="max-w-lg">
          {/* KFADES - Large Bold Uppercase */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-2">
            KFADES
          </h1>
          
          {/* Upscale your looks - Medium White Text */}
          <p className="text-lg md:text-xl text-white mb-1">
            Upscale your looks
          </p>
          
          {/* come get a cut - Small Italic Light White */}
          <p className="text-sm text-gray-300 italic mb-6">
            come get a cut
          </p>

          {/* Get Started Button */}
          <button
            onClick={handleGetStarted}
            className="w-full md:w-auto bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
