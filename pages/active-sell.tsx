import { useEffect, useState } from "react";

type SellOrder = {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  rate: number;
  receiveAmount: string;
  date: string;
};

export default function ActiveSell() {
    const [orders, setOrders] = useState<SellOrder[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("activeSellOrders") || "[]");
        setOrders(stored);
    }, []);

    return (
        <div className="min-h-screen p-4">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Your Active Sell Orders</h2>
            {orders.length === 0 ? (
                <div className="text-gray-400 text-center">No active sell orders.</div>
            ) : (
                <div className="space-y-4 max-w-md mx-auto">
                    {orders.map((order, idx) => (
                        <div key={idx} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-1">
                            <div className="flex justify-between text-white font-bold">
                                <span>{order.fromAmount} {order.fromCurrency}</span>
                                <span>→ {order.receiveAmount} {order.toCurrency}</span>
                            </div>
                            <div className="text-gray-400 text-xs">
                                Rate: 1 {order.fromCurrency} = {order.rate} {order.toCurrency}
                            </div>
                            <div className="text-gray-500 text-xs">
                                {new Date(order.date).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 