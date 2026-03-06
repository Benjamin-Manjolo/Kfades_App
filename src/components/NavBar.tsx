import React from "react"
import { NavbarItems } from "../utils/data"

const NavBar: React.FC = (any)=>{
    return (
       <>
        <nav className="bg-gray-300 rounded-lg shadow-md mb-10">
         <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between h-12 items-center">
       
             {/* Logo */}
             <div className="text-xl font-bold">
               Kfades
             </div>
       
             {/* Links from NavbarItems */}
             <div className="flex items-center space-x-6">
               {NavbarItems.map((item) => (
                 <a
                   key={item.label}
                   href={item.explore}
                   className="text-gray-700 hover:text-blue-600 font-medium"
                 >
                   {item.label}
                 </a>
               ))}
             </div>
       
             {/* Login Button */}
             <div className="hidden md:block">
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                 Login
               </button>
             </div>
       
           </div>
         </div>
       </nav>
       </>
    )
}

export default NavBar;