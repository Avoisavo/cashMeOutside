import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { currencies, mockBalances } from '../data/balances';
import { QRCodeCanvas } from 'qrcode.react';

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
  const [balance, setBalance] = useState<Record<string, number>>({
    "MYR": 5000,
    "KRW": 5000000,
    "USD": 1200,
    "AUD": 800,
    "GBP": 400,
    "JPY": 100000
  });

  // Load balances from localStorage or fallback to mock
  useEffect(() => {
    const updateBalances = () => {
      const newBalances: any = { ...mockBalances };
      currencies.forEach((c) => {
        const key = c.code + "Balance";
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          newBalances[c.code] = parseFloat(stored);
        }
      });
      setBalance(newBalances);
    };

    updateBalances();
    window.addEventListener('focus', updateBalances);
    return () => window.removeEventListener('focus', updateBalances);
  }, []);

  // Calculate amounts under sell orders for each currency
  const [sellOrderAmounts, setSellOrderAmounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const ordersRaw = localStorage.getItem('activeSellOrders');
    if (ordersRaw) {
      const orders = JSON.parse(ordersRaw);
      const amounts: Record<string, number> = {};
      orders.forEach((order: any) => {
        if (order.fromCurrency && order.fromAmount) {
          amounts[order.fromCurrency] = (amounts[order.fromCurrency] || 0) + parseFloat(order.fromAmount);
        }
      });
      setSellOrderAmounts(amounts);
    }
  }, []);

  const accountNumber = "90332";

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "pending",
      title: "Celebrity Fitness",
      amount: -58,
      currency: "MYR",
      date: "Yesterday",
      status: "pending",
      iconUrl:
        "https://img.icons8.com/?size=100&id=215&format=png&color=FFFFFF",
    },
    {
      id: "2",
      type: "receive",
      title: "To your MYR balance",
      amount: 101,
      currency: "MYR",
      date: "Sunday",
      status: "completed",
      iconUrl:
        "https://img.icons8.com/?size=100&id=3220&format=png&color=FFFFFF",
    },
    {
      id: "3",
      type: "send",
      title: "Starbucks Coffee",
      amount: -25.5,
      currency: "MYR",
      date: "Saturday",
      status: "completed",
      iconUrl:
        "https://img.icons8.com/?size=100&id=_7P8IeuWigJL&format=png&color=FFFFFF",
    },
    {
      id: "4",
      type: "send",
      title: "Grab Food Delivery",
      amount: -32.8,
      currency: "MYR",
      date: "Friday",
      status: "completed",
      iconUrl:
        "https://img.icons8.com/?size=100&id=_7P8IeuWigJL&format=png&color=FFFFFF",
    },
    {
      id: "5",
      type: "send",
      title: "Petrol Station",
      amount: -85.0,
      currency: "MYR",
      date: "Thursday",
      status: "completed",
      iconUrl:
        "https://img.icons8.com/?size=100&id=24723&format=png&color=FFFFFF",
    },
  ];

  const currentCurrency = currencies.find((c) => c.code === selectedCurrency);
  const currentBalance = balance[selectedCurrency as keyof typeof balance];

  const [qrModal, setQrModal] = useState<{currency: string, amount: number} | null>(null);

  return (
    <div className="px-4 pb-4 space-y-6">
      {/* QR Modal */}
      {qrModal && (
        <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-90 max-w-xs sm:max-w-sm md:max-w-md p-2 flex justify-center items-center pointer-events-none">
          <div className="bg-gray-900 rounded-3xl p-6 flex flex-col items-center relative w-full shadow-2xl border border-gray-700 pointer-events-auto">
            <button onClick={() => setQrModal(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">&times;</button>
            <h3 className="text-white font-bold text-lg mb-4">Payment QR</h3>
            <QRCodeCanvas value={`PAY:${qrModal.currency}:${accountNumber}:${qrModal.amount}`} size={160} bgColor="#181A20" fgColor="#F7FAFC" />
            <div className="mt-4 text-white text-center text-sm">
              {qrModal.currency} Account<br />
              <span className="font-mono">{accountNumber}</span><br />
              Amount: <span className="font-bold">{qrModal.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} {qrModal.currency}</span>
            </div>
          </div>
        </div>
      )}
      {/* Currency Balances Section */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-2">
          {currencies.map((c) => (
            <div key={c.code} className="flex-shrink-0 w-72 bg-[#695E93] rounded-3xl p-8 backdrop-blur-sm border border-gray-600 shadow-xl relative overflow-hidden mb-4">
              {/* Top-Up Plus Button */}
              <button onClick={() => setQrModal({currency: c.code, amount: balance[c.code] ?? 0})} className="absolute top-6 right-6 w-10 h-10 bg-[#695E93] bg-opacity-20 rounded-full flex items-center justify-center shadow-lg border border-white border-opacity-30 hover:shadow-xl hover:scale-105 transition-all duration-200">
                <svg
                  className="w-5 h-5 text-white drop-shadow-sm"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={c.flag}
                    alt={`${c.code} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-bold text-base">{c.code}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm">·· {accountNumber}</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {c.symbol}{(balance[c.code] ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {sellOrderAmounts[c.code] > 0 && (
                  <div className="text-xs text-yellow-300 mt-1">In Sell Orders: {sellOrderAmounts[c.code].toLocaleString(undefined, { maximumFractionDigits: 2 })} {c.code}</div>
                )}
              </div>
            </div>
          ))}
          {/* Add Another Currency Card */}
          <div className="flex-shrink-0 w-48 bg-[#695E93] bg-opacity-40 rounded-3xl p-6 backdrop-blur-sm border border-gray-600 flex flex-col items-center justify-center">
            <button className="w-10 h-10 bg-[#695E93] bg-opacity-40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 hover:shadow-xl hover:scale-105 transition-all duration-200 mb-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <span className="text-white-300 text-xs text-center leading-tight">
              Add another currency account
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Transactions</h2>
          <button className="text-gray-300 hover:text-white transition-colors">
            <span className="text-white-sm underline">See all</span>
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 rounded-3xl p-5 border border-gray-800 mb-3 flex items-center transition-all cursor-pointer hover:scale-[1.02] hover:bg-gray-800/80 shadow-md w-full"
            >
              {/* Transaction Icon */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-700/60 to-indigo-900/60 border border-gray-700 flex items-center justify-center mr-4 shadow-md">
                {transaction.iconUrl ? (
                  <img
                    src={transaction.iconUrl}
                    alt={transaction.title}
                    className="w-4 h-4"
                  />
                ) : (
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                )}
              </div>
              {/* Transaction Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base truncate">{transaction.title}</p>
                <span className="block text-gray-400 text-xs mt-0.5">{transaction.date}</span>
              </div>
              {/* Amount */}
              <div className={`ml-4 text-right font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'} text-lg drop-shadow`} style={{minWidth:'80px'}}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.currency}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
