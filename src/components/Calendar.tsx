import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
} from '@mui/material';
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Select Date & Time
      </Typography>

      <Typography variant="h6" gutterBottom align="center" color="text.secondary">
        Choose your preferred date and time slot
      </Typography>

      {/* Date Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Date
        </Typography>
        <Grid container spacing={2}>
          {dates.map((date) => (
            <Grid item xs={6} sm={3} md={2} key={date.toISOString()}>
              <Button
                variant={selectedDate?.toDateString() === date.toDateString() ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => handleDateSelect(date)}
                sx={{ py: 2, display: 'flex', flexDirection: 'column' }}
              >
                <Typography variant="body2">{getDateLabel(date)}</Typography>
                <Typography variant="caption">{format(date, 'd')}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Time Selection */}
      {selectedDate && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Times for {format(selectedDate, 'EEEE, MMMM d')}
          </Typography>
          <Grid container spacing={1}>
            {timeSlots.map((slot) => (
              <Grid item xs={4} sm={3} md={2} key={slot.time}>
                <Button
                  variant={selectedTime === slot.time ? 'contained' : 'outlined'}
                  fullWidth
                  disabled={!slot.available}
                  onClick={() => handleTimeSelect(slot.time)}
                  sx={{ py: 1 }}
                >
                  {slot.time}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTime && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Paper elevation={2} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Selected: {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              sx={{ mt: 2 }}
            >
              Continue to Booking
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Calendar;
