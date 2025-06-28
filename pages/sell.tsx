import { useState } from "react";
import { useRouter } from "next/router";

const currencies = [
  { code: "MYR", name: "Malaysian Ringgit", flag: "https://flagcdn.com/w40/my.png" },
  { code: "KRW", name: "South Korean Won", flag: "https://flagcdn.com/w40/kr.png" },
  { code: "USD", name: "US Dollar", flag: "https://flagcdn.com/w40/us.png" },
  { code: "AUD", name: "Australian Dollar", flag: "https://flagcdn.com/w40/au.png" },
  { code: "GBP", name: "British Pound", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "JPY", name: "Japanese Yen", flag: "https://flagcdn.com/w40/jp.png" }
];

// Mock balances
const mockBalances: Record<string, number> = {
  "MYR": 5000,
  "KRW": 30000,
  "USD": 1200,
  "AUD": 800,
  "GBP": 400,
  "JPY": 100000
};

// Mock rates (1 FROM = X TO)
const mockRates: Record<string, number> = {
  "KRW/MYR": 0.003,
  "MYR/KRW": 325.25,
  "USD/MYR": 4.72,
  "MYR/USD": 0.21,
  "AUD/MYR": 3.15,
  "MYR/AUD": 0.32,
  // Add more as needed
};

export default function Sell() {
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState("KRW");
  const [toCurrency, setToCurrency] = useState("MYR");
  const [fromAmount, setFromAmount] = useState("");
  const [fee] = useState(0); // Mock fee

  // Calculate receive amount
  const rateKey = `${fromCurrency}/${toCurrency}`;
  const rate = mockRates[rateKey] || 0;
  const receiveAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(2) : "";

  // Handle swap
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount("");
  };

  // Handle max
  const handleMax = () => {
    setFromAmount(mockBalances[fromCurrency].toString());
  };

  // Handle sell
  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Sell order placed: ${fromAmount} ${fromCurrency} for ${receiveAmount} ${toCurrency}`);
    setFromAmount("");
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl mt-8">
        <h2 className="text-white text-xl font-bold mb-6 text-center">Sell {fromCurrency}/{toCurrency}</h2>
        <form onSubmit={handleSell} className="space-y-6">
          {/* Rate Row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 font-medium">Rate</span>
            <span className="bg-gray-800 text-white px-3 py-1 rounded-lg font-mono">{rate} {toCurrency}</span>
          </div>

          {/* Exchange Box */}
          <div className="bg-gray-900 rounded-xl p-4 mb-2">
            {/* From Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={currencies.find(c => c.code === fromCurrency)?.flag} alt={fromCurrency} className="w-7 h-5 rounded object-cover border border-gray-700" />
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  className="bg-transparent text-white font-bold text-lg appearance-none outline-none"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code} className="text-black">{c.code}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={fromAmount}
                  onChange={e => setFromAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent text-white text-lg font-bold text-right w-24 outline-none border-b border-white/20 focus:border-purple-400 transition-all"
                />
                <button type="button" onClick={handleMax} className="text-blue-400 text-xs font-semibold hover:underline">MAX</button>
              </div>
            </div>
            <div className="text-gray-400 text-xs mb-2">{fromCurrency} Balance: {mockBalances[fromCurrency].toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
            {/* Swap Button */}
            <div className="flex justify-center py-2">
              <button 
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg border-4 border-black"
                aria-label="Swap currencies"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l4-4m0 0l-4-4m4 4H7m-4 4l4-4m0 0l-4-4m4 4h13" />
                </svg>
              </button>
            </div>
            {/* To Row */}
            <div className="flex items-center gap-2 mt-2">
              <img src={currencies.find(c => c.code === toCurrency)?.flag} alt={toCurrency} className="w-7 h-5 rounded object-cover border border-gray-700" />
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="bg-transparent text-white font-bold text-lg appearance-none outline-none"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code} className="text-black">{c.code}</option>
                ))}
              </select>
              <input
                type="text"
                value={receiveAmount}
                readOnly
                placeholder="0"
                className="bg-transparent text-white text-lg font-bold text-right w-24 outline-none border-b border-white/20"
              />
            </div>
          </div>

          {/* Rate, Fee, Receive */}
          <div className="flex items-center justify-between text-gray-300 text-sm mb-1">
            <span>1 {fromCurrency} ≈ {rate} {toCurrency}</span>
            <span>Fee <span className="text-white font-mono">{fee}</span></span>
          </div>
          <div className="flex items-center justify-between text-gray-300 text-sm mb-4">
            <span>Receive</span>
            <span className="text-white font-bold text-lg">{receiveAmount} {toCurrency}</span>
          </div>

          {/* Sell Button */}
          <button
            type="submit"
            disabled={!fromAmount || parseFloat(fromAmount) === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sell
          </button>
        </form>
      </div>
    </div>
  );
} 