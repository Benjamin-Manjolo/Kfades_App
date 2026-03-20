import React from 'react';
import NavBar from './NavBar';

const BarberInspo: React.FC = () => {
  const images = [
    '1.png', '3.png', '4.png', '5.png',
    '6.png', '7.png', '8.png', '9.png', '10.png'
  ];

  // Split images into two columns
  const leftImages = images.filter((_, i) => i % 2 === 0);
  const rightImages = images.filter((_, i) => i % 2 !== 0);

  return (
    <>
      <style>{`
        @keyframes scrollDown {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        @keyframes scrollUp {
          0%   { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-down {
          animation: scrollDown 18s linear infinite;
        }
        .animate-scroll-up {
          animation: scrollUp 18s linear infinite;
        }
        .scroll-col:hover .animate-scroll-down,
        .scroll-col:hover .animate-scroll-up {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="min-h-screen overflow-hidden"
        style={{
          backgroundImage: "url('/bgimage.png')",
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        <NavBar />

        <div className="container mx-auto px-2 pb-8">
          <h1 className="text-md font-semibold shadow-md bg-white/70 p-6 rounded-md text-center text-orange-500 mb-4">
            Haircut Inspirations
          </h1>

          {/* Perspective stage */}
          <div
            style={{
              perspective: '900px',
              perspectiveOrigin: '50% 40%',
            }}
          >
            <div
              style={{
                transform: 'rotateX(20deg)',
                transformStyle: 'preserve-3d',
              }}
              className="flex gap-3 h-[75vh]"
            >

              {/* LEFT column — scrolls DOWN */}
              <div
                className="scroll-col flex-1 overflow-hidden relative"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)',
                }}
              >
                <div className="animate-scroll-down flex flex-col gap-3">
                  {/* Original set */}
                  {leftImages.map((image, index) => (
                    <div key={index} className="break-inside-avoid bg-white rounded-xl shadow-md overflow-hidden">
                      <img
                        src={`/Barber-Inspo/${image}`}
                        alt={`Haircut ${index + 1}`}
                        className="w-full object-cover"
                      />
                    </div>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {leftImages.map((image, index) => (
                    <div key={`dup-${index}`} className="break-inside-avoid bg-white rounded-xl shadow-md overflow-hidden">
                      <img
                        src={`/Barber-Inspo/${image}`}
                        alt={`Haircut ${index + 1}`}
                        className="w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT column — scrolls UP */}
              <div
                className="scroll-col flex-1 overflow-hidden relative"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)',
                }}
              >
                <div className="animate-scroll-up flex flex-col gap-3">
                  {/* Original set */}
                  {rightImages.map((image, index) => (
                    <div key={index} className="break-inside-avoid bg-white rounded-xl shadow-md overflow-hidden">
                      <img
                        src={`/Barber-Inspo/${image}`}
                        alt={`Haircut ${index + 1}`}
                        className="w-full object-cover"
                      />
                    </div>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {rightImages.map((image, index) => (
                    <div key={`dup-${index}`} className="break-inside-avoid bg-white rounded-xl shadow-md overflow-hidden">
                      <img
                        src={`/Barber-Inspo/${image}`}
                        alt={`Haircut ${index + 1}`}
                        className="w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarberInspo;