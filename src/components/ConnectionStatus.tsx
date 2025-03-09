
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Info } from 'lucide-react';
import { getConnectionStatus, isSupabaseConnected } from '@/lib/supabase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showHelpInfo, setShowHelpInfo] = useState(false);
  
  useEffect(() => {
    // Check connection initially
    const checkConnection = async () => {
      const connected = await isSupabaseConnected();
      setIsConnected(connected);
      
      // If this is the first time we're detecting offline mode, show the help info
      if (!connected && isConnected === null) {
        setShowHelpInfo(true);
        // Auto-hide the help info after 8 seconds
        setTimeout(() => setShowHelpInfo(false), 8000);
      }
    };
    
    checkConnection();
    
    // Set up interval to check connection periodically
    const intervalId = setInterval(async () => {
      const status = await getConnectionStatus();
      setIsConnected(status.connected);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [isConnected]);
  
  // Dismiss help info
  const dismissHelp = () => {
    setShowHelpInfo(false);
  };
  
  if (isConnected === null) {
    return null; // Don't show anything while initial check is happening
  }
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`fixed bottom-4 right-4 z-50 px-3 py-2 rounded-full text-xs font-medium flex items-center shadow-md ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  <span>Demo Mode</span>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isConnected 
              ? "Connected to database - all features available"
              : "Using local data - some features limited"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Help popup for offline mode */}
      {showHelpInfo && !isConnected && (
        <div className="fixed bottom-16 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 max-w-xs animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center text-amber-500">
              <Info className="h-5 w-5 mr-2" />
              <h4 className="font-medium text-amber-800">Demo Mode Active</h4>
            </div>
            <button 
              onClick={dismissHelp}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            The app is running in demo mode with local data. Database features like saving changes will be simulated.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This is normal in development environments.
          </p>
        </div>
      )}
    </>
  );
};

export default ConnectionStatus;
