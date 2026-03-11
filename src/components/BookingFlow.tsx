import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Service, Booking } from '../types';
import NavBar from './NavBar';

const steps = ['Service', 'Time', 'Info', 'Confirm'];

const BookingFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState<{ date: string; time: string } | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    specialRequests: '',
  });
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full' | 'cash'>('deposit');
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from localStorage
    const serviceData = localStorage.getItem('selectedService');
    const bookingDataStr = localStorage.getItem('bookingData');

    if (serviceData) {
      setSelectedService(JSON.parse(serviceData));
    }
    if (bookingDataStr) {
      setBookingData(JSON.parse(bookingDataStr));
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = async () => {
    // Mock booking creation
    const newBooking: Booking = {
      id: Date.now().toString(),
      serviceId: selectedService!.id,
      date: bookingData!.date,
      time: bookingData!.time,
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      specialRequests: customerInfo.specialRequests,
      paymentOption,
      status: 'pending',
      totalPrice: selectedService!.price,
    };

    // Send booking to backend server
    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newBooking.id,
          serviceName: selectedService!.name,
          date: newBooking.date,
          time: newBooking.time,
          customerName: newBooking.customerName,
          phone: newBooking.phone,
          address: newBooking.address,
          specialRequests: newBooking.specialRequests,
          paymentOption: newBooking.paymentOption,
          status: newBooking.status,
          totalPrice: newBooking.totalPrice,
        }),
      });

      if (response.ok) {
        console.log('Booking saved to server');
      } else {
        console.error('Failed to save booking to server');
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
    }

    // In real app, this would be an API call
    console.log('New booking:', newBooking);
    alert('Booking confirmed! You will receive a confirmation SMS/WhatsApp.');

    // Clear localStorage
    localStorage.removeItem('selectedService');
    localStorage.removeItem('bookingData');

    navigate('/payment');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div  >
            <h2 className="text-xl glass backdrop-blur-sm mt-10 text-gray-700 tracking-wide bg-white/80 p-3 rounded-md mb-3 text-center">
              Confirm Your Service
            </h2>
            {selectedService && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-bold text-gray-800">{selectedService.name}</h3>
                <p className="text-gray-600 mt-1">{selectedService.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  ${selectedService.price} • {selectedService.duration} minutes
                </p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl   mt-4  text-gray-700 tracking-wide p-3 rounded-md mb-3 text-center">
              Confirm Date & Time
            </h2>
            {bookingData && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-700">
                  Date: {new Date(bookingData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-700 mt-1">Time: {bookingData.time}</p>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name 
                </label>
                <input
                  id="name"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                  className="w-full px-3 py-3 text-md neu-inset backdrop-blur-sm font-thin text-gray-700 tracking-wide shadow-md bg-white/10 p-6 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                  className="w-full px-3 py-3 text-md neu-inset backdrop-blur-sm font-thin text-gray-700 tracking-wide shadow-md bg-white/10 p-6 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Place
                </label>
                <textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  required
                  rows={2}
                  className="w-full px-3 py-3 text-md neu-inset backdrop-blur-sm font-thin text-gray-700 tracking-wide shadow-md bg-white/10 p-6 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder=""
                />
              </div>
              
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl text-gray-800 mb-4">
              Summary & Payment
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Booking Details
              </h3>
              <p className="text-gray-700">Service: {selectedService?.name}</p>
              <p className="text-gray-700">
                Date: {bookingData && new Date(bookingData.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">Time: {bookingData?.time}</p>
              <p className="text-gray-700">Name: {customerInfo.name}</p>
              <p className="text-gray-700">Phone: {customerInfo.phone}</p>
              <p className="text-gray-700">Address: {customerInfo.address}</p>
              {customerInfo.specialRequests && (
                <p className="text-gray-700">Special Requests: {customerInfo.specialRequests}</p>
              )}
              <p className="text-xl font-bold text-gray-800 mt-4">
                Total: ${selectedService?.price}
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Payment Option
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="deposit"
                  checked={paymentOption === 'deposit'}
                  onChange={(e) => setPaymentOption(e.target.value as typeof paymentOption)}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-gray-700">
                  Deposit (${Math.round(selectedService!.price * 0.3)}) - Required to secure slot
                  <span className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-full">
    soon!
  </span>
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="full"
                  checked={paymentOption === 'full'}
                  onChange={(e) => setPaymentOption(e.target.value as typeof paymentOption)}
                  className="w-4 h-4 text-orange-600"
                />
                <span className="text-gray-700">
                  Pay full amount now (${selectedService!.price}) {`  `} {
  <span className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-full">
    soon!
  </span>}
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentOption === 'cash'}
                  onChange={(e) => setPaymentOption(e.target.value as typeof paymentOption)}
                  className="w-4 h-4 text-orange-600"
                />
                <span className="text-gray-700">Cash on arrival </span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <div  className="min-h-screen bg-cover bg-center bg-no-repeat"
     >
    <div className="container mx-auto px-4 py-8 max-w-3xl">
       
      <h1 className="text-xl mt-10 font-bold text-gray-700 tracking-wide shadow-md bg-white p-6 rounded-md mb-3 text-center">
        Book Your Appointment
      </h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index < activeStep
                    ? 'bg-green-600 text-white'
                    : index === activeStep
                      ? 'bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {index < activeStep ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-1 ${index === activeStep ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-grow h-1 mx-2 ${index < activeStep ? 'bg-green-600' : 'bg-gray-200'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        {renderStepContent(activeStep)}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className={`
            px-6 py-2 rounded-md font-medium transition-colors duration-200
            ${activeStep === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          Back
        </button>
        <button
          onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
          className="bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C] hover:bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C] text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
        >
          {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
        </button>
      </div>
    </div>
   
    </div>
     <NavBar /></>
  );
};

export default BookingFlow;
