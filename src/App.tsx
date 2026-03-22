import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Welcome from './components/Welcome';
import ServiceCatalog from './components/ServiceCatalog';
import Calendar from './components/Calendar';
import BookingFlow from './components/BookingFlow';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import BarberInspo from './components/BarberInspo';
import PayCheckout from './components/PayCheckout';
import UpcomingAppointments from './components/UpcomingAppointment';
import NavBar from './components/NavBar';

// Pages where the NavBar should NOT appear
const HIDDEN_NAV_PATHS = ['/', '/admin', '/admin/dashboard', '/checkout'];

const GlobalNavBar: React.FC = () => {
  const location = useLocation();
  if (HIDDEN_NAV_PATHS.includes(location.pathname)) return null;
  return <NavBar />;
};

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
        <Route path="/appointment" element={<UpcomingAppointments />} />
      </Routes>
      <GlobalNavBar />
    </Router>
  );
}

export default App;