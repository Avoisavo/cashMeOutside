import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QRCodeCanvas } from 'qrcode.react';

type SellOrder = {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  rate: number;
  receiveAmount: string;
  date: string;
  orderNo: string;
  user: string;
  type: string;
  buyers?: Buyer[];
};

type Buyer = {
  name: string;
  amount: number;
  date: string;
};

export default function ActiveSell() {
    const [orders, setOrders] = useState<SellOrder[]>([]);
    const [expanded, setExpanded] = useState<number|null>(null);
    const router = useRouter();
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [showCashOutNotification, setShowCashOutNotification] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("activeSellOrders") || "[]");
        // Filter out completed orders
        const active = stored.filter((order: SellOrder) => {
            const totalBought = (order.buyers || []).reduce((sum, b) => sum + b.amount, 0);
            return totalBought < Number(order.fromAmount);
        });
        setOrders(active);
    }, []);

    return (
        <div className="min-h-0 p-4">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-black bg-opacity-80 rounded-full flex items-center justify-center mr-4"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-center text-white flex-1">Your Active Sell Orders</h2>
                <button
                    className="ml-2 px-2 py-1 h-8 text-xs bg-purple-600 text-white rounded-full font-semibold shadow hover:bg-green-700 transition"
                    onClick={() => setShowRevenueModal(true)}
                >
                    Revenue
                </button>
            </div>
            {orders.length === 0 ? (
                <div className="text-gray-400 text-center">No active sell orders.</div>
            ) : (
                <div className="space-y-4 max-w-md mx-auto">
                    {orders.map((order, idx) => {
                        const totalBought = (order.buyers || []).reduce((sum, b) => sum + b.amount, 0);
                        const isCompleted = totalBought >= Number(order.fromAmount);

                        return (
                            <div key={idx} className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-3xl p-6 backdrop-blur-sm border border-gray-700 shadow-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-lg text-red-400">
                                        Sell {order.fromCurrency}
                                    </span>
                                    <button
                                        className={`text-xs font-semibold flex items-center gap-1 ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}
                                        onClick={() => setExpanded(expanded === idx ? null : idx)}
                                    >
                                        {isCompleted ? 'Completed' : 'In Progress'} <span aria-hidden>›</span>
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400 mb-2">{new Date(order.date).toLocaleString()}</div>
                                <div className="flex flex-col gap-1 mb-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Amount</span>
                                        <span className="text-white font-bold text-lg">{Number(order.fromAmount).toLocaleString()} {order.fromCurrency}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Price</span>
                                        <span className="text-white">{order.rate} {order.toCurrency}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Quantity</span>
                                        <span className="text-white">{order.receiveAmount} {order.toCurrency}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order No.</span>
                                        <span className="text-white">{order.orderNo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">User</span>
                                        <span className="text-white">{order.user}</span>
                                    </div>
                                </div>
                                {expanded === idx && (
                                    <div className="mt-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-4 border border-gray-700">
                                        <div className="flex items-center mb-2">
                                            <svg className="w-4 h-4 text-yellow-400 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" /></svg>
                                            <span className="font-bold text-white text-base">Transaction</span>
                                        </div>
                                        {(order.buyers && order.buyers.length > 0) ? (
                                            order.buyers.map((buyer, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 px-3 mb-1 rounded-xl bg-gray-900/60">
                                                    <span className="font-semibold text-white">{buyer.name}</span>
                                                    <span className="text-yellow-400 font-bold">{buyer.amount.toLocaleString()} {order.toCurrency}</span>
                                                    <span className="text-xs text-gray-400 ml-2">{new Date(buyer.date).toLocaleString()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-400 text-sm">No transactions yet.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {showRevenueModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 max-w-xs w-full flex flex-col items-center">
                        <div className="text-white text-xl font-bold mb-2 text-center">Your Revenue Details</div>
                        <div className="w-full max-h-40 overflow-y-auto bg-gray-800 rounded-lg p-3 mb-4 border border-gray-700">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm text-gray-200"><span>DN2301</span><span>Transaction</span><span className="text-green-400 font-semibold">RM10</span></div>
                                <div className="flex justify-between text-sm text-gray-200"><span>DN12321</span><span>Transaction</span><span className="text-green-400 font-semibold">RM10</span></div>
                                <div className="flex justify-between text-sm text-gray-200"><span>DN8888</span><span>Transaction</span><span className="text-green-400 font-semibold">RM30</span></div>
                                <div className="flex justify-between text-sm text-gray-200"><span>DN5555</span><span>Transaction</span><span className="text-green-400 font-semibold">RM50</span></div>
                                <div className="flex justify-between text-sm text-gray-200"><span>DN7777</span><span>Transaction</span><span className="text-green-400 font-semibold">RM50</span></div>
                            </div>
                        </div>
                        <div className="w-full flex justify-between items-center mb-4 px-1">
                            <span className="text-gray-300 font-semibold">Total Revenue</span>
                            <span className="text-2xl font-bold text-green-400">RM150</span>
                        </div>
                        <div className="flex gap-4 mt-2">
                            <button
                                className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                                onClick={() => {
                                    // Add 150 to MYR balance in localStorage
                                    const key = 'MYRBalance';
                                    const current = parseFloat(localStorage.getItem(key) || '0');
                                    localStorage.setItem(key, (current + 150).toString());
                                    setShowRevenueModal(false);
                                    setShowCashOutNotification(true);
                                    setTimeout(() => setShowCashOutNotification(false), 2000);
                                }}
                            >
                                Cash Out
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition"
                                onClick={() => setShowRevenueModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCashOutNotification && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-center animate-fade-in">
                    Successfully cash out
                </div>
            )}
        </div>
    );
} 