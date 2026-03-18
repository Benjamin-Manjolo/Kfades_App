import React from "react"
import { NavbarItems } from "../utils/data"
import { Explore, Notifications } from "@mui/icons-material";

const NavBar: React.FC = () => {
  const leftItems  = NavbarItems.slice(0, 1);
  const rightItems = NavbarItems.slice(1, 2);

  return (
    <nav className=" border-gray-700 bg-[#0D1117] backdrop-blur-sm fixed mt-10 bottom-0 left-0 p-1 right-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 justify-items-center h-12 items-center">

          
          <div className="flex p-2 items-center">
             <Notifications className="text-white  text-2xl" />
            {leftItems.map((item) => (
              <a key={item.label} href={item.explore} className="text-gray-700 text-[#D0770C] tracking-wide hover:text-blue-600 text-lg">
                {item.label}
              </a>
            ))}
          </div>

          {/* RIGHT item */}
          <div className="flex p-2 items-center">
              <Explore className="text-white text-2xl" />
            {rightItems.map((item) => (
              
              <a key={item.label} href={item.explore} className="text-[#D0770C] tracking-wide hover:text-blue-600 text-lg"
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
