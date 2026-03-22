import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredBooking {
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  address: string;
  paymentOption: string;
  totalPrice: number;
  status: string;
  bookedAt: string;
}

// Live status fetched from the API, merged with stored booking
interface LiveBooking extends StoredBooking {
  liveStatus: string; // status from server
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MY_BOOKINGS_KEY = 'myBookings';

const STATUS_CONFIG: Record<string, { dot: string; pill: string; label: string; icon: string }> = {
  pending:   { dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-700 border border-amber-200',     label: 'Pending',   icon: '⏳' },
  confirmed: { dot: 'bg-blue-400',    pill: 'bg-blue-50  text-blue-700  border border-blue-200',       label: 'Confirmed', icon: '✅' },
  completed: { dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Completed', icon: '🎉' },
  cancelled: { dot: 'bg-red-400',     pill: 'bg-red-50   text-red-700   border border-red-200',        label: 'Cancelled', icon: '❌' },
  'no-show': { dot: 'bg-gray-400',    pill: 'bg-gray-50  text-gray-600  border border-gray-200',       label: 'No-show',   icon: '👻' },
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['pending'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

function getStoredBookings(): StoredBooking[] {
  try {
    return JSON.parse(localStorage.getItem(MY_BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
}

function updateStoredStatus(bookingId: string, newStatus: string) {
  try {
    const all: StoredBooking[] = JSON.parse(localStorage.getItem(MY_BOOKINGS_KEY) || '[]');
    const updated = all.map(b => b.bookingId === bookingId ? { ...b, status: newStatus } : b);
    localStorage.setItem(MY_BOOKINGS_KEY, JSON.stringify(updated));
  } catch {}
}

function removeStoredBooking(bookingId: string) {
  try {
    const all: StoredBooking[] = JSON.parse(localStorage.getItem(MY_BOOKINGS_KEY) || '[]');
    localStorage.setItem(MY_BOOKINGS_KEY, JSON.stringify(all.filter(b => b.bookingId !== bookingId)));
  } catch {}
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function timeAgo(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const UpcomingAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<LiveBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Load stored bookings and sync live status from API ──
  const syncBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const stored = getStoredBookings();

    if (stored.length === 0) {
      setBookings([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    // Fetch live status for each booking from the API
    const liveBookings: LiveBooking[] = await Promise.all(
      stored.map(async (b) => {
        try {
          const res = await fetch(`https://kfades.onrender.com/api/bookings/${b.bookingId}`);
          if (res.ok) {
            const result = await res.json();
            const liveStatus = result.rawData?.status ?? b.status;
            // Update local status so it's current even offline next time
            updateStoredStatus(b.bookingId, liveStatus);
            return { ...b, liveStatus };
          }
        } catch {}
        // Fallback to locally stored status if API is unreachable
        return { ...b, liveStatus: b.status };
      })
    );

    setBookings(liveBookings);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    syncBookings();
    // Poll every 60 seconds to pick up status changes (e.g. admin confirms)
    const interval = setInterval(() => syncBookings(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = (bookingId: string) => {
    removeStoredBooking(bookingId);
    setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
  };

  const activeBookings = bookings.filter(b => b.liveStatus !== 'completed' && b.liveStatus !== 'cancelled');
  const pastBookings   = bookings.filter(b => b.liveStatus === 'completed' || b.liveStatus === 'cancelled');

  const unreadCount = activeBookings.length;

  // ── Empty state ──
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl">💈</div>
      <h3 className="text-base font-semibold text-black mb-1">No appointments yet</h3>
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
        Once you book a service, your appointments will appear here so you can track them.
      </p>
      <button
        onClick={() => navigate('/services')}
        className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-xl"
      >
        Browse Services →
      </button>
    </div>
  );

  // ── Booking card ──
  const BookingCard: React.FC<{ booking: LiveBooking; showDismiss?: boolean }> = ({ booking, showDismiss = false }) => {
    const cfg = STATUS_CONFIG[booking.liveStatus] ?? STATUS_CONFIG['pending'];
    const isExpanded = expandedId === booking.bookingId;

    return (
      <div
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${
          booking.liveStatus === 'confirmed' ? 'border-l-4 border-l-blue-400' :
          booking.liveStatus === 'completed' ? 'border-l-4 border-l-emerald-400' :
          booking.liveStatus === 'cancelled' ? 'border-l-4 border-l-red-300 opacity-70' :
          'border-l-4 border-l-amber-400'
        }`}
      >
        {/* Card header — always visible */}
        <button
          className="w-full text-left p-4"
          onClick={() => setExpandedId(isExpanded ? null : booking.bookingId)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Status icon + service name */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{cfg.icon}</span>
                <p className="text-sm font-bold text-black truncate">{booking.serviceName}</p>
              </div>
              {/* Date & time */}
              <p className="text-xs text-gray-500 mb-2">
                📅 {formatDate(booking.date)} &nbsp;·&nbsp; 🕐 {booking.time}
              </p>
              <StatusPill status={booking.liveStatus} />
            </div>
            {/* Price + chevron */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-sm font-bold text-black">MWK {booking.totalPrice.toLocaleString()}</span>
              <span className={`text-gray-400 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </div>
        </button>

        {/* Expanded detail */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2">
            <DetailRow label="Name"     value={booking.customerName} />
            <DetailRow label="Phone"    value={booking.phone} />
            <DetailRow label="Location" value={booking.address} />
            <DetailRow label="Payment"  value={booking.paymentOption.charAt(0).toUpperCase() + booking.paymentOption.slice(1)} />
            <DetailRow label="Booked"   value={timeAgo(booking.bookedAt)} />
            <DetailRow label="Ref"      value={`#${booking.bookingId.slice(-8).toUpperCase()}`} mono />

            {/* Status message */}
            <div className={`mt-3 rounded-xl p-3 text-xs leading-relaxed ${
              booking.liveStatus === 'pending'   ? 'bg-amber-50 text-amber-700' :
              booking.liveStatus === 'confirmed' ? 'bg-blue-50  text-blue-700'  :
              booking.liveStatus === 'completed' ? 'bg-emerald-50 text-emerald-700' :
              'bg-red-50 text-red-700'
            }`}>
              {booking.liveStatus === 'pending'   && '⏳ Your booking is awaiting confirmation from the barber. We\'ll update this automatically.'}
              {booking.liveStatus === 'confirmed' && '✅ Your appointment is confirmed! Please be on time at your location.'}
              {booking.liveStatus === 'completed' && '🎉 This appointment is done. Hope you loved your cut — book again anytime!'}
              {booking.liveStatus === 'cancelled' && '❌ This appointment was cancelled. Feel free to rebook a new slot.'}
              {booking.liveStatus === 'no-show'   && '👻 This appointment was marked as no-show. Rebook to get your cut!'}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              {(booking.liveStatus === 'completed' || booking.liveStatus === 'cancelled' || booking.liveStatus === 'no-show') && (
                <>
                  <button
                    onClick={() => navigate('/services')}
                    className="flex-1 bg-black text-white text-xs font-semibold py-2.5 rounded-xl"
                  >
                    Book Again
                  </button>
                  {showDismiss && (
                    <button
                      onClick={() => handleDismiss(booking.bookingId)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium"
                    >
                      Dismiss
                    </button>
                  )}
                </>
              )}
              {booking.liveStatus === 'pending' && (
                <button
                  onClick={() => syncBookings(true)}
                  className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2.5 rounded-xl"
                >
                  {refreshing ? 'Refreshing…' : 'Refresh Status'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const DetailRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className={`text-xs text-black font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="font-semibold text-xl w-full bg-white fixed top-0 left-0 z-50 p-4 flex items-center justify-between border-b border-gray-100">
        <span>Activity</span>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
          <button
            onClick={() => syncBookings(true)}
            disabled={refreshing}
            className="text-gray-400 hover:text-black transition-colors"
            title="Refresh"
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-24 min-h-screen bg-gray-50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading your appointments…</p>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="px-4 space-y-6">

            {/* ── Active appointments ── */}
            {activeBookings.length > 0 && (
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Upcoming
                </p>
                <div className="space-y-3">
                  {activeBookings.map(b => (
                    <BookingCard key={b.bookingId} booking={b} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Past appointments ── */}
            {pastBookings.length > 0 && (
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Past
                </p>
                <div className="space-y-3">
                  {pastBookings.map(b => (
                    <BookingCard key={b.bookingId} booking={b} showDismiss />
                  ))}
                </div>
              </section>
            )}

            {/* Footer hint */}
            <p className="text-center text-xs text-gray-300 pb-4">
              Appointments are tracked on this device · Status updates automatically
            </p>
          </div>
        )}
      </div>

      
    </>
  );
};

export default UpcomingAppointments;