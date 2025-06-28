import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";

export default function Landing() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/trade");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full opacity-30"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="1200" cy="200" r="400" fill="url(#paint0_radial)" />
          <circle cx="200" cy="700" r="300" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient
              id="paint0_radial"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="rotate(90 500 700) scale(400)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#a78bfa" />
              <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="paint1_radial"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="rotate(90 500 700) scale(300)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f472b6" />
              <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4 pt-24 pb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            CashMeOutside
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
            The <span className="text-pink-400 font-bold">fastest</span>,{" "}
            <span className="text-blue-400 font-bold">fairest</span> way to
            exchange currency peer-to-peer. No banks. No borders. Just people
            helping people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-xl transition-all duration-200"
              onClick={handleStart}
            >
              Start Exchanging
            </button>
            <button
              className="border-2 border-purple-400 hover:border-purple-300 text-purple-200 hover:text-white hover:bg-purple-500/20 font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-200 backdrop-blur-sm"
              onClick={handleDashboard}
            >
              View Dashboard
            </button>
          </div>
        </div>

        {/* How It Works */}
        <section className="max-w-3xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">🔍</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Find Your Rate
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                See real-time P2P rates from people around the world.
              </p>
            </div>
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">🤝</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Match Instantly
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                Get matched with the best peer for your exchange, direct or
                multi-hop.
              </p>
            </div>
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">🔒</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Escrow Security
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                Funds are locked until both sides confirm. 100% safe.
              </p>
            </div>
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">🚀</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Get Paid Fast
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                Most exchanges complete in under 2 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Live P2P Rates */}
        <section className="py-16 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-center">
              Live P2P Rates
            </h2>
            <p className="text-purple-200 text-center mb-12 text-lg">
              Real-time exchange rates from our peer-to-peer network
            </p>

            {/* Horizontal scrollable container */}
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory">
              <div className="flex-shrink-0 w-64 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-8 text-center shadow-xl snap-center">
                <div className="text-white text-lg font-semibold mb-3 opacity-90">
                  MYR → KRW
                </div>
                <div className="text-4xl font-black text-white mb-3">
                  300.25
                </div>
                <div className="text-purple-100 text-sm font-medium">
                  Best P2P Rate
                </div>
              </div>

              <div className="flex-shrink-0 w-64 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-center shadow-xl snap-center">
                <div className="text-white text-lg font-semibold mb-3 opacity-90">
                  USD → KRW
                </div>
                <div className="text-4xl font-black text-white mb-3">
                  1,340.00
                </div>
                <div className="text-blue-100 text-sm font-medium">
                  Best P2P Rate
                </div>
              </div>

              <div className="flex-shrink-0 w-64 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-center shadow-xl snap-center">
                <div className="text-white text-lg font-semibold mb-3 opacity-90">
                  MYR → USD
                </div>
                <div className="text-4xl font-black text-white mb-3">0.21</div>
                <div className="text-emerald-100 text-sm font-medium">
                  Best P2P Rate
                </div>
              </div>

              <div className="flex-shrink-0 w-64 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 text-center shadow-xl snap-center">
                <div className="text-white text-lg font-semibold mb-3 opacity-90">
                  EUR → USD
                </div>
                <div className="text-4xl font-black text-white mb-3">1.08</div>
                <div className="text-orange-100 text-sm font-medium">
                  Best P2P Rate
                </div>
              </div>

              <div className="flex-shrink-0 w-64 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-center shadow-xl snap-center">
                <div className="text-white text-lg font-semibold mb-3 opacity-90">
                  GBP → MYR
                </div>
                <div className="text-4xl font-black text-white mb-3">5.65</div>
                <div className="text-violet-100 text-sm font-medium">
                  Best P2P Rate
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <span>Swipe to see more rates</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-3xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
            Why CashMeOutside?
          </h2>
          <div className="space-y-6">
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">💸</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                No Middleman
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                No banks, no hidden fees. Just you and your peers.
              </p>
            </div>
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">💰</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Best Rates
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                Get more for your money with real market rates.
              </p>
            </div>
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">🛡️</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Secure Escrow
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                Funds are protected until both sides confirm.
              </p>
            </div>
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">⚡</span>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Super Fast
              </h3>
              <p className="text-purple-200 text-base text-center leading-relaxed">
                Most trades complete in under 2 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-3xl mx-auto py-10 px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black bg-opacity-40 rounded-2xl p-6 shadow-lg">
              <p className="text-purple-100 italic mb-2">
                “I got a better rate than any bank, and the money arrived in 2
                minutes. Amazing!”
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  className="w-10 h-10 rounded-full object-cover"
                  alt="User"
                />
                <span className="text-white font-semibold">Min-jun K.</span>
              </div>
            </div>
            <div className="bg-black bg-opacity-40 rounded-2xl p-6 shadow-lg">
              <p className="text-purple-100 italic mb-2">
                “No more hidden fees. I love the transparency and speed!”
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  className="w-10 h-10 rounded-full object-cover"
                  alt="User"
                />
                <span className="text-white font-semibold">Siti N.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
