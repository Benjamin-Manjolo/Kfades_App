import React from "react";
import NavBar from "./NavBar";

const PayCheckout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      
      <div className="text-center space-y-6">

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <h1 className="text-xl md:text-2xl font-semibold text-gray-200 tracking-wide animate-pulse">
          Processing payment...
        </h1>

        <p className="text-gray-400 text-sm">
          Please wait while we confirm your transaction
        </p>

      </div>

    </div>
  );
};

export default PayCheckout;