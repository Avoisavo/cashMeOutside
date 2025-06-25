import { useState } from "react";
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
    // Here you would implement the actual exchange logic
    console.log("Confirming exchange with match:", selectedMatch);
    // Navigate to success page or show confirmation
  };

  const renderMatchesStep = () => (
    <div className="space-y-6">
      {/* Exchange Summary */}
      <div className="bg-black bg-opacity-40 rounded-3xl p-6 backdrop-blur-sm">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white mb-2">
            {amount} {fromCurrency} → {toCurrency}
          </div>
          <div className="text-gray-300 text-sm">
            {`${matches.length} P2P matches found`}
          </div>
        </div>
        {desiredRate && (
          <div className="text-center">
            <div className="text-gray-300 text-sm">
              Desired Rate: {desiredRate} {toCurrency}
            </div>
          </div>
        )}
      </div>
      {/* Matches */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-lg">Available P2P Matches</h2>
        {matches.length === 0 ? (
          <div className="bg-black bg-opacity-40 rounded-2xl p-6 backdrop-blur-sm text-center">
            <p className="text-gray-300">No P2P matches found for this exchange.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your amount or check back later.</p>
          </div>
        ) : (
          matches.map((match, index) => {
            const effectiveRate = calculateEffectiveRate(match);
            const savings = getSavings(match);
            const isSelected = selectedMatch === match;
            return (
              <div
                key={index}
                onClick={() => setSelectedMatch(match)}
                className={`bg-black bg-opacity-40 rounded-2xl p-4 backdrop-blur-sm border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-purple-500 bg-purple-500 bg-opacity-20"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-white">
                      {effectiveRate.toFixed(2)}
                    </div>
                    <div className="text-gray-300 text-sm">{toCurrency}</div>
                    {index === 0 && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        BEST
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-300">💰 {match.liquidity} {fromCurrency}</div>
                  <div className="text-gray-300">⏱️ {match.estimatedTime} min</div>
                  <div className="text-gray-300">📊 Score: {match.score.toFixed(1)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {selectedMatch && (
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-4 font-bold text-white text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
        >
          Continue with Selected Match
        </button>
      )}
    </div>
  );

  const renderConfirmStep = () => {
    if (!selectedMatch) return null;
    const effectiveRate = calculateEffectiveRate(selectedMatch);
    const savings = getSavings(selectedMatch);
    return (
      <div className="space-y-6">
        {/* Match Details */}
        <div className="bg-black bg-opacity-40 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-white font-semibold text-lg mb-4">Confirm P2P Exchange</h2>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {amount} {fromCurrency} → {toCurrency}
              </div>
              <div className="text-green-400 font-semibold">
                Rate: {effectiveRate.toFixed(2)} {toCurrency}
              </div>
            </div>
            <div className="bg-green-500 bg-opacity-20 rounded-xl p-4 border border-green-500">
              <div className="text-black-400 font-semibold text-center">
                You'll receive {(amount * effectiveRate).toFixed(2)} {toCurrency}
              </div>
              <div className="text-black-400 text-sm text-center mt-1">
                +{savings.toFixed(2)} {toCurrency} vs traditional exchange
              </div>
            </div>
          </div>
        </div>
        {/* Exchange Path */}
        <div className="bg-black bg-opacity-40 rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-3">Exchange Path</h3>
          <div className="space-y-2">
            {selectedMatch.path.map((order, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">
                  Step {index + 1}: {order.fromCurrency} → {order.toCurrency}
                </span>
                <span className="text-white">Rate: {order.rate}</span>
              </div>
            ))}
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
              <p className="text-gray-300 text-xs mt-1">Your funds are protected by escrow. Payment is only released after both parties confirm the transaction.</p>
            </div>
          </div>
        </div>
        <button
          onClick={confirmExchange}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 rounded-xl py-4 font-bold text-white text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
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
      {/* Content */}
      {step === "matches" && renderMatchesStep()}
      {step === "confirm" && renderConfirmStep()}
    </div>
  );
}
