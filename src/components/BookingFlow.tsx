import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Service, Booking } from '../types';

const steps = ['Service', 'Date & Time', 'Your Info', 'Summary & Confirm'];

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

  const handleFinish = () => {
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

    // In real app, this would be an API call
    console.log('New booking:', newBooking);
    alert('Booking confirmed! You will receive a confirmation SMS/WhatsApp.');

    // Clear localStorage
    localStorage.removeItem('selectedService');
    localStorage.removeItem('bookingData');

    navigate('/');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Your Service
            </Typography>
            {selectedService && (
              <Card>
                <CardContent>
                  <Typography variant="h5">{selectedService.name}</Typography>
                  <Typography variant="body1">{selectedService.description}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${selectedService.price} • {selectedService.duration} minutes
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Date & Time
            </Typography>
            {bookingData && (
              <Paper sx={{ p: 2 }}>
                <Typography>
                  Date: {new Date(bookingData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
                <Typography>Time: {bookingData.time}</Typography>
              </Paper>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address / Location"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Requests (optional)"
                  value={customerInfo.specialRequests}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, specialRequests: e.target.value })}
                  multiline
                  rows={3}
                  placeholder="Hair type, kids coming, allergies, preferred blade, etc."
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Summary & Payment
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              <Typography>Service: {selectedService?.name}</Typography>
              <Typography>
                Date: {bookingData && new Date(bookingData.date).toLocaleDateString()}
              </Typography>
              <Typography>Time: {bookingData?.time}</Typography>
              <Typography>Name: {customerInfo.name}</Typography>
              <Typography>Phone: {customerInfo.phone}</Typography>
              <Typography>Address: {customerInfo.address}</Typography>
              {customerInfo.specialRequests && (
                <Typography>Special Requests: {customerInfo.specialRequests}</Typography>
              )}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ${selectedService?.price}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Payment Option
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value as typeof paymentOption)}
              >
                <FormControlLabel
                  value="deposit"
                  control={<Radio />}
                  label={`Deposit ($${Math.round(selectedService!.price * 0.3)}) - Required to secure slot`}
                />
                <FormControlLabel
                  value="full"
                  control={<Radio />}
                  label={`Pay full amount now ($${selectedService!.price})`}
                />
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="Cash on arrival"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Book Your Appointment
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, mb: 4 }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}>
          {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default BookingFlow;
