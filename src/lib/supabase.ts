
import { supabase } from '../integrations/supabase/client';

// Track connection status
type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

interface ConnectionState {
  status: ConnectionStatus;
  lastChecked: Date;
  error?: Error;
}

let connectionState: ConnectionState = {
  status: 'checking',
  lastChecked: new Date()
};

// Check if Supabase is connected
export const isSupabaseConnected = async (): Promise<boolean> => {
  try {
    // Try to ping the Supabase server
    const { data, error } = await supabase.from('sizes').select('count').limit(1);
    
    if (error) {
      connectionState = {
        status: 'disconnected',
        lastChecked: new Date(),
        error: new Error(error.message)
      };
      console.error("Supabase connection error:", error);
      return false;
    }
    
    connectionState = {
      status: 'connected',
      lastChecked: new Date()
    };
    return true;
  } catch (error) {
    connectionState = {
      status: 'disconnected',
      lastChecked: new Date(),
      error: error instanceof Error ? error : new Error(String(error))
    };
    console.error("Supabase connection error:", error);
    return false;
  }
};

// Get current connection status without checking
export const getConnectionStatus = (): ConnectionState => {
  // If status is 'checking' or last checked was more than 30 seconds ago, check again
  if (connectionState.status === 'checking' || 
      new Date().getTime() - connectionState.lastChecked.getTime() > 30000) {
    isSupabaseConnected(); // Don't await, just trigger the check
  }
  return connectionState;
};

// Fix for the equality comparison
export const isConnectedStatus = (status: ConnectionStatus): boolean => {
  return status === 'connected';
};
