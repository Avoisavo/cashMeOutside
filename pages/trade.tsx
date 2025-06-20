import Image from "next/image";
import { useState } from "react";

export default function Trade() {
  const [fromCurrency, setFromCurrency] = useState("MYR");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [amount, setAmount] = useState("1000");

  const currencies = [
    { code: "MYR", name: "Malaysian Ringgit", flag: "https://flagcdn.com/w40/my.png" },
    { code: "KRW", name: "South Korean Won", flag: "https://flagcdn.com/w40/kr.png" },
    { code: "USD", name: "US Dollar", flag: "https://flagcdn.com/w40/us.png" },
    { code: "AUD", name: "Australian Dollar", flag: "https://flagcdn.com/w40/au.png" },
    { code: "GBP", name: "British Pound", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "JPY", name: "Japanese Yen", flag: "https://flagcdn.com/w40/jp.png" }
  ];

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="px-4 pb-4">
      {/* Main Trade Card */}
      <div className="bg-black bg-opacity-40 rounded-3xl p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-xl font-bold text-white text-center">Currency Exchange</h2>
        
        {/* From Currency Row */}
        <div className="flex items-center justify-between">
          {/* Currency Selector */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-8 rounded-md overflow-hidden border border-gray-600">
              <img 
                src={currencies.find(c => c.code === fromCurrency)?.flag} 
                alt={fromCurrency} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-lg">{fromCurrency}</span>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Amount Input */}
          <div className="flex-1 text-right ml-4">
            <input 
              type="text" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold text-white text-right placeholder-gray-400 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center py-2">
          <button 
            onClick={swapCurrencies}
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Currency Row */}
        <div className="flex items-center justify-between">
          {/* Currency Selector */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-8 rounded-md overflow-hidden border border-gray-600">
              <img 
                src={currencies.find(c => c.code === toCurrency)?.flag} 
                alt={toCurrency} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-lg">{toCurrency}</span>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Converted Amount */}
          <div className="flex-1 text-right ml-4">
            <div className="text-2xl font-bold text-white">
              {toCurrency === "KRW" ? "300,250" : "4,720"}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-6"></div>

        {/* Exchange Rate Info */}
        <div className="bg-green-500 rounded-2xl p-4">
          <div className="text-center">
            <div className="text-white font-bold text-lg mb-1">
              1 MYR = 300.25 KRW
            </div>
            <div className="text-white text-sm opacity-90">
              P2P Rate • Updated 2s ago
            </div>
          </div>
        </div>

        {/* Peer Info */}
        <div className="flex items-center justify-center space-x-2 text-green-400 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-medium">3 peers available • Best match in Seoul</span>
        </div>

        {/* Savings Info */}
        <div className="bg-yellow-100 rounded-2xl p-4">
          <div className="text-center">
            <div className="text-orange-600 font-bold text-lg">
              Save RM 28.50
            </div>
            <div className="text-orange-600 text-sm">
              vs Wise (Rate: 295.10)
            </div>
          </div>
        </div>

        {/* Exchange Button */}
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-4 font-bold text-white text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
          Continue Exchange
        </button>
      </div>

      {/* Additional Info Cards */}
      <div className="mt-4 space-y-3">
        {/* Transaction Details */}
        <div className="bg-black bg-opacity-40 rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-3">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Exchange Rate</span>
              <span className="text-white">300.25 KRW</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Fee</span>
              <span className="text-white">RM 0.00</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Processing Time</span>
              <span className="text-white">1-2 minutes</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-black bg-opacity-40 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Secure P2P Exchange</p>
              <p className="text-gray-300 text-xs mt-1">Your funds are protected by escrow until the exchange is completed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 