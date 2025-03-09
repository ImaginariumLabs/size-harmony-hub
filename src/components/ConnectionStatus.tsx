
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { getConnectionStatus, isSupabaseConnected } from '@/lib/supabase';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check connection initially
    const checkConnection = async () => {
      const connected = await isSupabaseConnected();
      setIsConnected(connected);
    };
    
    checkConnection();
    
    // Set up interval to check connection periodically
    const intervalId = setInterval(async () => {
      const status = await getConnectionStatus();
      setIsConnected(status.connected);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (isConnected === null) {
    return null; // Don't show anything while initial check is happening
  }
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 px-3 py-2 rounded-full text-xs font-medium flex items-center shadow-md ${
      isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 mr-1" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          <span>Offline Mode</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
