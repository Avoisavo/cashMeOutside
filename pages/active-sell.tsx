import { useEffect, useState } from "react";

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

export default function ActiveSell() {
    const [orders, setOrders] = useState<SellOrder[]>([]);
    const [expanded, setExpanded] = useState<number|null>(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("activeSellOrders") || "[]");
        setOrders(stored);
    }, []);

    return (
        <div className="min-h-0 p-4">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Your Active Sell Orders</h2>
            {orders.length === 0 ? (
                <div className="text-gray-400 text-center">No active sell orders.</div>
            ) : (
                <div className="space-y-4 max-w-md mx-auto">
                    {orders.map((order, idx) => {
                        const totalBought = (order.buyers || []).reduce((sum, b) => sum + b.amount, 0);
                        const isCompleted = totalBought >= Number(order.fromAmount);

                        return (
                            <div key={idx} className="bg-[#181A20] rounded-xl p-4 shadow-lg border border-[#23262F]">
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
                                    <div className="mt-2 bg-gray-800 rounded p-2">
                                        <div className="font-semibold text-white mb-1">Buyers:</div>
                                        {(order.buyers || []).map((buyer, i) => (
                                            <div key={i} className="flex justify-between text-gray-300 text-sm">
                                                <span>{buyer.name}</span>
                                                <span>{buyer.amount.toLocaleString()} {order.fromCurrency}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 