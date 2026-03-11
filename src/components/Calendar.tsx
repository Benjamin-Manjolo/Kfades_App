import React, { useState } from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { TimeSlot } from '../types';
import NavBar from './NavBar';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mock available time slots (9 AM to 6 PM, 30-min intervals)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // Mock availability: some slots are booked
        const available = Math.random() > 0.3; // 70% available
        slots.push({ time, available });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const bookingData = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
      };
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      navigate('/booking');
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  return (
    <>
    <div   className="min-h-screen mt-10 bg-cover bg-center bg-no-repeat">
         
    <div className="container mx-auto px-4 py-8 max-w-4xl">
     
      <div className=' rounded-xl px-4 py-3 bg-white backdrop-blur-sm gap-3 mb-6'
      ><h1 className="text-lg font-semibold text-gray-700 tracking-wide  mb-2 text-center">
         
        Select Date & Time
      </h1>
      <p className='text-center'> choose your preferred time slot</p>
      </div>
     

      {/* Date Selection */}
      <div className="mb-6">
       
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`
                py-3 px-2 rounded-lg border-2 transition-colors duration-200 flex flex-col items-center
                ${selectedDate?.toDateString() === date.toDateString()
                  ? 'bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C] text-white '
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }
              `}
            >
              <span className="text-sm">{getDateLabel(date)}</span>
              <span className="text-xs opacity-75">{format(date, 'd')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h2 className=" rounded-lg backdrop-blur-sm text-md font-semibold text-gray-800 bg-white text-center   p-4 mb-4">
            Available Times for {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`
                  py-2 px-1 rounded-md border transition-colors duration-200 text-sm
                  ${!slot.available
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : selectedTime === slot.time
                      ? 'neu bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C]  text-white border-gray-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTime && (
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mb-4">
            <p className="text-lg text-gray-700">
              Selected: {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
            </p>
            <button
              onClick={handleContinue}
              className="mt-4 bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C] hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue to Booking
            </button>
          </div>
        </div>
      )}
    </div>
     </div> 
       <NavBar/></>
  );
 
};

export default Calendar;
