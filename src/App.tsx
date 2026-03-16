import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import ServiceCatalog from './components/ServiceCatalog';
import Calendar from './components/Calendar';
import BookingFlow from './components/BookingFlow';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import BarberInspo from './components/BarberInspo';
import PayCheckout from './components/PayCheckout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/services" element={<ServiceCatalog />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/booking" element={<BookingFlow />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/checkout" element={<PayCheckout />} />
        <Route path="/barber-inspo" element={<BarberInspo />} />
      </Routes>
    </Router>
  );
}

export default App;

