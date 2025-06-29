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

  // Traditional rates for comparison
  const traditionalRates = {
    "MYR-KRW": 295,
    "MYR-USD": 0.21,
    "MYR-AUD": 0.32,
    "USD-KRW": 1350,
    "AUD-KRW": 900
  };

  useEffect(() => {
    loadOrderBook();
  }, []);

  useEffect(() => {
    if (orderBook.length > 0) {
      calculateBestRate();
    }
  }, [orderBook, fromCurrency, toCurrency, amount]);

  const loadOrderBook = async () => {
    try {
      const response = await fetch('/api/match');
      const data = await response.json();
      if (data.success) {
        setOrderBook(data.orderBook);
      }
    } catch (error) {
      console.error('Failed to load order book:', error);
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
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleContinueExchange = () => {
    localStorage.setItem('exchangeIntent', JSON.stringify({ fromCurrency, toCurrency, amount }));
    router.push('/exchange');
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

  const handleCurrencySelect = (currencyCode: string) => {
    if (currencyToChange === 'from') {
      if (currencyCode === toCurrency) {
        setToCurrency(fromCurrency);
      }
      setFromCurrency(currencyCode);
    } else if (currencyToChange === 'to') {
      if (currencyCode === fromCurrency) {
        setFromCurrency(toCurrency);
      }
      setToCurrency(currencyCode);
    }
    closeModal();
  };

  return (
    <div className="px-4 pb-4">
      {/* Main Trade Card */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-3xl p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-xl font-bold text-white text-center">Currency Exchange</h2>
        
        {/* From Currency Row */}
        <div className="flex items-center justify-between">
          {/* Currency Selector */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
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
                    onClick={() => { setFromCurrency(c.code); setShowFromDropdown(false); }}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700 text-white rounded-xl gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <img src={c.flag} alt={c.code} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold">{c.code}</span>
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{mockBalances[c.code]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </button>
                ))}
              </div>
            )}
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
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
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
                    onClick={() => { setToCurrency(c.code); setShowToDropdown(false); }}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700 text-white rounded-xl gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <img src={c.flag} alt={c.code} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold">{c.code}</span>
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{mockBalances[c.code]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Converted Amount */}
          <div className="flex-1 text-right ml-4">
            <div className="text-2xl font-bold text-white">
              {formatNumber(convertedAmount)}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-6"></div>

        {/* Exchange Rate Info */}
        <div className="bg-green-500 rounded-2xl p-4">
          <div className="text-center">
            <div className="text-white font-bold text-lg mb-1">
              1 {fromCurrency} = {bestRate.toFixed(2)} {toCurrency}
            </div>
            <div className="text-white text-sm opacity-90">
              P2P Rate • Updated 2s ago
            </div>
          </div>
        </div>

        {/* Peer Info */}
        <div className="flex items-center justify-center space-x-2 text-green-400 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-medium">P2P matches available • Best rate found</span>
        </div>

        {/* Savings Info */}
        {getSavings() > 0 && (
        <div className="bg-yellow-100 rounded-2xl p-4">
          <div className="text-center">
            <div className="text-orange-600 font-bold text-lg">
                Save {getSavings().toFixed(2)} {toCurrency}
            </div>
            <div className="text-orange-600 text-sm">
                vs Traditional (Rate: {getTraditionalRate()})
              </div>
            </div>
          </div>
        )}

        {/* Exchange Button */}
        <button 
          onClick={handleContinueExchange}
          disabled={Number(amount) === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-4 font-bold text-white text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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