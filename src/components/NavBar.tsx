import React from "react"
import { NavbarItems } from "../utils/data"
import { Explore, Notifications } from "@mui/icons-material";

const NavBar: React.FC = () => {
  const leftItems  = NavbarItems.slice(0, 1);
  const rightItems = NavbarItems.slice(1, 2);

  return (
    <nav className=" border-gray-700 bg-white backdrop-blur-sm sticky bottom-0 left-0 p-3 right-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-12 items-center">

          
          <div className="flex p-2 items-center">
             <Notifications className="text-gray-700  text-2xl" />
            {leftItems.map((item) => (
              <a key={item.label} href={item.explore} className="text-gray-700 font-medium tracking-wide hover:text-blue-600 text-lg">
                {item.label}
              </a>
            ))}
          </div>

          {/* RIGHT item */}
          <div className="flex p-2 items-center">
              <Explore className="text-gray-700  text-2xl" />
            {rightItems.map((item) => (
              
              <a key={item.label} href={item.explore} className="text-gray-700 font-medium tracking-wide hover:text-blue-600 text-lg"
            >
                {item.label}
              </a>
            ))}
          </div>
         
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
