import React from 'react';
import NavBar from './NavBar';

const BarberInspo: React.FC = () => {
  const images = [
      '1.png',
      '3.png',
      '4.png',  
      '5.png',
      '6.png',
      '7.png',  
      '8.png',
      '9.png',
      '10.png'
  ];

  return (
    <div className="container mx-auto "
    style={{ backgroundImage: "url('/bgimage.png')" }}>
       <NavBar/>
      <h1 className="text-md font-semibold shadow-md bg-white/70 p-6 rounded-md text-center text-orange-500 mb-2">
        Haircut Inspirations
      </h1>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-2 p-2">
        {images.map((image, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md m-2 overflow-hidden">
            <img
              src={`/Barber-Inspo/${image}`}
              alt={`Haircut ${index + 1}`}
              className="w-full h-58 object-cover"
            />
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberInspo;
