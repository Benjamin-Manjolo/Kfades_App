import React, { useState } from "react";

type CardType = "airtel" | "tnm" | null;

const PaymentPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardType>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState<number | null>(null);

  const handlePay = () => {
    if (!selectedCard || !phoneNumber || !amount) {
      alert("Please complete all fields");
      return;
    }

    console.log({
      provider: selectedCard,
      phoneNumber,
      amount,
    });

    alert("Payment triggered 🚀");
  };

  return (
    <div className=" bg-[#cfc4b2] flex items-center justify-center ">
      <div className="w-full bg-white rounded-md shadow-md p-6 ">
        {/* Header */}
        <h1 className="text-gray-500 font-semibold tracking-wide">
          PAYMENT
        </h1>

        {/* Top Card */}
        <div className="bg-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
          <span className="text-teal-700 font-medium">KFADES</span>
          <button className="text-teal-600 text-sm">Explore</button>
        </div>

        {/* Choose Card */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">
            CHOOSE YOUR CARD
          </h2>

          <div className="flex gap-4">
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

        {/* Payment Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">
            Payment details
          </h2>

          {/* Phone Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-gray-200 rounded-md p-2 outline-none"
              placeholder="Enter phone number"
            />
          </div>

          {/* Amount Buttons */}
          <div className="flex gap-3">
            {[1000, 2000].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
                className={`px-4 py-2 rounded-md shadow-sm ${
                  amount === value
                    ? "bg-gray-400 text-white"
                    : "bg-white"
                }`}
              >
                K{value}
              </button>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-md transition"
        >
          PAY NOW
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;