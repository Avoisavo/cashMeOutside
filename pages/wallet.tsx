import { useState } from "react";
import { useRouter } from "next/router";

interface Transaction {
  id: string;
  type: "send" | "receive" | "pending";
  title: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "failed";
  iconUrl?: string;
}

export default function Wallet() {
  const router = useRouter();
  const selectedCurrency = "MYR";
  
  // Mock wallet data
  const balance = {
    MYR: 43.00,
    USD: 12240.00,
    KRW: 850000,
    AUD: 1850.50
  };

  const accountNumber = "90332";
  
  const currencies = [
    { code: "MYR", symbol: "RM", flag: "https://flagcdn.com/w40/my.png" },
    { code: "USD", symbol: "$", flag: "https://flagcdn.com/w40/us.png" },
    { code: "KRW", symbol: "₩", flag: "https://flagcdn.com/w40/kr.png" },
    { code: "AUD", symbol: "A$", flag: "https://flagcdn.com/w40/au.png" }
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "pending",
      title: "Bhub Bouldering",
      amount: -58,
      currency: "MYR",
      date: "Yesterday",
      status: "pending",
      iconUrl: "https://img.icons8.com/?size=100&id=215&format=png&color=FFFFFF"
    },
    {
      id: "2", 
      type: "receive",
      title: "To your MYR balance",
      amount: 101,
      currency: "MYR",
      date: "Sunday",
      status: "completed",
      iconUrl: "https://img.icons8.com/?size=100&id=3220&format=png&color=FFFFFF"
    },
    {
      id: "3",
      type: "send",
      title: "Starbucks Coffee",
      amount: -25.50,
      currency: "MYR", 
      date: "Saturday",
      status: "completed",
      iconUrl: "https://img.icons8.com/?size=100&id=_7P8IeuWigJL&format=png&color=FFFFFF"
    }
  ];

  const currentCurrency = currencies.find(c => c.code === selectedCurrency);
  const currentBalance = balance[selectedCurrency as keyof typeof balance];

  return (
    <div className="px-4 pb-4 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Welcome to Wise</h1>
          <div className="w-8 h-8 bg-black bg-opacity-40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Currency Balance Section */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-2">
          {/* Current Currency Card */}
          <div className="flex-shrink-0 w-72 bg-black bg-opacity-40 rounded-3xl p-8 backdrop-blur-sm border border-gray-600 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src={currentCurrency?.flag} 
                  alt={`${selectedCurrency} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-bold text-base">{selectedCurrency}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm">·· {accountNumber}</span>
              </div>
              
              <div className="text-4xl font-bold text-white">
                {currentCurrency?.symbol}{currentBalance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Add Another Currency Card */}
          <div className="flex-shrink-0 w-48 bg-black bg-opacity-40 rounded-3xl p-6 backdrop-blur-sm border border-gray-600 flex flex-col items-center justify-center">
            <button className="w-10 h-10 bg-black bg-opacity-40 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600 hover:bg-opacity-60 transition-all mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-xs text-center leading-tight">Add another currency account</span>
          </div>

          {/* Spacer to ensure proper scrolling */}
          <div className="flex-shrink-0 w-4"></div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Transactions</h2>
          <button className="text-gray-300 hover:text-white transition-colors">
            <span className="text-sm underline">See all</span>
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="bg-black bg-opacity-40 rounded-2xl p-4 backdrop-blur-sm border border-gray-600 hover:bg-opacity-60 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-black bg-opacity-60 border border-gray-600 flex items-center justify-center backdrop-blur-sm">
                    {transaction.iconUrl ? (
                      <img 
                        src={transaction.iconUrl} 
                        alt={transaction.title}
                        className="w-5 h-5"
                      />
                    ) : (
                      <div className="w-5 h-5 bg-gray-400 rounded"></div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-white font-medium text-sm">{transaction.title}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-xs">
                        {transaction.date}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.amount > 0 ? "text-green-400" : "text-white"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount} {transaction.currency}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 