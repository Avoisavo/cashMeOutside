import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { mockBalances } from '../data/balances';

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
  orderNo: string;
}

interface Match {
  path: Order[];
  totalRate: number;
  liquidity: number;
  score: number;
  estimatedTime: number;
}

export default function Exchange() {
  const router = useRouter();
  const [step, setStep] = useState<"matches" | "confirm">("matches");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // New: State for filtered sell orders
  const [matchingSellOrders, setMatchingSellOrders] = useState<any[]>([]);
  const [intent, setIntent] = useState<{fromCurrency: string, toCurrency: string, amount: string} | null>(null);
  const [selectedOrderIdx, setSelectedOrderIdx] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    // Read exchangeIntent and activeSellOrders from localStorage
    const intentRaw = localStorage.getItem('exchangeIntent');
    const ordersRaw = localStorage.getItem('activeSellOrders');
    if (intentRaw && ordersRaw) {
      const intent = JSON.parse(intentRaw);
      const orders = JSON.parse(ordersRaw);
      setIntent(intent);
      // Only show inverse matches
      const filtered = orders
        .map((o: any) => {
          if (o.fromCurrency === intent.toCurrency && o.toCurrency === intent.fromCurrency) {
            return { ...o, displayRate: 1 / o.rate, displayFrom: o.toCurrency, displayTo: o.fromCurrency, isInverse: true };
          }
          return null;
        })
        .filter(Boolean);
      setMatchingSellOrders(filtered);
    }
  }, []);

  // Hardcoded matches
  const matches: Match[] = [
    {
      path: [
        {
          id: "1",
          userId: "user1",
          fromCurrency: "MYR",
          toCurrency: "KRW",
          amount: 1000,
          rate: 325.20,
          timestamp: Date.now(),
          status: "open",
          balanceLocked: false,
          orderNo: "1",
        },
      ],
      totalRate: 325.20,
      liquidity: 1000,
      score: 9.8,
      estimatedTime: 2,
    },
    {
      path: [
        {
          id: "2",
          userId: "user2",
          fromCurrency: "MYR",
          toCurrency: "KRW",
          amount: 1000,
          rate: 320.90,
          timestamp: Date.now(),
          status: "open",
          balanceLocked: false,
          orderNo: "2",
        },
      ],
      totalRate: 320.90,
      liquidity: 1000,
      score: 8.7,
      estimatedTime: 3,
    },
  ];

  // Hardcoded values for display
  const fromCurrency = "MYR";
  const toCurrency = "KRW";
  const amount = 1000;
  const desiredRate = 325.20;

  // Traditional rates for comparison
  const traditionalRates = {
    "MYR-KRW": 325.25,
    "MYR-USD": 0.21,
    "MYR-AUD": 0.32,
    "USD-KRW": 1350,
    "AUD-KRW": 900,
  };

  const calculateEffectiveRate = (match: Match): number => match.totalRate;

  const getTraditionalRate = (): number => {
    const key = `${fromCurrency}-${toCurrency}`;
    return traditionalRates[key as keyof typeof traditionalRates] || 0;
  };

  const getSavings = (match: Match): number => {
    const traditionalRate = getTraditionalRate();
    const p2pRate = calculateEffectiveRate(match);
    const traditionalAmount = amount * traditionalRate;
    const p2pAmount = amount * p2pRate;
    return p2pAmount - traditionalAmount;
  };

  const handleContinue = () => {
    if (selectedMatch) {
      setStep("confirm");
    }
  };

  const goBack = () => {
    if (step === "confirm") {
      setStep("matches");
    } else {
    router.back();
    }
  };

  const confirmExchange = () => {
    if (!selectedOrder || !intent) return;

    const requestedAmount = parseFloat(intent.amount);
    const maxBuyerAmount = selectedOrder.fromAmount / selectedOrder.displayRate;
    const actualAmount = Math.min(requestedAmount, maxBuyerAmount);
    const effectiveRate = selectedOrder.displayRate;
    const bestRate = Math.max(...matchingSellOrders.map(o => o.displayRate));
    const isBest = effectiveRate === bestRate;
    const feeUSD = isBest ? 1 : 0;
    const feeInTarget = feeUSD * effectiveRate;
    const receiveAmount = actualAmount * effectiveRate;
    const finalReceive = receiveAmount - feeInTarget;

    // Use the same key format as wallet/sell
    const fromKey = intent.fromCurrency + "Balance";
    const toKey = intent.toCurrency + "Balance";
    const currentFromBalance = parseFloat(localStorage.getItem(fromKey) || mockBalances[intent.fromCurrency].toString());
    const currentToBalance = parseFloat(localStorage.getItem(toKey) || mockBalances[intent.toCurrency].toString());

    // Update balances
    const newFromBalance = currentFromBalance - actualAmount;
    const newToBalance = currentToBalance + finalReceive;

    localStorage.setItem(fromKey, newFromBalance.toString());
    localStorage.setItem(toKey, newToBalance.toString());

    // Update the relevant sell order in localStorage
    const ordersRaw = localStorage.getItem('activeSellOrders');
    if (ordersRaw) {
      const orders = JSON.parse(ordersRaw);
      // Use orderNo for robust matching
      const orderIdx = orders.findIndex(
        (o: any) => o.orderNo === selectedOrder.orderNo
      );
      if (orderIdx !== -1) {
        const order = orders[orderIdx];
        order.fromAmount = (Number(order.fromAmount) - actualAmount).toString();
        if (!order.buyers) order.buyers = [];
        order.buyers.push({
          name: 'Buyer',
          amount: actualAmount,
          date: new Date().toISOString(),
        });
        if (Number(order.fromAmount) <= 0) {

          // Move to completedSellOrders
          const completedRaw = localStorage.getItem('completedSellOrders');
          const completed = completedRaw ? JSON.parse(completedRaw) : [];
          completed.push(order);
          localStorage.setItem('completedSellOrders', JSON.stringify(completed));
          orders.splice(orderIdx, 1);
        }
        localStorage.setItem('activeSellOrders', JSON.stringify(orders));
      }
    }

    // Navigate to wallet page to show updated balances
    router.push('/wallet');
  };

  // Helper to format time since order
  function timeSince(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  }

  const renderMatchesStep = () => (
    <div className="space-y-6">
      {/* Updated summary section */}
      {intent && (
        <div className="bg-gray-900 rounded-3xl p-6 mb-6 text-center border border-gray-700">
          <div className="text-2xl font-bold text-white mb-2">
            {intent.amount} {intent.fromCurrency} → {intent.toCurrency}
          </div>
          <div className="text-gray-400 text-sm mb-1">
            {matchingSellOrders.length} P2P match{matchingSellOrders.length !== 1 ? 'es' : ''} found
          </div>
          {matchingSellOrders.length > 0 && (
            <div className="text-yellow-400 text-sm font-semibold">
              Desired Rate: {Math.max(...matchingSellOrders.map(o => o.displayRate)).toFixed(5)} {intent.toCurrency}
            </div>
          )}
        </div>
      )}
      {/* Only show matching sell orders below the summary */}
    </div>
  );

  const renderConfirmStep = () => {
    if (!selectedOrder || !intent) return null;
    const requestedAmount = parseFloat(intent.amount);
    const maxBuyerAmount = selectedOrder.fromAmount / selectedOrder.displayRate;
    const actualAmount = Math.min(requestedAmount, maxBuyerAmount);
    const effectiveRate = selectedOrder.displayRate;
    const bestRate = Math.max(...matchingSellOrders.map(o => o.displayRate));
    const isBest = effectiveRate === bestRate;
    const feeUSD = isBest ? 1 : 0;
    const feeInTarget = feeUSD * effectiveRate;
    const receiveAmount = actualAmount * effectiveRate;
    const finalReceive = receiveAmount - feeInTarget;
    return (
      <div className="space-y-6">
        {/* Match Details */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-3xl p-6 backdrop-blur-sm border border-gray-700">
          <h2 className="text-white font-semibold text-lg mb-4">Confirm P2P Exchange</h2>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {actualAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {intent.fromCurrency} → {intent.toCurrency}
              </div>
              <div className="text-yellow-400 font-semibold">
                Rate: {effectiveRate.toFixed(2)} {intent.toCurrency}
              </div>
            </div>
            <div className="rounded-xl p-4 my-3 border border-yellow-400 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-inner">
              <div className="font-bold text-lg text-yellow-400 text-center">
                You'll receive {finalReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })} {intent.toCurrency}
              </div>
              <div className="text-xs text-gray-300 text-center mt-1">
                Transaction Fee: {feeUSD} USD ({feeInTarget.toLocaleString(undefined, { maximumFractionDigits: 2 })} {intent.toCurrency})
              </div>
            </div>
          </div>
        </div>
        {/* Security Notice */}
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Secure P2P Exchange</p>
              <p className="text-gray-300 text-xs mt-1">Your funds are protected by escrow. Payment is only released after both parties confirm the transaction.</p>
            </div>
          </div>
        </div>
        <button 
          onClick={confirmExchange}
          className="w-full bg-yellow-400 rounded-xl py-4 font-bold text-black text-lg hover:bg-yellow-500 transition-all duration-200 shadow-lg"
        >
          Confirm P2P Exchange
        </button>
      </div>
    );
  };

  return (
    <div className="px-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
      <button 
          onClick={goBack}
          className="w-10 h-10 bg-black bg-opacity-40 rounded-full flex items-center justify-center backdrop-blur-sm"
      >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
      </button>
        <h1 className="text-xl font-bold text-white">
          {step === "matches" && "Choose P2P Match"}
          {step === "confirm" && "Confirm Exchange"}
        </h1>
        <div className="w-10"></div>
      </div>
      {step === "matches" && renderMatchesStep()}

      {/* Show matching sell orders if any */}
      {step === "matches" && intent && (
        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg mb-2">Available P2P Matches</h2>
          {matchingSellOrders.length === 0 ? (
            <div className="text-gray-400">No matching sell orders found for {intent.fromCurrency} → {intent.toCurrency}.</div>
          ) : (
            <div className="space-y-2">
              {[...matchingSellOrders]
                .sort((a, b) => b.displayRate - a.displayRate)
                .map((order, idx, arr) => {
                  const bestRate = Math.max(...matchingSellOrders.map(o => o.displayRate));
                  const isBest = order.displayRate === bestRate;
                  const isSelected = selectedOrderIdx === idx;
                  return (
                    <div key={idx}>
                      <div
                        className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-3xl p-6 backdrop-blur-sm border border-gray-700 flex flex-col space-y-2 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
                        onClick={() => setSelectedOrderIdx(idx)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-yellow-400">{order.displayRate.toFixed(3)}</span>
                            <span className="text-white">{intent.toCurrency} per {intent.fromCurrency}</span>
                          </div>
                          {isBest && (
                            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">BEST</span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Exchange up to:</span>
                            <span className="text-gray-100 text-right">{(() => {
                              const requestedAmount = parseFloat(intent.amount);
                              const maxBuyerAmount = order.fromAmount / order.displayRate;
                              const actualAmount = Math.min(requestedAmount, maxBuyerAmount);
                              return `${actualAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${intent.fromCurrency}`;
                            })()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Recieve up to:</span>
                            <span className="text-yellow-400 text-right">
                              {(() => {
                                const requestedAmount = parseFloat(intent.amount);
                                const maxBuyerAmount = order.fromAmount / order.displayRate;
                                const actualAmount = Math.min(requestedAmount, maxBuyerAmount);
                                const receiveAmount = actualAmount * order.displayRate;
                                const feeUSD = isBest ? 1 : 0;
                                const feeInTarget = feeUSD * order.displayRate;
                                const finalReceive = receiveAmount - feeInTarget;
                                return `${finalReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${intent.toCurrency}`;
                              })()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Seller Availability:</span>
                            <span className="text-gray-100 text-right">{order.fromAmount} {order.fromCurrency}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-400">Score:</span>
                              <span className="text-white">9.8</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-400">{timeSince(order.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-2 bg-gray-900 rounded-2xl p-4 text-white border border-gray-700">
                          <div className="font-semibold text-lg mb-3">Transaction Details</div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Exchange Amount</span>
                            <span className="text-yellow-400">{(() => {
                              const requestedAmount = parseFloat(intent.amount);
                              const maxBuyerAmount = order.fromAmount / order.displayRate;
                              const actualAmount = Math.min(requestedAmount, maxBuyerAmount);
                              return `${actualAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${intent.fromCurrency}`;
                            })()}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Transaction Fee</span>
                            <span className="text-yellow-400">{isBest ? '1 USD' : '0 USD'}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Exchange Rate</span>
                            <span className="text-yellow-400">{order.displayRate.toFixed(3)} {intent.toCurrency} per {intent.fromCurrency}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1 font-bold">
                            <span>You'll Receive</span>
                            <span className="text-yellow-400">
                              {(() => {
                                const requestedAmount = parseFloat(intent.amount);
                                const maxBuyerAmount = order.fromAmount / order.displayRate;
                                const actualAmount = Math.min(requestedAmount, maxBuyerAmount);
                                const receiveAmount = actualAmount * order.displayRate;
                                const feeUSD = isBest ? 1 : 0;
                                const feeInTarget = feeUSD * order.displayRate;
                                const finalReceive = receiveAmount - feeInTarget;
                                return `${finalReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${intent.toCurrency}`;
                              })()}
                            </span>
                          </div>
                          <button
                            className="w-full mt-4 bg-yellow-400 rounded-xl py-3 font-bold text-black text-lg hover:bg-yellow-500 transition-all duration-200 shadow-lg"
                            onClick={() => {
                              setSelectedOrder(order);
                              setStep('confirm');
                            }}
                          >
                            Confirm Transaction
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
      {/* Content */}
      {step === "confirm" && renderConfirmStep()}
    </div>
  );
}
