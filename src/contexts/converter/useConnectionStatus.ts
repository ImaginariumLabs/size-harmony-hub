
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isSupabaseConnected } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export const useConnectionStatus = (onConnectionChange: (isOffline: boolean) => void) => {
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
        setConnectionChecked(true);
        onConnectionChange(true);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // When user is signed in, check connection again to show authorized features
      if (event === 'SIGNED_IN') {
        setTimeout(() => {
          checkConnection();
          toast({
            title: "Welcome back!",
            description: "You can now save your measurements and view size history.",
          });
        }, 0);
      }
    });
    
    // Initial connection check
    checkConnection();
    // Periodic check
    const interval = setInterval(checkConnection, 30000);
    
    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [toast, isOfflineMode, onConnectionChange]);

  return { isOfflineMode, connectionChecked };
};
