import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { mockServices } from '../utils/data';
import { Service } from '../types';

// ── Shimmer skeleton for a single service card ────────────────────────────────
const ServiceCardSkeleton: React.FC = () => (
  <div className="break-inside-avoid mb-3 rounded-md overflow-hidden bg-white shadow-sm">
    {/* image placeholder */}
    <div className="w-full h-56 skeleton-shimmer" />
    {/* content placeholders */}
    <div className="p-4 space-y-2">
      <div className="skeleton-shimmer h-4 w-2/3 rounded" />
      <div className="skeleton-shimmer h-3 w-full rounded" />
      <div className="skeleton-shimmer h-3 w-4/5 rounded" />
      <div className="skeleton-shimmer h-3 w-1/3 rounded mt-1" />
      <div className="skeleton-shimmer h-8 w-full rounded-md mt-3" />
    </div>
  </div>
);

// ── Sort pill skeleton ────────────────────────────────────────────────────────
const SortSkeleton: React.FC = () => (
  <div className="flex gap-2 pt-7 mt-5">
    {[80, 60, 80].map((w, i) => (
      <div key={i} className="skeleton-shimmer h-6 rounded-full" style={{ width: w }} />
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ServiceCatalog: React.FC = () => {
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'duration'>('popular');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate the brief moment while images + data are "arriving"
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

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
      {/* Shimmer keyframe injected once */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite linear;
        }
      `}</style>

      <div className="bg-white">
        {/* Fixed header */}
        <div className="font-semibold text-xl w-full bg-white fixed top-0 left-0 z-50 p-3">
          Services
        </div>

        {loading ? (
          /* ── Skeleton state ── */
          <div className="pt-4">
            <SortSkeleton />
            <div className="columns-1 sm:columns-2 md:columns-3 gap-3 mt-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          /* ── Real content ── */
          <>
            {/* Sort Controls */}
            <div className="flex gap-2 pt-7 mt-5">
              {(['popular', 'price', 'duration'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-1 rounded-full text-xs font-medium backdrop-blur-sm capitalize transition-colors duration-200 ${
                    sortBy === option
                      ? 'bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] shadow-md text-white'
                      : 'bg-white shadow-md text-black hover:bg-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Service Cards — Masonry */}
            <div className="columns-1 sm:columns-2 md:columns-3 gap-3 mt-10">
              {sortedServices.map((service) => (
                <div
                  key={service.id}
                  className="break-inside-avoid mb-3 rounded-md bg-gray-500/20 backdrop-blur-sm overflow-hidden"
                >
                  {service.image && (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      {service.popular && (
                        <span className="absolute top-3 right-3 bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] text-white text-xs font-light px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-sm font-semibold text-black">{service.name}</h2>
                    </div>
                    <p className="text-black text-sm mb-2">{service.description}</p>
                    <p className="font-light text-sm text-black mb-3">
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
          </>
        )}
      </div>

    
    </>
  );
};

export default ServiceCatalog;