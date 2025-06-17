import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* iPhone 16 Frame Container */}
      <div className="relative">
        {/* iPhone 16 Outer Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* iPhone 16 Screen Container */}
          <div className="relative bg-black rounded-[2.5rem] overflow-hidden">
            
            {/* Screen Content Area */}
            <div 
              className="relative bg-white overflow-hidden"
              style={{
                width: '393px',
                height: '852px',
                borderRadius: '2.5rem',
              }}
            >

              
              {/* App Content Container */}
              <div className="h-full pt-12 pb-8 overflow-auto scrollbar-hide">
                <Component {...pageProps} />
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
