import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Welcome from './components/Welcome';
import ServiceCatalog from './components/ServiceCatalog';
import Calendar from './components/Calendar';
import BookingFlow from './components/BookingFlow';
import AdminLogin from './components/AdminLogin';
import BarberInspo from './components/BarberInspo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/services" element={<ServiceCatalog />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/booking" element={<BookingFlow />} />
          <Route path="/admin" element={<AdminLogin />} />
          
          {/* Add this once you implement the dashboard */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;