import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'verifying' | 'success' | 'failed' | 'no_ref';

interface BookingInfo {
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  totalPrice: number;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const MY_BOOKINGS_KEY = 'myBookings';

/**
 * FIX: bookingId === tx_ref (they are the same value, set in BookingFlow).
 * This function finds the booking by its bookingId (which equals the tx_ref)
 * and updates its local status.
 */
function updateLocalBookingStatus(tx_ref: string, status: 'confirmed' | 'failed') {
  try {
    const existing = JSON.parse(localStorage.getItem(MY_BOOKINGS_KEY) || '[]');
    const updated = existing.map((b: any) =>
      b.bookingId === tx_ref ? { ...b, status } : b
    );
    localStorage.setItem(MY_BOOKINGS_KEY, JSON.stringify(updated));
  } catch {
    // silently fail
  }
}

function getBookingByTxRef(tx_ref: string): BookingInfo | null {
  try {
    const existing = JSON.parse(localStorage.getItem(MY_BOOKINGS_KEY) || '[]');
    // bookingId === tx_ref (same value assigned in BookingFlow)
    return existing.find((b: any) => b.bookingId === tx_ref) || null;
  } catch {
    return null;
  }
}

// ─── Animated icons ───────────────────────────────────────────────────────────

const SuccessIcon: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
    <circle cx="40" cy="40" r="36" stroke="black" strokeWidth="3"
      strokeDasharray="226" strokeDashoffset="226"
      style={{ animation: 'draw-circle 0.6s ease forwards', transformOrigin: 'center' }} />
    <polyline points="24,42 35,53 56,30" stroke="black" strokeWidth="3.5"
      strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="50" strokeDashoffset="50"
      style={{ animation: 'draw-check 0.4s ease 0.5s forwards' }} />
  </svg>
);

const FailIcon: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
    <circle cx="40" cy="40" r="36" stroke="#dc2626" strokeWidth="3"
      strokeDasharray="226" strokeDashoffset="226"
      style={{ animation: 'draw-circle 0.6s ease forwards', transformOrigin: 'center' }} />
    <line x1="27" y1="27" x2="53" y2="53" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round"
      strokeDasharray="40" strokeDashoffset="40"
      style={{ animation: 'draw-check 0.3s ease 0.5s forwards' }} />
    <line x1="53" y1="27" x2="27" y2="53" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round"
      strokeDasharray="40" strokeDashoffset="40"
      style={{ animation: 'draw-check 0.3s ease 0.65s forwards' }} />
  </svg>
);

// ─── Verifying spinner ────────────────────────────────────────────────────────

const VerifyingState: React.FC = () => (
  <div className="flex flex-col items-center gap-6 py-8">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
      <div className="absolute inset-0 rounded-full border-[3px] border-t-black border-r-transparent border-b-transparent border-l-transparent"
        style={{ animation: 'spin 0.8s linear infinite' }} />
    </div>
    <div className="text-center space-y-1">
      <p className="text-sm font-semibold text-black tracking-wide">Verifying payment</p>
      <p className="text-xs text-gray-400">Please wait, this may take a moment…</p>
    </div>
  </div>
);
// ─── Booking detail row ───────────────────────────────────────────────────────

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
    <span className="text-xs font-medium text-black">{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const PayCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [txRef, setTxRef] = useState<string | null>(null);
  const hasRun = useRef(false); // prevent double-verify in StrictMode

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const tx_ref = params.get('tx_ref');
    const urlStatus = params.get('status'); // "successful" | "failed" from Paychangu

    if (!tx_ref) {
      setStatus('no_ref');
      return;
    }

    setTxRef(tx_ref);

    // Load booking info from localStorage immediately (for display)
    // bookingId === tx_ref — set that way in BookingFlow
    const localBooking = getBookingByTxRef(tx_ref);
    if (localBooking) setBooking(localBooking);

    // If Paychangu already told us it failed, skip verify call
    if (urlStatus === 'failed') {
      updateLocalBookingStatus(tx_ref, 'failed');
      setStatus('failed');
      return;
    }

    // Always verify server-side regardless of URL param
    verifyWithBackend(tx_ref);
  }, []);
const verifyWithBackend = async (tx_ref: string) => {
  try {
    // Wait 3 seconds before verifying — gives Paychangu time to update
    // the payment state after a cancellation. Without this, a cancelled
    // payment can still return 'success' from the verify endpoint.
    await new Promise(resolve => setTimeout(resolve, 3000));

    const res = await fetch(
      `https://kfades.onrender.com/paychangu/verify-payment/${encodeURIComponent(tx_ref)}`
    );
    const json = await res.json();

    const paymentStatus = json?.data?.status ?? json?.data?.data?.status;

    // Also check amount > 0 — cancelled payments sometimes return success
    // but with amount = 0
    const paidAmount = Number(json?.data?.amount ?? json?.data?.data?.amount ?? 0);
    const verified = paymentStatus === 'success' && paidAmount > 0;

    if (verified) {
      updateLocalBookingStatus(tx_ref, 'confirmed');
      setStatus('success');
    } else {
      updateLocalBookingStatus(tx_ref, 'failed');
      setStatus('failed');
    }
  } catch {
    updateLocalBookingStatus(tx_ref, 'failed');
    setStatus('failed');
  }
};

  return (
    <>
      <style>{`
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes draw-check  { to { stroke-dashoffset: 0; } }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fade-up 0.5s ease forwards; }
        .fade-up-1 { animation: fade-up 0.5s ease 0.1s forwards; opacity: 0; }
        .fade-up-2 { animation: fade-up 0.5s ease 0.2s forwards; opacity: 0; }
        .fade-up-3 { animation: fade-up 0.5s ease 0.3s forwards; opacity: 0; }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {status === 'verifying' && <VerifyingState />}

          {status === 'success' && (
            <div className="text-center space-y-6">
              <div className="fade-up flex justify-center"><SuccessIcon /></div>
              <div className="fade-up-1 space-y-1">
                <h1 className="text-xl font-semibold text-black tracking-tight">Payment confirmed</h1>
                <p className="text-sm text-gray-400">Your appointment is booked and ready.</p>
              </div>
              {booking && (
                <div className="fade-up-2 bg-gray-50 rounded-lg px-4 py-3 text-left">
                  <DetailRow label="Service" value={booking.serviceName} />
                  <DetailRow label="Date" value={new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
                  <DetailRow label="Time" value={booking.time} />
                  <DetailRow label="Name" value={booking.customerName} />
                  <DetailRow label="Amount" value={`MWK ${booking.totalPrice.toLocaleString()}`} />
                </div>
              )}
              {txRef && <p className="text-xs text-gray-300 font-mono break-all">Ref: {txRef}</p>}
              <div className="fade-up-3 flex flex-col gap-2 pt-2">
                <button onClick={() => navigate('/appointment')}
                  className="w-full bg-black text-white text-sm font-semibold py-3 rounded-lg transition-opacity hover:opacity-80">
                  View Appointment
                </button>
                <button onClick={() => navigate('/')}
                  className="w-full bg-white text-black text-sm font-medium py-3 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center space-y-6">
              <div className="fade-up flex justify-center"><FailIcon /></div>
              <div className="fade-up-1 space-y-1">
                <h1 className="text-xl font-semibold text-black tracking-tight">Payment unsuccessful</h1>
                <p className="text-sm text-gray-400">Your booking is saved. You can try again or pay on arrival.</p>
              </div>
              {booking && (
                <div className="fade-up-2 bg-gray-50 rounded-lg px-4 py-3 text-left">
                  <DetailRow label="Service" value={booking.serviceName} />
                  <DetailRow label="Date" value={new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
                  <DetailRow label="Time" value={booking.time} />
                </div>
              )}
              <div className="fade-up-3 flex flex-col gap-2 pt-2">
                <button onClick={() => navigate('/booking')}
                  className="w-full bg-black text-white text-sm font-semibold py-3 rounded-lg transition-opacity hover:opacity-80">
                  Try Again
                </button>
                <button onClick={() => navigate('/appointment')}
                  className="w-full bg-white text-black text-sm font-medium py-3 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
                  View Appointment
                </button>
                <button onClick={() => navigate('/')}
                  className="w-full text-gray-400 text-sm py-2 transition-colors hover:text-black">
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {status === 'no_ref' && (
            <div className="text-center space-y-6 fade-up">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl">?</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-black">Nothing to verify</h1>
                <p className="text-sm text-gray-400">No payment reference was found in this URL.</p>
              </div>
              <button onClick={() => navigate('/')}
                className="w-full bg-black text-white text-sm font-semibold py-3 rounded-lg hover:opacity-80 transition-opacity">
                Go Home
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default PayCheckout;
