import React from "react";
import { NavbarItems } from "../utils/data";
import { Explore, Notifications } from "@mui/icons-material";

const NavBar: React.FC = () => {
  const leftItems = NavbarItems.slice(0, 1);
  const rightItems = NavbarItems.slice(1, 2);

  // separate navigation functions (cleaner)
  const goToNotifications = () => {
    window.location.href = "/appointment";
  };

  const goToExplore = () => {
    window.location.href = "/barber-inspo";
  };

  return (
    <nav className="border-gray-700 bg-white backdrop-blur-sm fixed mt-10 bottom-0 left-0 p-1 right-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 justify-items-center h-12 items-center">

          {/* LEFT */}
          <button
            onClick={goToNotifications}
            className="flex p-2 items-center"
          >
            <Notifications className="text-black text-2xl" />
            {leftItems.map((item) => (
              <span
                key={item.label}
                className="text-[#D0770C] tracking-wide hover:text-blue-600 text-lg ml-2"
              >
                {item.label}
              </span>
            ))}
          </button>

          {/* RIGHT */}
          <button
            onClick={goToExplore}
            className="flex p-2 items-center"
          >
            <Explore className="text-black text-2xl" />
            {rightItems.map((item) => (
              <span
                key={item.label}
                className="text-[#D0770C] tracking-wide hover:text-blue-600 text-lg ml-2"
              >
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