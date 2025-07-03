import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import Background from "../components/Background";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-gray-900 bg-opacity-80 border border-[#23262F] rounded-2xl p-8 flex flex-col items-center backdrop-blur-sm hover:bg-opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
    <span className="text-4xl mb-4 animate-bounce-gentle" role="img" aria-label={title}>{icon}</span>
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
  <div className="bg-gray-900 bg-opacity-80 border border-[#23262F] rounded-3xl p-6 shadow-xl transition-all duration-300 hover:bg-opacity-90 hover:scale-105 hover:shadow-purple-500/30 backdrop-blur-sm">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Icon Container */}
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-gentle">
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStart = () => {
    router.push("/dashboard");
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

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-black">
        {/* Animated/Patterned Background */}
        <Background />
        
        {/* Interactive Mouse Follow Effect */}
        <div 
          className="pointer-events-none absolute w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        
        {/* Enhanced Floating Shapes */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="floating-shape shape1" />
          <div className="floating-shape shape2" />
          <div className="floating-shape shape3" />
          <div className="floating-shape shape4" />
          <div className="floating-shape shape5" />
          <div className="floating-shape shape6" />
          <div className="floating-shape shape7" />
          <div className="floating-shape shape8" />
          
          {/* Sparkle Effects */}
          <div className="sparkle sparkle1">✨</div>
          <div className="sparkle sparkle2">⭐</div>
          <div className="sparkle sparkle3">💫</div>
          <div className="sparkle sparkle4">✨</div>
          <div className="sparkle sparkle5">⭐</div>
          <div className="sparkle sparkle6">💫</div>
        </div>
        
        {/* Main Content */}
        <main className="relative z-10 min-h-screen flex flex-col justify-center items-center">
          <div className="w-full flex flex-col items-center justify-center">
            {/* Hero Section with bouncy entrance */}
            <section className="flex flex-col justify-center items-center text-center px-4 pt-2 pb-4 animate-bounce-in">
              <div className="relative">
                <h1 className="text-lg md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight animate-pop-in bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-gradient-x pulse-effect">
                  RateMyCash
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto font-medium animate-fade-in leading-relaxed">
                The <span className="text-purple-400 font-bold animate-pulse-gentle">fastest</span>, <span className="text-purple-300 font-bold animate-pulse-gentle">fairest</span> way to exchange currency peer-to-peer.<br />
                <span className="text-lg md:text-xl text-purple-300 italic">No banks. No borders. Just people helping people.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 animate-bounce-in delay-200 hover:scale-110 hover:shadow-purple-500/50 relative overflow-hidden group"
                  onClick={handleStart}
                  aria-label="Start exchanging currency - Navigate to trading page"
                >
                  <span className="relative z-10"> Start Exchanging</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </section>


            {/* Testimonials with animated fade-in-up and hover pop */}
            <section className="max-w-md mx-auto py-0 px-2 animate-fade-in-up flex flex-col items-center gap-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 text-center tracking-wide">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  What Our Users Say
                </span>
              </h2>
              <div className="w-full flex flex-col items-center gap-6">
                <div className="w-full max-w-sm bg-black bg-opacity-40 rounded-2xl p-4 shadow-lg border border-purple-700/40 transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/30 backdrop-blur-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-base mr-2">💜</span>
                    <div className="flex text-yellow-400 text-xs">
                      {'⭐'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-purple-100 italic mb-4 text-sm">
                    "I got a better rate than any bank, and the money arrived in 2 minutes. Amazing!"
                  </p>
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      className="w-6 h-6 rounded-full object-cover border-2 border-purple-500 shadow-lg"
                      alt="User"
                    />
                    <div>
                      <span className="text-white font-semibold text-sm">Min-jun K.</span>
                      <p className="text-purple-300 text-xs">Seoul, South Korea</p>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-sm bg-black bg-opacity-40 rounded-2xl p-4 shadow-lg border border-purple-700/40 transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/30 backdrop-blur-sm">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-xs">
                      {'⭐'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-purple-100 italic mb-4 text-sm">
                    "No more hidden fees. I love the transparency and speed!"
                  </p>
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      className="w-6 h-6 rounded-full object-cover border-2 border-purple-500 shadow-lg"
                      alt="User"
                    />
                    <div>
                      <span className="text-white font-semibold text-sm">Siti N.</span>
                      <p className="text-purple-300 text-xs">Jakarta, Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8 md:hidden">
                <div className="flex items-center gap-2 text-purple-300 text-sm animate-pulse-gentle">
                  <span>Swipe to see more testimonials</span>
                  <svg
                    className="w-4 h-4 animate-bounce-gentle"
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
          </div>
        </main>
      </div>
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.05); }
          80% { transform: scale(0.97); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 1s cubic-bezier(0.68,-0.55,0.27,1.55) both;
        }
        
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.7); }
          80% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.8s cubic-bezier(0.68,-0.55,0.27,1.55) both;
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .floating-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.15;
          filter: blur(2px);
          z-index: 1;
          animation: float-shape 12s ease-in-out infinite;
        }
        
        .shape1 {
          width: 150px; height: 150px;
          left: 8vw; top: 15vh;
          background: radial-gradient(circle at 30% 30%, #a78bfa 60%, #7c3aed 100%);
          animation-delay: 0s;
        }
        
        .shape2 {
          width: 100px; height: 100px;
          right: 10vw; top: 25vh;
          background: radial-gradient(circle at 70% 70%, #c4b5fd 50%, #8b5cf6 100%);
          animation-delay: 2s;
        }
        
        .shape3 {
          width: 120px; height: 120px;
          left: 15vw; bottom: 20vh;
          background: radial-gradient(circle at 60% 40%, #f0abfc 40%, #a21caf 100%);
          animation-delay: 4s;
        }
        
        .shape4 {
          width: 80px; height: 80px;
          right: 20vw; bottom: 15vh;
          background: radial-gradient(circle at 40% 60%, #a5b4fc 50%, #6366f1 100%);
          animation-delay: 6s;
        }
        
        .shape5 {
          width: 90px; height: 90px;
          left: 50vw; top: 10vh;
          background: radial-gradient(circle at 50% 50%, #ddd6fe 40%, #9333ea 100%);
          animation-delay: 1s;
        }
        
        .shape6 {
          width: 110px; height: 110px;
          right: 5vw; top: 50vh;
          background: radial-gradient(circle at 20% 80%, #fbb6ce 30%, #ec4899 100%);
          animation-delay: 3s;
        }
        
        .shape7 {
          width: 70px; height: 70px;
          left: 5vw; bottom: 40vh;
          background: radial-gradient(circle at 80% 20%, #c7d2fe 60%, #4f46e5 100%);
          animation-delay: 5s;
        }
        
        .shape8 {
          width: 130px; height: 130px;
          right: 35vw; bottom: 5vh;
          background: radial-gradient(circle at 40% 40%, #e9d5ff 30%, #7c3aed 100%);
          animation-delay: 7s;
        }
        
        @keyframes float-shape {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-30px) rotate(90deg) scale(1.1); }
          50% { transform: translateY(-60px) rotate(180deg) scale(0.9); }
          75% { transform: translateY(-30px) rotate(270deg) scale(1.05); }
          100% { transform: translateY(0) rotate(360deg) scale(1); }
        }
        
        .sparkle {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.7;
          animation: sparkle-twinkle 4s ease-in-out infinite;
          z-index: 2;
        }
        
        .sparkle1 { left: 20vw; top: 30vh; animation-delay: 0s; }
        .sparkle2 { right: 25vw; top: 20vh; animation-delay: 1s; }
        .sparkle3 { left: 70vw; bottom: 30vh; animation-delay: 2s; }
        .sparkle4 { right: 15vw; bottom: 25vh; animation-delay: 3s; }
        .sparkle5 { left: 40vw; top: 60vh; animation-delay: 0.5s; }
        .sparkle6 { right: 50vw; bottom: 40vh; animation-delay: 1.5s; }
        
        @keyframes sparkle-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .floating-shape {
            opacity: 0.1;
          }
          .sparkle {
            font-size: 1rem;
            opacity: 0.5;
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        .pulse-effect {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
}