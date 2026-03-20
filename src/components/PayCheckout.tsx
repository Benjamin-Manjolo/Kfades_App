import React from "react";


const PayCheckout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      
      <div className="text-center space-y-6">

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <h1 className="text-xl md:text-2xl font-semibold text-black tracking-wide animate-pulse">
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