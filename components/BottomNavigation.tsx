import { useRouter } from "next/router";

interface BottomNavigationProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

export default function BottomNavigation({ selectedSection, onSectionChange }: BottomNavigationProps) {
  const router = useRouter();

  const handleNavigation = async (path: string, section: string) => {
    try {
      console.log('Navigation clicked:', path, section);
      console.log('Current router pathname:', router.pathname);
      
      // Update the section first
      onSectionChange(section);
      
      // Then navigate
      await router.push(path);
      
      console.log('Navigation completed to:', path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="px-4 pb-4">
      <div className="bg-transparent bg-opacity-60 backdrop-blur-xl rounded-full border border-gray-500/30 shadow-2xl">
        <div className="flex items-center justify-center px-3 py-3">
          {/* Home */}
          <button 
            onClick={() => handleNavigation("/", "Home")}
            className={`flex items-center justify-center px-7 py-3 rounded-full transition-all duration-200 ${
              selectedSection === "Home" 
                ? 'bg-gray-600/60 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="w-6 h-6">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          </button>

          {/* Trade */}
          <button 
            onClick={() => handleNavigation("/trade", "Trade")}
            className={`flex items-center justify-center px-7 py-3 rounded-full transition-all duration-200 ${
              selectedSection === "Trade" 
                ? 'bg-gray-600/60 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="w-6 h-6">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </button>

          {/* Wallet */}
          <button 
            onClick={() => handleNavigation("/wallet", "Wallet")}
            className={`flex items-center justify-center px-7 py-3 rounded-full transition-all duration-200 ${
              selectedSection === "Wallet" 
                ? 'bg-gray-600/60 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="w-6 h-6">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 