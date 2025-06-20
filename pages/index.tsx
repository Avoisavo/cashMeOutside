import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  
  const rates = [
    { 
      flagUrl: "https://flagcdn.com/w40/my.png", 
      country: "Malaysia", 
      code: "MYR", 
      rate: "RM 4.72", 
      change: "+0.085%", 
      isNegative: false 
    },
    { 
      flagUrl: "https://flagcdn.com/w40/au.png", 
      country: "Australia", 
      code: "AUD", 
      rate: "$1.4998", 
      change: "+0.070%", 
      isNegative: false 
    },
    { 
      flagUrl: "https://flagcdn.com/w40/gb.png", 
      country: "United Kingdom", 
      code: "GBP", 
      rate: "£0.8124", 
      change: "+0.045%", 
      isNegative: false 
    },
    { 
      flagUrl: "https://flagcdn.com/w40/jp.png", 
      country: "Japan", 
      code: "JPY", 
      rate: "¥156.42", 
      change: "-0.12%", 
      isNegative: true 
    },
    { 
      flagUrl: "https://flagcdn.com/w40/cn.png", 
      country: "China", 
      code: "RMB", 
      rate: "¥7.24", 
      change: "+0.032%", 
      isNegative: false 
    }
  ];

  return (
    <>
      {/* Main Balance Card */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-orange-400 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          {/* Currency Selector and Add Balance Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-400 bg-opacity-30 rounded-full px-4 py-2 backdrop-blur-sm border border-white border-opacity-30">
              <span className="text-white font-semibold text-sm">USD</span>
            </div>
            
            {/* Add Balance Icon */}
            <button className="w-10 h-10 bg-purple-400 bg-opacity-20 rounded-full flex items-center justify-center shadow-lg border border-white border-opacity-30 hover:shadow-xl hover:scale-105 transition-all duration-200">
              <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Balance Label and Amount */}
          <div className="mb-3">
            <p className="text-white text-opacity-80 text-xs font-medium mb-2 uppercase tracking-wide">Balance</p>
            <h1 className="text-3xl font-bold text-white mb-1">$12,240.00</h1>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-bold text-lg">+1.04%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Rates Section */}
      <div className="px-4 flex-1 mb-4">
        <div className="bg-black bg-opacity-40 rounded-3xl p-4 backdrop-blur-sm">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Today's Rates</h2>
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="text-sm">≈ 1 USD</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </div>

          {/* Rate Cards */}
          <div className="space-y-2">
            {rates.map((rate, index) => (
              <div 
                key={index}
                className={`
                  relative rounded-xl p-3 border transition-all duration-200 hover:scale-[1.02] cursor-pointer
                  ${rate.code === 'MYR' 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400/30 shadow-lg shadow-yellow-500/25' 
                    : 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/60'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-6 rounded-md overflow-hidden shadow-sm border border-white/20">
                      <img 
                        src={rate.flagUrl} 
                        alt={`${rate.country} flag`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className={`font-medium text-xs ${rate.code === 'MYR' ? 'text-black' : 'text-white'}`}>
                        {rate.country} / {rate.code}
                      </p>
                      <p className={`text-base font-semibold ${rate.code === 'MYR' ? 'text-black' : 'text-white'}`}>
                        {rate.rate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${
                      rate.isNegative 
                        ? 'text-red-400' 
                        : rate.code === 'MYR' 
                          ? 'text-black' 
                          : 'text-green-400'
                    }`}>
                      {rate.change}
                    </span>
                    <svg className={`w-3 h-3 ${rate.code === 'MYR' ? 'text-black/60' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </div>
                
                {/* Card highlight effect */}
                <div className={`absolute inset-0 rounded-xl ${
                  rate.code === 'MYR' 
                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20' 
                    : 'bg-gradient-to-r from-transparent to-transparent hover:from-white/5 hover:to-transparent'
                } pointer-events-none transition-all duration-200`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
