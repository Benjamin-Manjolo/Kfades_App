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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8"
     
    >
      <NavBar />

      {/* Sort Controls */}
      <div className="flex gap-2 mb-6 pt-4 mt-10">
        {(['popular', 'price', 'duration'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-4 py-1 rounded-full text-sm font-medium capitalize transition-colors duration-200 ${
              sortBy === option
                ? 'bg-orange-400 text-black/90'
                : 'bg-gray-800 text-white hover:bg-gray-700'
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
            className="break-inside-avoid mb-3 bg-black/90 rounded-xl overflow-hidden shadow-md"
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
                  <span className="absolute top-3 right-3 bg-orange-400 text-black/90 text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-semibold text-white">
                  {service.name}
                </h2>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                {service.description}
              </p>
              <p className="font-bold text-orange-400 mb-3">
                MWK {service.price} • {service.duration} min
              </p>
              <button
                onClick={() => handleBookNow(service)}
                className="w-full bg-orange-400 hover:bg-orange-500 text-black/90 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCatalog;