import React, { useState } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { mockServices, NavbarItems } from '../utils/data';
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
    // Store selected service in localStorage or context
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate('/calendar');
  };

  return (
    <>
   
    <div className="container bg-[#333333] mx-auto px-4 py-8">
      <NavBar/>
      

      <div className="mb-6 flex justify-center">
       
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedServices.map((service) => (
          <div key={service.id} className="bg-[#333333] rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-64 overflow-hidden">
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-white">
                  {service.name}
                </h2>
                {service.popular && (
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-white text-sm mb-3">
                {service.description}
              </p>
              <p className="font-bold text-white mb-3">
                ${service.price} • {service.duration} min
              </p>
              <button
                onClick={() => handleBookNow(service)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-auto"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
  
};

export default ServiceCatalog;
