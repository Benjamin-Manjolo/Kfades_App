import React, { useState } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { mockServices } from '../utils/data';
import { Service } from '../types';

const ServiceCatalog: React.FC = () => {
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'duration'>('popular');
  const navigate = useNavigate();

  const sortedServices = [...mockServices].sort((a, b) => {
    if (sortBy === 'popular') {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.duration - b.duration;
    return 0;
  });

  const handleBookNow = (service: Service) => {
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate('/calendar');
  };

  return (
    <>
    <div className=''>
    
       <div className="blob blob-pink" />
        <div className="blob blob-blue" />
        <div className="blob blob-teal" />
       <div className='m-0 '>
     
       <h1 className="text-[20px] font-semibold  text-cyan-400 animate-[neonGlow_1.5s_ease-in-out_infinite_alternate]">
      KURUPT
  </h1>
  <h1 className="text-md font-bold tracking-widest text-cyan-400 animate-[neonGlow_1.5s_ease-in-out_infinite_alternate]">
      Barbershop
  </h1>
      {/* Sort Controls */}
      <div className="flex gap-2 mb-6 pt-4 mt-5">
       
        {(['popular', 'price', 'duration'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm capitalize transition-colors duration-200 ${
              sortBy === option
                ? 'bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] to-[#333333] shadow-md text-white'
                : 'bg-white shadow-md text-black hover:bg-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Service Cards - Masonry Style */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-3 mt-10">
        {sortedServices.map((service) => (
          <div
            key={service.id}
            className="break-inside-avoid mb-3 rounded-md bg-gray-500/20 backdrop-blur-sm overflow-hidden"
          >
            {/* Image */}
            {service.image && (
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
             
                {/* Popular badge */}
                {service.popular && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] to-[#333333] text-white text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-black">
                  {service.name}
                </h2>
              </div>
              <p className="text-white mb-2">
                {service.description}
              </p>
              <p className="font-semibold text-white mb-3">
                MWK {service.price} • {service.duration} min
              </p>
              <button
                onClick={() => handleBookNow(service)}
                className="w-full bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] hover:bg-[#333333] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
   
    </div>
    </div>
     <NavBar/>
    </>
  );
};

export default ServiceCatalog;