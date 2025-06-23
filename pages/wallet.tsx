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
  icon?: string;
}

export default function Wallet() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState("MYR");
  
  // Mock wallet data
  const balance = {
    MYR: 43.00,
    USD: 12240.00,
    KRW: 850000,
    AUD: 1850.50
  };

  const accountNumber = "90332";
  
  const currencies = [
    { code: "MYR", symbol: "RM", flag: "🇲🇾" },
    { code: "USD", symbol: "$", flag: "🇺🇸" },
    { code: "KRW", symbol: "₩", flag: "🇰🇷" },
    { code: "AUD", symbol: "A$", flag: "🇦🇺" }
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
      icon: "🏃"
    },
    {
      id: "2", 
      type: "receive",
      title: "To your MYR balance",
      amount: 101,
      currency: "MYR",
      date: "Sunday",
      status: "completed",
      icon: "+"
    },
    {
      id: "3",
      type: "send",
      title: "Coffee Shop",
      amount: -25.50,
      currency: "MYR", 
      date: "Saturday",
      status: "completed",
      icon: "☕"
    },
    {
      id: "4",
      type: "receive",
      title: "Salary Deposit",
      amount: 3500,
      currency: "MYR",
      date: "Friday",
      status: "completed",
      icon: "💰"
    }
  ];

  const handleSend = () => {
    router.push("/trade");
  };

  const handleAddMoney = () => {
    // Navigate to add money functionality
    console.log("Add money clicked");
  };

  const handleRequest = () => {
    // Navigate to request money functionality
    console.log("Request money clicked");
  };

  const currentCurrency = currencies.find(c => c.code === selectedCurrency);
  const currentBalance = balance[selectedCurrency as keyof typeof balance];

  return (
    <div className="px-4 pb-4 space-y-6">
      {/* Earn Banner */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl px-4 py-3 flex items-center justify-between">
        <span className="text-black font-semibold text-sm">Earn MYR 150</span>
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Welcome to Wise</h1>
          <div className="w-8 h-8 bg-black bg-opacity-40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button 
            onClick={handleSend}
            className="bg-green-500 text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-green-400 transition-colors"
          >
            Send
          </button>
          <button 
            onClick={handleAddMoney}
            className="bg-black bg-opacity-40 text-white px-6 py-3 rounded-full font-semibold text-sm backdrop-blur-sm border border-gray-600 hover:bg-opacity-60 transition-all"
          >
            Add money
          </button>
          <button 
            onClick={handleRequest}
            className="bg-black bg-opacity-40 text-white px-6 py-3 rounded-full font-semibold text-sm backdrop-blur-sm border border-gray-600 hover:bg-opacity-60 transition-all"
          >
            Request
          </button>
        </div>
      </div>

      {/* Currency Balance Card */}
      <div className="bg-black bg-opacity-40 rounded-3xl p-6 backdrop-blur-sm border border-gray-600 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 flex items-center justify-center text-lg">
              {currentCurrency?.flag}
            </div>
            <span className="text-white font-bold text-lg">{selectedCurrency}</span>
          </div>
          
          <button 
            onClick={() => {
              const currencies = ["MYR", "USD", "KRW", "AUD"];
              const currentIndex = currencies.indexOf(selectedCurrency);
              const nextIndex = (currentIndex + 1) % currencies.length;
              setSelectedCurrency(currencies[nextIndex]);
            }}
            className="w-10 h-10 bg-black bg-opacity-40 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600 hover:bg-opacity-60 transition-all"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
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

        {/* Add another currency option */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          <button className="flex items-center justify-between w-full text-gray-300 hover:text-white transition-colors">
            <span className="text-sm">Add another currency account</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Transactions</h2>
          <button className="text-gray-300 hover:text-white transition-colors">
            <span className="text-sm">See all</span>
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    transaction.type === "pending" 
                      ? "bg-yellow-500 bg-opacity-20 border border-yellow-500" 
                      : transaction.type === "receive"
                      ? "bg-green-500 bg-opacity-20 border border-green-500"
                      : "bg-red-500 bg-opacity-20 border border-red-500"
                  }`}>
                    {transaction.icon}
                  </div>
                  
                  <div>
                    <p className="text-white font-medium text-sm">{transaction.title}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${
                        transaction.status === "pending" 
                          ? "text-yellow-400" 
                          : transaction.status === "completed"
                          ? "text-gray-400"
                          : "text-red-400"
                      }`}>
                        {transaction.status === "pending" ? "Pending" : transaction.date}
                      </span>
                      {transaction.status === "pending" && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400 text-xs">{transaction.date}</span>
                        </>
                      )}
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

      {/* Transfer Calculator */}
      <div className="bg-black bg-opacity-40 rounded-2xl p-4 backdrop-blur-sm border border-gray-600">
        <h3 className="text-white font-semibold mb-2">Transfer calculator</h3>
        <p className="text-gray-300 text-sm">Calculate fees and exchange rates before you send money.</p>
      </div>
    </div>
  );
} 