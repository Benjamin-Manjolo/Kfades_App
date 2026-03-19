import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Service, Booking } from '../types';
import NavBar from './NavBar';
import paymentService, { PaymentInitData } from "../services/paymentService";

// ─── Toast Notification System ───────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

const toastStyles: Record<ToastType, { bar: string; icon: string; label: string }> = {
  success: { bar: 'bg-emerald-500', icon: '✓', label: 'text-emerald-400' },
  error:   { bar: 'bg-red-500',     icon: '✕', label: 'text-red-400'     },
  warning: { bar: 'bg-amber-500',   icon: '⚠', label: 'text-amber-400'   },
  info:    { bar: 'bg-blue-500',    icon: 'i', label: 'text-blue-400'    },
};

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
    {toasts.map((toast) => {
      const s = toastStyles[toast.type];
      return (
        <div
          key={toast.id}
          className="relative bg-[#1C2333] border border-[#3D444D] rounded-lg overflow-hidden shadow-2xl animate-slide-in"
        >
          {/* Colored left bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar}`} />
          <div className="pl-4 pr-3 py-3 flex items-start gap-3">
            <span className={`text-sm font-bold mt-0.5 ${s.label}`}>{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">{toast.title}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-gray-500 hover:text-white text-xs mt-0.5 shrink-0 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Validation ───────────────────────────────────────────────────────────────

interface ValidationErrors {
  name?: string;
  phone?: string;
  address?: string;
}

function validateCustomerInfo(info: { name: string; phone: string; address: string }): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!info.name.trim()) errors.name = 'Full name is required';
  else if (info.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (!info.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^[+\d\s\-()]{7,15}$/.test(info.phone.trim())) errors.phone = 'Enter a valid phone number';

  if (!info.address.trim()) errors.address = 'Location / place is required';

  return errors;
}

// ─── Field Input ──────────────────────────────────────────────────────────────

const Field: React.FC<{
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label} <span className="text-red-400">*</span>
    </label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const steps = ['Service', 'Time', 'Info', 'Confirm'];

const BookingFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState<{ date: string; time: string } | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', specialRequests: '' });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full' | 'cash'>('deposit');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const navigate = useNavigate();

  // ── Toast helpers ──
  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const generateTxRef = () => `TX_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // ── Load from localStorage ──
  useEffect(() => {
    try {
      const serviceData = localStorage.getItem('selectedService');
      const bookingDataStr = localStorage.getItem('bookingData');
      if (serviceData) setSelectedService(JSON.parse(serviceData));
      if (bookingDataStr) setBookingData(JSON.parse(bookingDataStr));
    } catch {
      addToast('error', 'Data Error', 'Failed to load your saved session. Please start over.');
    }
  }, [addToast]);

  // ── Navigation ──
  const handleNext = () => {
    // Validate step 2 (Info) before proceeding
    if (activeStep === 2) {
      const errors = validateCustomerInfo(customerInfo);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        addToast('warning', 'Missing Information', 'Please fill in all required fields before continuing.');
        return;
      }
      setValidationErrors({});
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  // ── Payment ──
  const handlePay = async () => {
    if (!selectedService) {
      addToast('error', 'No Service Selected', 'Please go back and select a service.');
      return;
    }

    setIsLoading(true);
    try {
      const paymentData: PaymentInitData = {
        amount: selectedService.price,
        tx_ref: generateTxRef(),
        first_name: customerInfo.name,
        last_name: 'customer',
        email: 'customer@email.com',
        callback_url: 'http://localhost:3001/paychangu/callback',
        return_url: 'http://localhost:3000/checkout',
      };

      const response = await paymentService.initiateTransaction(paymentData);

      if (response.error) {
        addToast('error', 'Payment Failed', response.message || 'Unable to process payment. Please try again.');
        return;
      }

      if (response.data?.data?.checkout_url) {
        addToast('success', 'Redirecting', 'Taking you to the secure payment page...');
        setTimeout(() => { window.location.href = response.data.data.checkout_url; }, 800);
      } else {
        addToast('error', 'Payment Error', 'No checkout URL received. Please contact support.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      if (err?.message?.includes('Network') || err?.message?.includes('fetch')) {
        addToast('error', 'Connection Error', 'Check your internet connection and try again.');
      } else {
        addToast('error', 'Payment Failed', 'An unexpected error occurred. Please try again or use cash.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Booking ──
  const handleFinish = async () => {
    if (!selectedService || !bookingData) {
      addToast('error', 'Booking Error', 'Missing service or date information. Please start over.');
      return false;
    }

    const newBooking: Booking = {
      id: generateTxRef(),
      serviceId: selectedService.id,
      date: bookingData.date,
      time: bookingData.time,
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      specialRequests: customerInfo.specialRequests,
      paymentOption,
      status: 'pending',
      totalPrice: selectedService.price,
    };

    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newBooking.id,
          serviceName: selectedService.name,
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

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        addToast('warning', 'Booking Saved Locally', errData.message || 'Server error — your booking was noted but not fully saved. We\'ll follow up via SMS.');
        return true; // still continue
      }

      addToast('success', 'Booking Confirmed!', 'You\'ll receive a confirmation SMS/WhatsApp shortly.');
      localStorage.removeItem('selectedService');
      localStorage.removeItem('bookingData');
      return true;
    } catch (err: any) {
      console.error('Booking save error:', err);
      if (err?.message?.includes('Failed to fetch')) {
        addToast('warning', 'Offline Mode', 'Could not reach server. Your booking details are saved locally.');
        return true; // let them proceed
      }
      addToast('error', 'Booking Failed', 'Unable to save your booking. Please try again or call us directly.');
      return false;
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const saved = await handleFinish();
      if (!saved) return;

      if (paymentOption === 'cash') {
        navigate('/checkout');
        return;
      }

      await handlePay();
    } finally {
      setIsLoading(false);
    }
  };

  // ── Input class helper ──
  const inputClass = (error?: string) =>
    `w-full px-3 py-3 text-sm neu-inset backdrop-blur-sm font-thin text-white tracking-wide rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
      error
        ? 'border border-red-500 focus:ring-red-500 bg-red-950/10'
        : 'focus:ring-white bg-[#0D1117]'
    }`;

  // ── Step content ──
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-xl mt-10 text-white tracking-wide bg-black p-3 rounded-md mb-3 text-center">
              Confirm Your Service
            </h2>
            {selectedService ? (
              <div className="bg-[#151B23] rounded-lg shadow-md p-4">
                <h3 className="text-xl font-bold text-white">{selectedService.name}</h3>
                <p className="text-white mt-1">{selectedService.description}</p>
                <p className="text-white text-sm mt-2">
                  ${selectedService.price} • {selectedService.duration} minutes
                </p>
              </div>
            ) : (
              <div className="bg-red-950/30 border border-red-500/50 rounded-lg p-4 text-center">
                <p className="text-red-400 text-sm">⚠ No service selected. Please go back and choose a service.</p>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className="text-xl mt-4 bg-[#0D1117] border-2 border-[#3B424A] text-white tracking-wide p-3 rounded-md mb-3 text-center">
              Confirm Date & Time
            </h2>
            {bookingData ? (
              <div className="bg-[#0D1117] border-t-2 border-b-2 border-[#3B424A] rounded-lg shadow-md p-4">
                <p className="text-white">
                  Date: {new Date(bookingData.date).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
                <p className="text-white mt-1">Time: {bookingData.time}</p>
              </div>
            ) : (
              <div className="bg-amber-950/30 border border-amber-500/50 rounded-lg p-4 text-center">
                <p className="text-amber-400 text-sm">⚠ No date/time selected. Please go back to choose a slot.</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Your Information</h2>
            <div className="grid grid-cols-1 bg-[#0D1117] md:grid-cols-2 gap-4">
              <Field id="name" label="Full Name" error={validationErrors.name}>
                <input
                  id="name"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => {
                    setCustomerInfo({ ...customerInfo, name: e.target.value });
                    if (validationErrors.name) setValidationErrors(v => ({ ...v, name: undefined }));
                  }}
                  className={inputClass(validationErrors.name)}
                  placeholder="Enter your full name"
                />
              </Field>

              <Field id="phone" label="Phone Number" error={validationErrors.phone}>
                <input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => {
                    setCustomerInfo({ ...customerInfo, phone: e.target.value });
                    if (validationErrors.phone) setValidationErrors(v => ({ ...v, phone: undefined }));
                  }}
                  className={inputClass(validationErrors.phone)}
                  placeholder="e.g. +265 999 000 111"
                />
              </Field>

              <div className="md:col-span-2">
                <Field id="address" label="Place / Location" error={validationErrors.address}>
                  <textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => {
                      setCustomerInfo({ ...customerInfo, address: e.target.value });
                      if (validationErrors.address) setValidationErrors(v => ({ ...v, address: undefined }));
                    }}
                    rows={2}
                    className={inputClass(validationErrors.address)}
                    placeholder="Where should we come?"
                  />
                </Field>
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
            <div className="bg-[#151B23] border-2 rounded-md border-[#3B424A] shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Booking Details</h3>
              <p className="text-white">Service: {selectedService?.name}</p>
              <p className="text-white">Date: {bookingData && new Date(bookingData.date).toLocaleDateString()}</p>
              <p className="text-white">Time: {bookingData?.time}</p>
              <p className="text-white">Name: {customerInfo.name}</p>
              <p className="text-white">Phone: {customerInfo.phone}</p>
              <p className="text-white">Location: {customerInfo.address}</p>
              {customerInfo.specialRequests && (
                <p className="text-white">Notes: {customerInfo.specialRequests}</p>
              )}
              <p className="text-xl font-bold text-white mt-4">Total: ${selectedService?.price}</p>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">Payment Option</h3>
            <div className="space-y-2">
              {[
                {
                  value: 'deposit',
                  label: `Deposit ($${Math.round((selectedService?.price ?? 0) * 0.3)}) — Secures your slot`,
                  badge: 'Coming Soon',
                },
                {
                  value: 'full',
                  label: `Full Payment ($${selectedService?.price})`,
                  badge: 'Coming Soon',
                },
                {
                  value: 'cash',
                  label: 'Cash on Arrival',
                  badge: null,
                },
              ].map(({ value, label, badge }) => (
                <label
                  key={value}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors duration-150 ${
                    paymentOption === value
                      ? 'border-white/40 bg-white/5'
                      : 'border-[#3B424A] hover:bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={paymentOption === value}
                    onChange={(e) => setPaymentOption(e.target.value as typeof paymentOption)}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm flex items-center gap-2 flex-wrap">
                    {label}
                    {badge && (
                      <span className="bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="blob blob-pink" />
      <div className="blob blob-blue" />
      <div className="blob blob-teal" />

      <div className="">
        <h1 className="text-xl mt-10 font-bold backdrop-blur-sm text-white tracking-wide shadow-md bg-[#0D1117] p-6 rounded-md mb-3 text-center">
          Book Your Appointment
        </h1>

        {/* Stepper */}
        <div className="flex items-center justify-between backdrop-blur-sm mb-8 px-4">
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center text-sm font-medium ${
                  index < activeStep
                    ? 'bg-green-600 text-white'
                    : index === activeStep
                    ? 'bg-gradient-to-r from-[#000000] via-[#000000] to-[#333333] text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index < activeStep ? '✓' : index + 1}
                </div>
                <span className={`text-xs backdrop-blur-sm mt-1 ${index === activeStep ? 'text-white font-medium' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-grow h-1 mx-2 ${index < activeStep ? 'bg-green-600' : 'bg-gray-700'}`} />
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
            disabled={activeStep === 0 || isLoading}
            className={`px-6 py-2 rounded-md font-medium backdrop-blur-sm transition-colors duration-200 ${
              activeStep === 0 || isLoading
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Back
          </button>

          <button
            onClick={activeStep === steps.length - 1 ? handleConfirmBooking : handleNext}
            disabled={isLoading}
            className="bg-gradient-to-r from-[#000000] via-[#111111] to-[#333333] text-white font-semibold py-2 px-6 rounded-md transition-all backdrop-blur-sm duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing…
              </>
            ) : activeStep === steps.length - 1 ? (
              'Confirm Booking'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>

      <NavBar />

      {/* Animation styles */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
      `}</style>
    </>
  );
};

export default BookingFlow;