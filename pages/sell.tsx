import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';

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
    "KRW": 5000000,
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
    "GBP/MYR": 6.0,
    "MYR/GBP": 0.17,
    "JPY/MYR": 0.032,
    "MYR/JPY": 31.25,

    "KRW/USD": 0.00074,
    "USD/KRW": 1350,
    "KRW/AUD": 0.0011,
    "AUD/KRW": 900,
    "KRW/GBP": 0.00057,
    "GBP/KRW": 1750,
    "KRW/JPY": 0.11,
    "JPY/KRW": 9.1,

    "USD/AUD": 1.48,
    "AUD/USD": 0.68,
    "USD/GBP": 0.79,
    "GBP/USD": 1.27,
    "USD/JPY": 156.5,
    "JPY/USD": 0.0064,

    "AUD/GBP": 0.53,
    "GBP/AUD": 1.89,
    "AUD/JPY": 105.7,
    "JPY/AUD": 0.0095,

    "GBP/JPY": 198.2,
    "JPY/GBP": 0.0050,
};

// Mock active orders
const activeOrders = [
    {
        id: 1,
        pair: "KRW/MYR",
        amount: 1000,
        price: 0.003,
        status: "Open"
    },
    {
        id: 2,
        pair: "USD/JPY",
        amount: 200,
        price: 156.5,
        status: "Open"
    },
    {
        id: 3,
        pair: "AUD/GBP",
        amount: 50,
        price: 0.53,
        status: "Open"
    }
];

export default function Sell() {
    const router = useRouter();
    const [fromCurrency, setFromCurrency] = useState("KRW");
    const [toCurrency, setToCurrency] = useState("MYR");
    const [fromAmount, setFromAmount] = useState("");
    const [fee] = useState(0); // Mock fee
    const rateKey = `${fromCurrency}/${toCurrency}`;
    const defaultRate = mockRates[rateKey] || 0;
    const [editableRate, setEditableRate] = useState(defaultRate);
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    // Update editableRate when currencies change
    useEffect(() => {
        setEditableRate(mockRates[`${fromCurrency}/${toCurrency}`] || 0);
    }, [fromCurrency, toCurrency]);

    const receiveAmount = fromAmount && editableRate ? (parseFloat(fromAmount) * editableRate).toFixed(2) : "";

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
        const order = {
            fromCurrency,
            toCurrency,
            fromAmount,
            rate: editableRate,
            receiveAmount,
            date: new Date().toISOString(),
            orderNo: Math.floor(Math.random() * 1e18).toString(),
            user: `User${Math.random().toString(36).slice(2, 10)}`,
            type: 'Sell',
        };
        // Get existing orders
        const existing = JSON.parse(localStorage.getItem("activeSellOrders") || "[]");
        // Add new order
        localStorage.setItem("activeSellOrders", JSON.stringify([order, ...existing]));
        toast.success(`Sell order placed: ${fromAmount} ${fromCurrency} for ${receiveAmount} ${toCurrency}`);
        setFromAmount("");
    };

    // Mock market price for warning
    const marketPrice = mockRates[rateKey] || 0;
    const isBelowMarket = editableRate < marketPrice;

    // Dropdown handlers
    const handleFromSelect = (code: string) => {
        setFromCurrency(code);
        setShowFromDropdown(false);
    };
    const handleToSelect = (code: string) => {
        setToCurrency(code);
        setShowToDropdown(false);
    };

    const insufficientBalance = fromAmount !== "" && parseFloat(fromAmount) > mockBalances[fromCurrency];

    return (
        <div className="min-h-0 p-4 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Sell</h2>
            <Toaster position="bottom-center" containerClassName="!static" />
            <form
                onSubmit={handleSell}
                className="flex flex-col justify-between w-full max-w-md min-h-[60vh]"
            >
                {/* Market Price Row */}
                <div className="flex items-center justify-between text-gray-400 text-sm mb-2">
                    <span>Market price</span>
                    <span className="font-mono text-white">{marketPrice} {fromCurrency}/{toCurrency}</span>
                </div>

                {/* From Card */}
                <div className="bg-gray-900 rounded-2xl p-4 -mb-2 flex flex-col relative mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs font-semibold">From</span>
                        <span className="text-gray-400 text-xs">Available Balance {mockBalances[fromCurrency].toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
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
                                            <span className="text-xs text-gray-400 font-mono">{mockBalances[c.code]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                min="0"
                                value={fromAmount !== "" ? Number(fromAmount).toFixed(2) : ""}
                                onChange={e => setFromAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-lg font-bold text-right w-24 outline-none"
                            />
                            <span className="text-gray-500">|</span>
                            <button type="button" onClick={handleMax} className="text-yellow-400 text-xs font-semibold hover:underline">Max</button>
                        </div>
                    </div>
                    {insufficientBalance && (
                        <div className="text-red-400 text-xs mt-1">
                            Insufficient balance
                        </div>
                    )}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-4 z-10 relative">
                    <button
                        type="button"
                        onClick={handleSwap}
                        className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-lg border-4 border-black"
                        aria-label="Swap currencies"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                    </button>
                </div>

                {/* To Card */}
                <div className="bg-gray-900 rounded-2xl p-4 mb-2 flex flex-col relative mb-4">
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
                                            <span className="text-xs text-gray-400 font-mono">{mockBalances[c.code]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            value={receiveAmount}
                            readOnly
                            placeholder="0"
                            className="bg-transparent text-white text-lg font-bold text-right w-32 outline-none"
                        />
                    </div>
                </div>

                {/* Price Card */}
                <div className="rounded-2xl p-4 mb-4 bg-gray-900">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs">When 1 {fromCurrency} is worth</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-lg">{toCurrency}</span>
                        <input
                            type="number"
                            name="exchangeRate"
                            value={editableRate}
                            onChange={e => setEditableRate(Number(e.target.value))}
                            placeholder="0.00"
                            step="0.0001"
                            className="bg-transparent text-white text-2xl font-bold text-right w-32 outline-none transition-all"
                        />
                    </div>
                    {isBelowMarket && (
                        <div className="text-red-400 text-xs mt-2">
                            Your selling price is lower than the current market price. Please adjust it to avoid any losses.
                        </div>
                    )}
                </div>

                <div className="mt-auto flex flex-col gap-2">
                    {/* Fee and Receive */}
                    <div className="flex items-center justify-between text-gray-300 text-sm mb-1">
                        <span>Fee</span>
                        <span className="text-green-400 font-mono">0 Fee</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 text-sm mb-4">
                        <span>Receive</span>
                        <span className="text-white font-bold text-lg">{receiveAmount || '--'} {toCurrency}</span>
                    </div>
                    {/* Your Active Deals Section (single line) */}
                    <div className="w-full max-w-md mt-4 mb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">Your active sell</span>
                            <a href="/active-sell" className="text-yellow-400 text-xs font-semibold hover:underline flex items-center gap-1">
                                View all <span aria-hidden>→</span>
                            </a>
                        </div>
                    </div>
                    {/* Place Order Button */}
                    <button
                        type="submit"
                        disabled={!fromAmount || parseFloat(fromAmount) === 0 || insufficientBalance}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        Sell
                    </button>
                </div>
            </form>
        </div>
    );
} 