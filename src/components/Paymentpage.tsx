import React, { useState } from "react";
// import NavBar from "./NavBar";
import paymentService, { PaymentInitData } from "../services/paymentService";

type CardType = "airtel" | "tnm" | null;

const PaymentPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardType>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  
  // User info fields (required for Paychangu API)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("kfades");
  const [email, setEmail] = useState("kfades@gmail.com");
  
  // State for payment processing
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateTxRef = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TX_${timestamp}_${random}`;
  };

  const handlePay = async () => {
    // Validation
    if (!selectedCard || !phoneNumber || !amount) {
      setError("Please complete all fields");
      return;
    }

    if (!firstName || !lastName || !email) {
      setError("Please provide your name and email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address");
      return;
    }

    // Phone validation (Malawian format)
    const phoneRegex = /^(\+265|265|0)?[1-9]\d{8}$/;
    const formattedPhone = phoneNumber.replace(/\s/g, '');
    if (!phoneRegex.test(formattedPhone)) {
      setError("Please provide a valid Malawian phone number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const paymentData: PaymentInitData = {
        amount: amount,
        tx_ref: generateTxRef(),
        first_name: firstName,
        last_name: lastName,
        email: email,
        callback_url: 'http://localhost:3001/paychangu/callback',
        return_url: 'http://localhost:3000/payment/success',
      };

      console.log("Initiating payment with data:", paymentData);

      const response = await paymentService.initiateTransaction(paymentData);

      if (response.error) {
        setError(response.message || "Payment failed. Please try again.");
      } else {
        setSuccess("Payment initiated successfully! Please check your phone for the payment prompt.");
        // Reset form after successful payment
        setSelectedCard(null);
        setPhoneNumber("");
        setAmount(null);
        setFirstName("");
        setLastName("");
        setEmail("");
        
        // If there's a checkout link in the response, you could redirect the user
        if (response.data?.data?.checkout_url) {
          window.location.href = response.data.data.checkout_url;
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
   
    <div className=" h-[100vh] ">

      <h2 className="font-bold mt-10 text-center text-xl text-gray-500">
            CHOOSE YOUR CARD
          </h2>
      <div className="w-full bg-white rounded-md shadow-md p-6 ">
            

        <div className="space-y-3 shadow-md bg-gray-50 rounded-md">
          

          <div className="flex p-5 gap-4">
            <button
              onClick={() => setSelectedCard("airtel")}
              className={`flex-1 p-4 rounded-md text-white font-bold text-lg ${
                selectedCard === "airtel"
                  ? "ring-4 ring-gray-400"
                  : ""
              } bg-red-600`}
            >
              airtel
            </button>

            <button
              onClick={() => setSelectedCard("tnm")}
              className={`flex-1 p-4 rounded-md text-white font-bold text-lg ${
                selectedCard === "tnm"
                  ? "ring-4 ring-gray-400"
                  : ""
              } bg-green-600`}
            >
              tnm
            </button>
          </div>
        </div>
            <h2 className="font-semibold p-4 text-gray-800">
            Payment details
          </h2>
        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {success}
            </div>
          )}
         
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-md text-gray-600">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full neu-inset bg-gray-200 rounded-md p-2 my-2 outline-none"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-md text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full neu-inset bg-gray-200 rounded-md p-2 my-2 outline-none"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-md text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full neu-inset bg-gray-200 rounded-md p-2 my-4 outline-none"
              placeholder="your@email.com"
            />
          </div>

         
          <div>
            <label className="block text-md text-gray-600">
              Phone number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full neu-inset bg-gray-200 rounded-md p-2 my-4 outline-none"
              placeholder="e.g. 0881234567"
            />
          </div>
        
          {/* Amount Buttons */}
          <div className="flex gap-3 p-4">
            {[1000, 2000, 5000].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
                className={`flex-1 px-4 py-2 rounded-md shadow-sm ${
                  amount === value
                    ? "bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C] hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-white"
                    : "bg-white"
                }`}
              >
                K{value}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="mt-3">
            <label className="block text-md text-gray-600">
              Or enter custom amount
            </label>
            <input
              type="number"
              min="100"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full neu-inset bg-gray-200 rounded-md p-2 my-2 outline-none"
              placeholder="Enter amount in MWK"
            />
          </div>
        </div>

      
      </div>
      <div className="flex justify-center">
        <button
          onClick={handlePay}
          disabled={isLoading}
          className={`mt-4 bg-gradient-to-r from-[#F1B20B] via-[#E89804] to-[#D0770C] hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Processing..." : "PAY NOW"}
        </button>
      </div>
        
    </div>
    
    </>
  );
};

export default PaymentPage;

