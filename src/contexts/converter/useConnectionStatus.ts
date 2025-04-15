
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isSupabaseConnected } from '@/lib/supabase';

export const useConnectionStatus = (onConnectionChange: (isConnected: boolean) => void) => {
  const { toast } = useToast();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await isSupabaseConnected();
        const wasOffline = isOfflineMode;
        setIsOfflineMode(!connected);
        setConnectionChecked(true);
        
        if (!connected && !wasOffline) {
          console.log("Supabase connection not available, using offline mode");
          toast({
            title: "Offline Mode",
            description: "Using local data since database connection is unavailable. Some features may be limited.",
            variant: "warning",
            duration: 5000
          });
        } else if (connected && wasOffline) {
          console.log("Supabase connection restored");
          toast({
            title: "Online Mode",
            description: "Connected to the database successfully. All features are now available.",
            variant: "default",
            duration: 3000
          });
        }
        
        onConnectionChange(!connected);
      } catch (error) {
        console.error("Error checking Supabase connection:", error);
        setIsOfflineMode(true);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [toast, isOfflineMode, onConnectionChange]);

  return { isOfflineMode, connectionChecked };
};
