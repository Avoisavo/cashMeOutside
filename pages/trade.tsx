import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { currencies, mockBalances } from '../data/balances';

interface Order {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  timestamp: number;
  status: string;
  balanceLocked: boolean;
}

// Heroicons SVGs for check and sparkle
const CheckIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const SparkleIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
);

export default function Trade() {
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState("MYR");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [amount, setAmount] = useState("1000");
  const [convertedAmount, setConvertedAmount] = useState("0");
  const [bestRate, setBestRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderBook, setOrderBook] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currencyToChange, setCurrencyToChange] = useState<'from' | 'to' | null>(null);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [hasSellOrders, setHasSellOrders] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Traditional rates for comparison
  const traditionalRates = {
    "MYR-KRW": 295,
    "MYR-USD": 0.21,
    "MYR-AUD": 0.32,
    "USD-KRW": 1350,
    "AUD-KRW": 900
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadOrderBook();
    }
  }, []);

  useEffect(() => {
    if (orderBook.length > 0) {
      calculateBestRate();
    }
  }, [orderBook, fromCurrency, toCurrency, amount]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ordersRaw = localStorage.getItem('activeSellOrders');
      const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
      setHasSellOrders(orders.length > 0);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadOrderBook = async () => {
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/api/match');
        const data = await response.json();
        if (data.success) {
          setOrderBook(data.orderBook);
        }
      } catch (error) {
        console.error('Failed to load order book:', error);
      }
    }
  };

  const calculateBestRate = () => {
    const numAmount = Number(amount) || 0;
    if (numAmount === 0) {
      setConvertedAmount("0");
      setBestRate(0);
      return;
    }

    // Find direct matches for the currency pair
    const directMatches = orderBook.filter(order => 
      order.status === "open" &&
      order.fromCurrency === fromCurrency &&
      order.toCurrency === toCurrency
    );

    // Find multi-hop matches (e.g., MYR → USD → KRW)
    const multiHopMatches = findMultiHopMatches();

    let bestMatch = null;
    let bestRate = 0;

    // Check direct matches
    if (directMatches.length > 0) {
      const bestDirect = directMatches.reduce((best, current) => 
        current.rate > best.rate ? current : best
      );
      bestMatch = bestDirect;
      bestRate = bestDirect.rate;
    }

    // Check multi-hop matches
    if (multiHopMatches.length > 0) {
      const bestMultiHop = multiHopMatches.reduce((best, current) => 
        current.effectiveRate > best.effectiveRate ? current : best
      );
      
      if (bestMultiHop.effectiveRate > bestRate) {
        bestMatch = bestMultiHop;
        bestRate = bestMultiHop.effectiveRate;
      }
    }

    // If no P2P matches found, use traditional rate
    if (bestRate === 0) {
      const key = `${fromCurrency}-${toCurrency}`;
      bestRate = traditionalRates[key as keyof typeof traditionalRates] || 0;
    }

    setBestRate(bestRate);
    setConvertedAmount((numAmount * bestRate).toFixed(2));
  };

  const findMultiHopMatches = () => {
    const matches = [];
    
    // Find MYR → USD → KRW path
    if (fromCurrency === "MYR" && toCurrency === "KRW") {
      const myrToUsd = orderBook.find(order => 
        order.status === "open" && 
        order.fromCurrency === "MYR" && 
        order.toCurrency === "USD"
      );
      const usdToKrw = orderBook.find(order => 
        order.status === "open" && 
        order.fromCurrency === "USD" && 
        order.toCurrency === "KRW"
      );
      
      if (myrToUsd && usdToKrw) {
        const effectiveRate = myrToUsd.rate * usdToKrw.rate;
        matches.push({
          path: [myrToUsd, usdToKrw],
          effectiveRate: effectiveRate
        });
      }
    }

    // Find MYR → AUD → KRW path
    if (fromCurrency === "MYR" && toCurrency === "KRW") {
      const myrToAud = orderBook.find(order => 
        order.status === "open" && 
        order.fromCurrency === "MYR" && 
        order.toCurrency === "AUD"
      );
      const audToKrw = orderBook.find(order => 
        order.status === "open" && 
        order.fromCurrency === "AUD" && 
        order.toCurrency === "KRW"
      );
      
      if (myrToAud && audToKrw) {
        const effectiveRate = myrToAud.rate * audToKrw.rate;
        matches.push({
          path: [myrToAud, audToKrw],
          effectiveRate: effectiveRate
        });
      }
    }

    return matches;
  };

  const getTraditionalRate = (): number => {
    const key = `${fromCurrency}-${toCurrency}`;
    return traditionalRates[key as keyof typeof traditionalRates] || 0;
  };

  const getSavings = (): number => {
    const traditionalRate = getTraditionalRate();
    const traditionalAmount = Number(amount) * traditionalRate;
    const p2pAmount = Number(amount) * bestRate;
    return p2pAmount - traditionalAmount;
  };

  const swapCurrencies = () => {
    if (fromCurrency === toCurrency) return;
    setFromCurrency(toCurrency);
    // After swap, if they become the same, pick a different 'to'
    const newTo = currencies.find(c => c.code !== toCurrency)?.code || fromCurrency;
    setToCurrency(newTo);
  };

  const handleContinueExchange = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('exchangeIntent', JSON.stringify({ fromCurrency, toCurrency, amount }));
      router.push('/exchange');
    }
  };

  const formatNumber = (num: string) => {
    const number = Number(num);
    if (number >= 1000) {
      return number.toLocaleString();
    }
    return num;
  };

  const openModal = (type: 'from' | 'to') => {
    setCurrencyToChange(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrencyToChange(null);
  };

  const handleFromSelect = (code: string) => {
    setFromCurrency(code);
    if (code === toCurrency) {
      // Pick a different toCurrency (first one that's not the same)
      const newTo = currencies.find(c => c.code !== code)?.code || toCurrency;
      setToCurrency(newTo);
    }
    setShowFromDropdown(false);
  };

  const handleToSelect = (code: string) => {
    setToCurrency(code);
    if (code === fromCurrency) {
      // Pick a different fromCurrency (first one that's not the same)
      const newFrom = currencies.find(c => c.code !== code)?.code || fromCurrency;
      setFromCurrency(newFrom);
    }
    setShowToDropdown(false);
  };

  // Helper to get up-to-date balance
  const getBalance = (code: string) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(code + "Balance");
      return stored !== null ? parseFloat(stored) : mockBalances[code] || 0;
    }
    return 0;
  };

  // Force re-render on storage/focus
  const [, setRefresh] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const refresh = () => setRefresh(v => v + 1);
      window.addEventListener('focus', refresh);
      window.addEventListener('storage', refresh);
      return () => {
        window.removeEventListener('focus', refresh);
        window.removeEventListener('storage', refresh);
      };
    }
  }, []);

  const insufficientBalance = amount !== "" && parseFloat(amount) > getBalance(fromCurrency);

  return (
    <div className="px-4 pb-4">
      {/* Main Trade Card */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-3xl p-6 backdrop-blur-sm space-y-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-white text-center">Exchange</h2>
        
        {/* From Currency Row */}
        <div className="bg-gray-900 rounded-2xl p-4 flex flex-col relative mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs font-semibold">From</span>
            <span className="text-gray-400 text-xs">Available Balance {mounted ? getBalance(fromCurrency).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--"}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent hover:bg-gray-700 transition-colors"
                onClick={() => setShowFromDropdown((v) => !v)}
              >
                <img src={currencies.find(c => c.code === fromCurrency)?.flag} alt={fromCurrency} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-white font-bold text-lg">{fromCurrency}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFromDropdown && (
                <div className="absolute z-20 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handleFromSelect(c.code)}
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700 text-white rounded-xl gap-2"
                    >
                      <span className="flex items-center gap-2">
                        <img src={c.flag} alt={c.code} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold">{c.code}</span>
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{mounted ? getBalance(c.code).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--"}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-white text-lg font-bold text-right w-24 outline-none"
                placeholder="0"
              />
              <span className="text-gray-500">|</span>
              <button type="button" onClick={() => setAmount(getBalance(fromCurrency).toString())} className="text-yellow-400 text-xs font-semibold hover:underline">Max</button>
            </div>
          </div>
          {mounted && insufficientBalance && (
            <div className="text-red-400 text-xs mt-1">Insufficient balance</div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-4 z-10 relative">
          <button 
            onClick={swapCurrencies}
            className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-lg border-4 border-black"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Currency Row */}
        <div className="bg-gray-900 rounded-2xl p-4 flex flex-col relative mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs font-semibold">To</span>
            <span className="text-gray-400 text-xs">&nbsp;</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent hover:bg-gray-700 transition-colors"
                onClick={() => setShowToDropdown((v) => !v)}
              >
                <img src={currencies.find(c => c.code === toCurrency)?.flag} alt={toCurrency} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-white font-bold text-lg">{toCurrency}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showToDropdown && (
                <div className="absolute z-20 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handleToSelect(c.code)}
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700 text-white rounded-xl gap-2"
                    >
                      <span className="flex items-center gap-2">
                        <img src={c.flag} alt={c.code} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold">{c.code}</span>
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{mounted ? getBalance(c.code).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--"}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              value={formatNumber(convertedAmount)}
              readOnly
              placeholder="0"
              className="bg-transparent text-white text-lg font-bold text-right w-32 outline-none"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Exchange Rate Info - Modern layout */}
        <div className="mb-2">
          <div className="text-xs text-gray-400 font-semibold mb-1">
            1.00 {fromCurrency} =
          </div>
          <div className="text-3xl font-extrabold flex items-end">
            <span className="text-white">{bestRate.toFixed(8)}</span>
            <span className="ml-2 text-gray-400 font-bold text-2xl">{toCurrency}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            1 {toCurrency} = {(1 / bestRate).toFixed(5)} {fromCurrency}
          </div>
        </div>
        <div className="border-t border-gray-700 my-4"></div>

        {/* P2P Status Row */}
        <div className="my-2 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 bg-green-900/40 text-green-400 rounded-full text-xs font-semibold">
            <CheckIcon /> P2P matches available
          </span>
          <span className="inline-flex items-center px-2 py-0.5 bg-yellow-900/40 text-yellow-400 rounded-full text-xs font-semibold">
            Best rate found
          </span>
        </div>

        {/* Savings Info - Inline, no card */}
        {getSavings() > 0 && (
          <div className="flex items-center border-l-4 border-yellow-400 pl-2 py-1 bg-yellow-900/10 rounded-lg my-2">
            <SparkleIcon />
            <span className="text-yellow-300 font-semibold text-sm">
              Save {getSavings().toFixed(2)} {toCurrency}
            </span>
            <span className="text-yellow-300 text-xs ml-2">
              vs Traditional (Rate: {getTraditionalRate()})
            </span>
          </div>
        )}

        {/* Exchange Button */}
        <button 
          onClick={handleContinueExchange}
          disabled={Number(amount) === 0 || insufficientBalance || !hasSellOrders}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg hover:from-yellow-500 hover:to-yellow-400 transition-all text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue Exchange
        </button>
      </div>

      {/* Additional Info Cards */}
      <div className="mt-4 space-y-3">
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