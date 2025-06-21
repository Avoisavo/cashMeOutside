import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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

  const currencies = [
    { code: "MYR", name: "Malaysian Ringgit", flag: "https://flagcdn.com/w40/my.png" },
    { code: "KRW", name: "South Korean Won", flag: "https://flagcdn.com/w40/kr.png" },
    { code: "USD", name: "US Dollar", flag: "https://flagcdn.com/w40/us.png" },
    { code: "AUD", name: "Australian Dollar", flag: "https://flagcdn.com/w40/au.png" },
    { code: "GBP", name: "British Pound", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "JPY", name: "Japanese Yen", flag: "https://flagcdn.com/w40/jp.png" }
  ];

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
    const queryParams = new URLSearchParams({
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      amount: amount,
      rate: bestRate.toString()
    });
    router.push(`/exchange?${queryParams.toString()}`);
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
      <div className="bg-black bg-opacity-40 rounded-3xl p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-xl font-bold text-white text-center">Currency Exchange</h2>
        
        {/* From Currency Row */}
        <div className="flex items-center justify-between">
          {/* Currency Selector */}
          <button onClick={() => openModal('from')} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="w-10 h-8 rounded-md overflow-hidden border border-gray-600">
              <img 
                src={currencies.find(c => c.code === fromCurrency)?.flag} 
                alt={fromCurrency} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-lg">{fromCurrency}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
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
          <button onClick={() => openModal('to')} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="w-10 h-8 rounded-md overflow-hidden border border-gray-600">
              <img 
                src={currencies.find(c => c.code === toCurrency)?.flag} 
                alt={toCurrency} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-lg">{toCurrency}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
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

      {isModalOpen && (
        <CurrencySelectionModal
          currencies={currencies}
          onSelect={handleCurrencySelect}
          onClose={closeModal}
        />
      )}

      {/* Additional Info Cards */}
      <div className="mt-4 space-y-3">
        {/* Transaction Details */}
        <div className="bg-black bg-opacity-40 rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-3">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Exchange Rate</span>
              <span className="text-white">{bestRate.toFixed(2)} {toCurrency}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Fee</span>
              <span className="text-white">{fromCurrency} 0.00</span>
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

const CurrencySelectionModal = ({ currencies, onSelect, onClose }: {
  currencies: { code: string, name: string, flag: string }[];
  onSelect: (code: string) => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-6 w-11/12 max-w-sm border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold">Select Currency</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {currencies.map(currency => (
          <button
            key={currency.code}
            onClick={() => onSelect(currency.code)}
            className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <img src={currency.flag} alt={currency.name} className="w-10 h-8 rounded-md object-cover" />
            <div>
              <p className="text-white font-semibold text-left">{currency.code}</p>
              <p className="text-gray-400 text-sm text-left">{currency.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
); 