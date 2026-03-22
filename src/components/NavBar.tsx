import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Explore, Notifications, ContentCut } from "@mui/icons-material";

const MY_BOOKINGS_KEY = 'myBookings';

function getActiveBookingCount(): number {
  try {
    const all = JSON.parse(localStorage.getItem(MY_BOOKINGS_KEY) || '[]');
    return all.filter((b: any) => b.status !== 'completed' && b.status !== 'cancelled').length;
  } catch {
    return 0;
  }
}

const NavBar: React.FC = () => {
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    setBadgeCount(getActiveBookingCount());
    const onStorage = () => setBadgeCount(getActiveBookingCount());
    window.addEventListener('storage', onStorage);
    const interval = setInterval(() => setBadgeCount(getActiveBookingCount()), 5000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const goToNotifications = () => navigate('/appointment');
  const goToHome          = () => navigate('/services');
  const goToExplore       = () => navigate('/barber-inspo');

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white p-2 backdrop-blur-sm fixed bottom-0 left-0 right-0 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 justify-items-center h-14 items-center">

          {/* LEFT — Notifications */}
          <button
            onClick={goToNotifications}
            className="flex flex-col items-center gap-0.5 p-2 transition-colors"
          >
            <div className="relative">
              <Notifications
                style={{ fontSize: 24, color: isActive('/appointment') ? '#000' : '#9ca3af' }}
              />
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '10px',
              color: isActive('/appointment') ? '#000' : '#9ca3af',
              fontWeight: isActive('/appointment') ? 600 : 400,
            }}>
              Activity
            </span>
          </button>

          {/* MIDDLE — Home (Services) */}
          <button
            onClick={goToHome}
            className="flex flex-col items-center gap-0.5 p-2 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isActive('/services') ? 'bg-black' : 'bg-gray-100'
            }`}>
              <ContentCut style={{
                fontSize: 20,
                color: isActive('/services') ? 'white' : '#9ca3af',
              }} />
            </div>
            <span style={{
              fontSize: '10px',
              color: isActive('/services') ? '#000' : '#9ca3af',
              fontWeight: isActive('/services') ? 600 : 400,
            }}>
              Services
            </span>
          </button>

          {/* RIGHT — Explore */}
          <button
            onClick={goToExplore}
            className="flex flex-col items-center gap-0.5 p-2 transition-colors"
          >
            <Explore
              style={{ fontSize: 24, color: isActive('/barber-inspo') ? '#000' : '#9ca3af' }}
            />
            <span style={{
              fontSize: '10px',
              color: isActive('/barber-inspo') ? '#000' : '#9ca3af',
              fontWeight: isActive('/barber-inspo') ? 600 : 400,
            }}>
              Explore
            </span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;