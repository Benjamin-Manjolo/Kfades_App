import React from "react";
import NavBar from "./NavBar";

const PayCheckout: React.FC = () => {
  return (
    
    <>
    <div className="bg-white h-[100vh] flex justify-center items-center ">
        <div className=""> 
            <h1 className="text-green-500 font-semibold shadow-md p-7 text-xl tracking-wide">
            Thank you, Payment received!!!
            </h1></div>
            
       
    </div>
    <NavBar />
    </>)
  }

export default PayCheckout;