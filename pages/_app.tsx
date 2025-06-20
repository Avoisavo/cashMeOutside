import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import Header from "../components/Header";
import Background from "../components/Background";
import BottomNavigation from "../components/BottomNavigation";
import Home from "./index";
import Trade from "./trade";

export default function App({ Component, pageProps }: AppProps) {
  const [selectedSection, setSelectedSection] = useState("Home");

  const renderContent = () => {
    switch (selectedSection) {
      case "Home":
        return <Home />;
      case "Trade":
        return <Trade />;
      case "Wallet":
        return <div className="h-full flex items-center justify-center text-white text-xl">Wallet Page Coming Soon</div>;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
      {/* iPhone 16 Frame Container */}
      <div className="relative">
        {/* iPhone 16 Outer Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* iPhone 16 Screen Container */}
          <div className="relative bg-black rounded-[2.5rem] overflow-hidden">
            
            {/* Screen Content Area */}
            <div 
              className="relative overflow-hidden"
              style={{
                width: '393px',
                height: '852px',
                borderRadius: '2.5rem',
                backgroundColor: 'transparent',
              }}
            >
              {/* App Content Container */}
              <div className="h-full overflow-hidden scrollbar-hide">
                <div className="h-full relative overflow-hidden text-white flex flex-col">
                  <Background />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <Header />
                    
                    {/* Dynamic Page Content - This is where scrolling should happen */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                      {renderContent()}
                    </div>
                    
                    <BottomNavigation 
                      selectedSection={selectedSection} 
                      onSectionChange={setSelectedSection} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
        
        {/* iPhone 16 Side Buttons */}
        <div className="absolute left-[-4px] top-24 w-1 h-10 bg-gray-700 rounded-l-sm"></div>
        <div className="absolute left-[-4px] top-40 w-1 h-16 bg-gray-700 rounded-l-sm"></div>
        <div className="absolute left-[-4px] top-60 w-1 h-16 bg-gray-700 rounded-l-sm"></div>
        <div className="absolute right-[-4px] top-45 w-1 h-20 bg-gray-700 rounded-r-sm"></div>
      </div>
    </div>
  );
}
