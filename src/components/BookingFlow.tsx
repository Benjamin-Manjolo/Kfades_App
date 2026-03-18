import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Service, Booking } from '../types';
import NavBar from './NavBar';
import paymentService, { PaymentInitData } from "../services/paymentService";



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


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const generateTxRef = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TX_${timestamp}_${random}`;
  };
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

 const handlePay = async () => {
  if (!selectedService) return;

  setIsLoading(true);
  setError(null);

  try {
    const paymentData: PaymentInitData = {
      amount: selectedService.price,
      tx_ref: generateTxRef(),
      first_name: customerInfo.name,
      last_name: "customer",
      email: "customer@email.com",
      callback_url: "http://localhost:3001/paychangu/callback",
      return_url: "http://localhost:3000/checkout",
    };

    console.log("Initiating payment:", paymentData);

    const response = await paymentService.initiateTransaction(paymentData);

    if (response.error) {
      setError(response.message || "Payment failed");
      return;
    }

    if (response.data?.data?.checkout_url) {
      window.location.href = response.data.data.checkout_url;
    }

  } catch (err) {
    console.error("Payment error:", err);
    setError("Payment failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
  
  const handleFinish = async () => {
    // Mock booking creation
    const newBooking: Booking = {
      id: generateTxRef(),
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

    navigate('/checkout');
  };
  
  const handleConfirmBooking = async () => {
  await handleFinish();  // save booking
  await handlePay();     // start payment
};

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div  >
            <h2 className="text-xl mt-10 text-white  tracking-wide bg-black p-3 rounded-md mb-3  text-center">
              Confirm Your Service
            </h2>
            {selectedService && (
              <div className="bg-[#151B23] rounded-lg shadow-md p-4">
                <h3 className="text-xl font-bold text-white">{selectedService.name}</h3>
                <p className="text-white mt-1">{selectedService.description}</p>
                <p className="text-white text-sm mt-2">
                  ${selectedService.price} • {selectedService.duration} minutes
                </p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl   mt-4  bg-[#0D1117] border-2 border-[#3B424A] text-white tracking-wide p-3 rounded-md mb-3 text-center">
              Confirm Date & Time
            </h2>
            {bookingData && (
              <div className="bg-[#0D1117] border-t-2 border-b-2 border-[#3B424A] rounded-lg shadow-md p-4">
                <p className="text-white ">
                  Date: {new Date(bookingData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-white mt-1">Time: {bookingData.time}</p>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Your Information
            </h2>
            <div className="grid grid-cols-1 bg-[#0D1117] md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                  Full Name 
                </label>
                <input
                  id="name"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                  className="w-full px-3 py-3 text-md neu-inset backdrop-blur-sm font-thin text-white tracking-wide shadow-md bg-[#0D1117/10 p-6 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                  className="w-full px-3 py-3 text-md neu-inset backdrop-blur-sm font-thin text-white tracking-wide shadow-md bg-[#0D1117/10 p-6 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
                  Place
                </label>
                <textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  required
                  rows={2}
                  className="w-full px-3 py-3 text-md neu-inset backdrop-blur-sm font-thin text-white tracking-wide shadow-md bg-[#0D1117/10 p-6 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder=""
                />
              </div>
              
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl border-2 rounded-md border-[#3B424A] p-3 text-white mb-4">
              Summary & Payment
            </h2>
            <div className="bg-[#151B23] border-2 rounded-md border-[#3B424A] rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Booking Details
              </h3>
              <p className="text-white">Service: {selectedService?.name}</p>
              <p className="text-white">
                Date: {bookingData && new Date(bookingData.date).toLocaleDateString()}
              </p>
              <p className="text-white">Time: {bookingData?.time}</p>
              <p className="text-white">Name: {customerInfo.name}</p>
              <p className="text-white">Phone: {customerInfo.phone}</p>
              <p className="text-white">Address: {customerInfo.address}</p>
              {customerInfo.specialRequests && (
                <p className="text-white">Special Requests: {customerInfo.specialRequests}</p>
              )}
              <p className="text-xl font-bold text-white mt-4">
                Total: ${selectedService?.price}
              </p>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">
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
                  className="w-4 h-4 peer"
                />
                <span className="text-white peer-checked:text-black">
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
                  className="w-4 h-4 peer"
                />
                <span className="text-white peer-checked:text-black">
                  Pay full amount now (${selectedService!.price}) {`  `} {
  <span className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-full">
    soon!
  </span>}
                </span>
              </label>
              <label className="flex items-center hover:text-black space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentOption === 'cash'}
                  onChange={(e) => setPaymentOption(e.target.value as typeof paymentOption)}
                  className="w-4 h-4 peer"
                />
                <span className="text-white peer-checked:text-black">Cash on arrival </span>
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
    
   
       <div className="blob blob-pink" />
        <div className="blob blob-blue" />
        <div className="blob blob-teal" />
    
    <div className="">
      
       
      <h1 className="text-xl mt-10 font-bold backdrop-blur-sm text-white tracking-wide shadow-md bg-[#0D1117 p-6 rounded-md mb-3 text-center">
        Book Your Appointment
      </h1>

      {/* Stepper */}
      <div className="flex items-center justify-between backdrop-blur-sm  mb-8 px-4">
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full backdrop-blur-sm  flex items-center justify-center text-sm font-medium
                  ${index < activeStep
                    ? 'bg-green-600 text-white'
                    : index === activeStep
                      ? 'bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] text-white'
                      : 'bg-gray-200 text-white-600'
                  }
                `}
              >
                {index < activeStep ? '✓' : index + 1}
              </div>
              <span className={`text-xs backdrop-blur-sm  mt-1 ${index === activeStep ? 'text-white font-medium' : 'text-white-500'}`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-grow backdrop-blur-sm  h-1 mx-2 ${index < activeStep ? 'bg-green-600' : 'bg-gray-200'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-[#0D1117] backdrop-blur-sm m-1 border-2 border-[#3D444D] rounded-lg p-6 mb-6">
        {renderStepContent(activeStep)}
      </div>

      <div className="flex justify-between backdrop-blur-sm mb-24">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className={`
            px-6 py-2 rounded-md font-medium backdrop-blur-sm  transition-colors duration-200
            ${activeStep === 0
              ? 'text-white-400 cursor-not-allowed'
              : 'text-white hover:bg-gray-100'
            }
          `}
        >
          Back
        </button>
        <button
         onClick={activeStep === steps.length - 1 ? handleConfirmBooking : handleNext}
          className="bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] hover:bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] text-white font-semibold py-2 px-6 rounded-md transition-colors backdrop-blur-sm  duration-200"
        >
          {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
        </button>
      </div>
    </div>
    <NavBar/>
    </>
    
   
   
    
  );
};

export default BookingFlow;
