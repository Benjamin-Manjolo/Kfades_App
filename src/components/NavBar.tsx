import React, { useState, useEffect } from "react";
import { NavbarItems } from "../utils/data";
import { Explore, Notifications } from "@mui/icons-material";

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
  const leftItems = NavbarItems.slice(0, 1);
  const rightItems = NavbarItems.slice(1, 2);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    // Read on mount
    setBadgeCount(getActiveBookingCount());

    // Re-read whenever localStorage changes (e.g. after a booking in another tab or same page)
    const onStorage = () => setBadgeCount(getActiveBookingCount());
    window.addEventListener('storage', onStorage);

    // Also poll every 5 seconds for same-tab updates (localStorage events don't fire in same tab)
    const interval = setInterval(() => setBadgeCount(getActiveBookingCount()), 5000);

    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const goToNotifications = () => { window.location.href = "/appointment"; };
  const goToExplore = () => { window.location.href = "/barber-inspo"; };

  return (
    <nav className="border-gray-700 bg-white backdrop-blur-sm fixed mt-10 bottom-0 left-0 p-1 right-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 justify-items-center h-12 items-center">

          {/* LEFT — Notifications with badge */}
          <button onClick={goToNotifications} className="flex p-2 items-center relative">
            <div className="relative">
              <Notifications className="text-black text-2xl" />
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </div>
            {leftItems.map((item) => (
              <span key={item.label} className="text-[#D0770C] tracking-wide hover:text-blue-600 text-lg ml-2">
                {item.label}
              </span>
            ))}
          </button>

          {/* RIGHT — Explore */}
          <button onClick={goToExplore} className="flex p-2 items-center">
            <Explore className="text-black text-2xl" />
            {rightItems.map((item) => (
              <span key={item.label} className="text-[#D0770C] tracking-wide hover:text-blue-600 text-lg ml-2">
                {item.label}
              </span>
            ))}
          </button>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;