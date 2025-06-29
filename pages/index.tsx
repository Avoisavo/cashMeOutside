import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-black bg-opacity-40 rounded-2xl p-8 flex flex-col items-center">
    <span className="text-4xl mb-4" role="img" aria-label={title}>{icon}</span>
    <h3 className="text-xl font-semibold text-white mb-4 text-center">
      {title}
    </h3>
    <p className="text-purple-200 text-base text-center leading-relaxed">
      {description}
    </p>
  </div>
);

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => (
  <div className="bg-black bg-opacity-5 backdrop-blur-lg rounded-3xl p-6 shadow-xl hover:bg-opacity-10 transition-all duration-300">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Icon Container */}
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-2xl" role="img" aria-label={title}>{icon}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-purple-200 text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default function Landing() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/trade");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  // How It Works data
  const howItWorksFeatures = [
    {
      icon: "🔍",
      title: "Find Your Rate",
      description: "See real-time P2P rates from people around the world."
    },
    {
      icon: "🤝",
      title: "Match Instantly",
      description: "Get matched with the best peer for your exchange, direct or multi-hop."
    },
    {
      icon: "🔒",
      title: "Escrow Security",
      description: "Funds are locked until both sides confirm. 100% safe."
    },
    {
      icon: "🚀",
      title: "Get Paid Fast",
      description: "Most exchanges complete in under 2 minutes."
    }
  ];

  // Benefits data
  const benefitsFeatures = [
    {
      icon: "💸",
      title: "No Middleman",
      description: "No banks, no hidden fees. Just you and your peers."
    },
    {
      icon: "💰",
      title: "Best Rates",
      description: "Get more for your money with real market rates."
    },
    {
      icon: "🛡️",
      title: "Secure Escrow",
      description: "Funds are protected until both sides confirm."
    },
    {
      icon: "⚡",
      title: "Super Fast",
      description: "Most trades complete in under 2 minutes."
    }
  ];

  return (
    <>
      <Head>
        <title>CashMeOutside – P2P Currency Exchange</title>
        <meta name="description" content="The fastest, fairest way to exchange currency peer-to-peer. No banks. No borders. Just people helping people." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="CashMeOutside – P2P Currency Exchange" />
        <meta property="og:description" content="The fastest, fairest way to exchange currency peer-to-peer." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CashMeOutside – P2P Currency Exchange" />
        <meta name="twitter:description" content="The fastest, fairest way to exchange currency peer-to-peer." />
        <meta name="twitter:image" content="/og-image.jpg" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <svg
            className="w-full h-full opacity-30"
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Decorative background gradient"
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
        <main className="relative z-10 flex flex-col min-h-screen">
          {/* Hero Section */}
          <section className="flex-1 flex flex-col justify-center items-center text-center px-4 pt-24 pb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
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
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
                onClick={handleStart}
                aria-label="Start exchanging currency - Navigate to trading page"
              >
                Start Exchanging
              </button>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={handleDashboard}
                aria-label="View dashboard - Navigate to dashboard page"
              >
                View Dashboard
              </button>
            </div>
          </section>

          {/* How It Works */}
          <section className="max-w-3xl mx-auto py-12 px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
              How It Works
            </h2>
            <div className="space-y-6">
              {howItWorksFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
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
              <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory" role="region" aria-label="Live exchange rates">
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
                    aria-hidden="true"
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

          {/* Benefits - New Design */}
          <section className="max-w-4xl mx-auto py-12 px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
              Why CashMeOutside?
            </h2>
            <div className="space-y-4">
              {benefitsFeatures.map((feature, index) => (
                <BenefitCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="max-w-5xl mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What Our Users Say
            </h2>
            
            <div className="md:grid md:grid-cols-2 md:gap-6 flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory md:overflow-visible">
              <div className="flex-shrink-0 w-80 md:w-auto bg-black bg-opacity-40 rounded-2xl p-6 shadow-lg snap-center">
                <p className="text-purple-100 italic mb-4">
                  "I got a better rate than any bank, and the money arrived in 2
                  minutes. Amazing!"
                </p>
                <div className="flex items-center space-x-3">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  className="w-10 h-10 rounded-full object-cover"
                  alt="User"
                />
                  <span className="text-white font-semibold">Min-jun K.</span>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-80 md:w-auto bg-black bg-opacity-40 rounded-2xl p-6 shadow-lg snap-center">
                <p className="text-purple-100 italic mb-4">
                  "No more hidden fees. I love the transparency and speed!"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  className="w-10 h-10 rounded-full object-cover"
                  alt="User"
                />
                  <span className="text-white font-semibold">Siti N.</span>
                </div>
              </div>
            </div>

            {/* Mobile scroll indicator */}
            <div className="flex justify-center mt-4 md:hidden">
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <span>Swipe to see more testimonials</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
          </section>
        </main>
    </div>
    </>
  );
}
