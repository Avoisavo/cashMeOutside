import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { currencies, mockBalances } from '../data/balances';

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

  return (
    <div className="px-4 pb-4 space-y-6">
      {/* Currency Balances Section */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-2">
          {currencies.map((c) => (
            <div key={c.code} className="flex-shrink-0 w-72 bg-[#695E93] rounded-3xl p-8 backdrop-blur-sm border border-gray-600 relative overflow-hidden">
              {/* Top-Up Plus Button */}
              <button className="absolute top-6 right-6 w-10 h-10 bg-[#695E93] bg-opacity-20 rounded-full flex items-center justify-center shadow-lg border border-white border-opacity-30 hover:shadow-xl hover:scale-105 transition-all duration-200">
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
                    <p className="text-white font-medium text-sm">
                      {transaction.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-xs">
                        {transaction.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      transaction.amount > 0 ? "text-green-400" : "text-white"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount} {transaction.currency}
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
