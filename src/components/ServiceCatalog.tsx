import React, { useState } from 'react';
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
    // Store selected service in localStorage or context
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate('/calendar');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Our Services
      </h1>

      <div className="mb-6 flex justify-center">
        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">Sort by</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="popular">Popular</option>
            <option value="price">Price</option>
            <option value="duration">Duration</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {service.image && (
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {service.name}
                </h2>
                {service.popular && (
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {service.description}
              </p>
              <p className="font-bold text-gray-800 mb-3">
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
  );
};

export default ServiceCatalog;
