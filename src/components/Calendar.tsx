import React, { useState } from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { TimeSlot } from '../types';


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
  
     
    <div className='bg-white p-15 pb-80'>
      <div className='font-semibold text-xl w-full bg-white fixed top-0 left-0 z-50 p-3'>Date and time</div>
         
    <div className='animate-[neonGlow_1.5s_eagse-in-out_infinite_alternate] h-screen w-full' >
       {/* <div className="blob blob-pink" />
        <div className="blob blob-blue" />
        <div className="blob blob-teal" /> */}
     
      <div className=' rounded-xl   p-3 pt-4 bg-white m-1 backdrop-blur-sm gap-3 mt-6'
      >
      <p className='text-center text-black'> choose your preferred time slot</p>
      </div>
     

      {/* Date Selection */}
      <div className=" bg-white  m-1  backdrop-blur-sm rounded-lg p-4">
       
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 bg-white rounded-lg p-3 gap-2">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`
                py-3 px-2 shadow-md rounded-lg  backdrop-blur-sm transition-colors duration-200 flex flex-col items-center 
                ${selectedDate?.toDateString() === date.toDateString()
                  ? 'bg-white font-semibold text-black '
                  : 'bg-white text-black border-gray-200 hover:border-gray-400'
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
        <div className='bg-white rounded-md p-3'>
          <h2 className=" rounded-lg backdrop-blur-sm text-md  font-semibold text-black bg-white text-center  border-[#373E46]  p-4 mb-4">
            Available Times for {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`
                  py-2 px-1 rounded-md  transition-colors backdrop-blur-sm duration-200 text-sm
                  ${!slot.available
                    ? 'bg-white  text-gray-400  cursor-not-allowed'
                    : selectedTime === slot.time
                      ? ' bg-white rounded-lg  bg-gradient-to-r from-white via-white to-white text-black'
                      : 'bg-white text-black rounded-lg  '
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
        <div className="mt-8 mb-50 text-center  border-[#0E141D] bg-white backdrop-blur-md">
          <div className="bg-white border-t-2  rounded-lg shadow-md p-6 max-w-md mx-auto mb-4">
            <p className="text-md text-black">
              Selected: {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
            </p>
            <button
              onClick={handleContinue}
              className="mt-4 bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue to Booking
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
