import React, { useState, useEffect, useCallback } from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { TimeSlot } from '../types';

// ── All possible time slots 9am–6pm in 30-min intervals ──────────────────────
const ALL_TIMES: string[] = [];
for (let hour = 9; hour < 18; hour++) {
  for (let min = 0; min < 60; min += 30) {
    ALL_TIMES.push(
      `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    );
  }
}

// ── Slot skeleton ─────────────────────────────────────────────────────────────
const SlotSkeleton: React.FC = () => (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
    {ALL_TIMES.map((t) => (
      <div
        key={t}
        className="py-2 px-1 rounded-md h-9"
        style={{
          background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
          backgroundSize: '400px 100%',
          animation: 'shimmer 1.2s infinite linear',
        }}
      />
    ))}
  </div>
);

// ── Calendar component ────────────────────────────────────────────────────────
const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // ── Fetch booked times for a given date ──
  const fetchAvailability = useCallback(async (date: Date) => {
    setLoadingSlots(true);
    setFetchError(null);
    setTimeSlots([]);

    const dateStr = format(date, 'yyyy-MM-dd');
    const now = new Date();
    const isDateToday = isToday(date);

    try {
      const res = await fetch('https://kfades.onrender.com/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');

      const result = await res.json();
      const allBookings: any[] = result.rawData ?? [];

      // Collect times already booked on this date (only active bookings count)
      const bookedTimes = new Set<string>(
        allBookings
          .filter(
            (b) =>
              b.date === dateStr &&
              b.status !== 'cancelled' &&
              b.status !== 'no-show'
          )
          .map((b) => b.time as string)
      );

      // Build slots — disable if booked or in the past (for today)
      const slots: TimeSlot[] = ALL_TIMES.map((time) => {
        const isBooked = bookedTimes.has(time);

        // For today, disable slots whose time has already passed (add 30-min buffer)
        let isPast = false;
        if (isDateToday) {
          const [h, m] = time.split(':').map(Number);
          const slotDate = new Date(date);
          slotDate.setHours(h, m, 0, 0);
          isPast = slotDate.getTime() <= now.getTime() + 30 * 60 * 1000;
        }

        return { time, available: !isBooked && !isPast };
      });

      setTimeSlots(slots);
    } catch (err) {
      console.error(err);
      setFetchError('Could not load availability. Showing all slots as available.');
      // Graceful fallback — show all slots open except past times for today
      const slots: TimeSlot[] = ALL_TIMES.map((time) => {
        let isPast = false;
        if (isDateToday) {
          const [h, m] = time.split(':').map(Number);
          const slotDate = new Date(date);
          slotDate.setHours(h, m, 0, 0);
          isPast = slotDate.getTime() <= now.getTime() + 30 * 60 * 1000;
        }
        return { time, available: !isPast };
      });
      setTimeSlots(slots);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Re-fetch whenever date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedTime(null);
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, fetchAvailability]);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      localStorage.setItem(
        'bookingData',
        JSON.stringify({ date: format(selectedDate, 'yyyy-MM-dd'), time: selectedTime })
      );
      navigate('/booking');
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const availableCount = timeSlots.filter((s) => s.available).length;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
      `}</style>

      <div className="bg-white pb-32">
        {/* Header */}
        <div className="font-semibold text-xl w-full bg-white fixed top-0 left-0 z-50 p-3 border-b border-gray-100">
          Date and time
        </div>

        <div className="pt-14">
          {/* Subtitle */}
          <div className="rounded-xl p-3 pt-4 bg-white m-1 mt-2">
            <p className="text-center text-sm text-gray-400">
              Choose your preferred date and time slot
            </p>
          </div>

          {/* ── Date picker ── */}
          <div className="bg-white m-1 rounded-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 bg-white rounded-lg p-1 gap-2">
              {dates.map((date) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`py-3 px-2 shadow-sm rounded-lg transition-all duration-200 flex flex-col items-center border ${
                      isSelected
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-black border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs">{getDateLabel(date)}</span>
                    <span className="text-sm font-bold mt-0.5">{format(date, 'd')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Time slots ── */}
          {selectedDate && (
            <div className="bg-white rounded-md p-4 m-1 mt-2">

              {/* Slot header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-black">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h2>
                {!loadingSlots && !fetchError && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    availableCount === 0
                      ? 'bg-red-50 text-red-500'
                      : availableCount <= 3
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-green-50 text-green-600'
                  }`}>
                    {availableCount === 0
                      ? 'Fully booked'
                      : `${availableCount} slot${availableCount !== 1 ? 's' : ''} free`}
                  </span>
                )}
              </div>

              {/* Error banner */}
              {fetchError && (
                <div className="mb-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span className="text-amber-500 text-xs">⚠</span>
                  <p className="text-amber-700 text-xs">{fetchError}</p>
                </div>
              )}

              {/* Loading skeleton */}
              {loadingSlots ? (
                <SlotSkeleton />
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`
                          py-2 px-1 rounded-md text-xs font-medium transition-all duration-150 relative
                          ${!slot.available
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-black text-white shadow-md scale-105'
                            : 'bg-white text-black border border-gray-100 hover:border-black hover:shadow-sm'
                          }
                        `}
                      >
                        {slot.time}
                        {/* small dot on booked slots */}
                        {!slot.available && (
                          <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-red-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fully booked message */}
              {!loadingSlots && availableCount === 0 && (
                <p className="text-center text-sm text-gray-400 mt-6 pb-2">
                  No slots available for this day. Try another date.
                </p>
              )}
            </div>
          )}

          {/* ── Continue button ── */}
          {selectedDate && selectedTime && (
            <div className="mt-6 px-4 pb-6">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <div>
                    <p className="text-sm font-semibold text-black">
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </p>
                    <p className="text-xs text-gray-400">at {selectedTime}</p>
                  </div>
                </div>
                <button
                  onClick={handleContinue}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  Continue to Booking →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Calendar;