
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Ensure these env variables are set in your production environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Status tracker for Supabase connection
let connectionStatus: 'connected' | 'disconnected' | 'checking' = 'checking';
let lastChecked = 0;
const CHECK_INTERVAL = 60000; // 1 minute

// Helper to check if Supabase connection is working
export const isSupabaseConnected = async (): Promise<boolean> => {
  const now = Date.now();
  
  // If we've checked recently and have a result, return it without rechecking
  if (connectionStatus !== 'checking' && now - lastChecked < CHECK_INTERVAL) {
    return connectionStatus === 'connected';
  }
  
  connectionStatus = 'checking';
  
  try {
    const { error } = await supabase.from('brands').select('count', { count: 'exact', head: true });
    lastChecked = Date.now();
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      connectionStatus = 'disconnected';
      
      // Only show toast if change from connected to disconnected
      if (connectionStatus === 'connected') {
        toast.error('Database connection lost', {
          description: 'Working in offline mode with limited functionality',
        });
      }
      
      return false;
    }
    
    connectionStatus = 'connected';
    return true;
  } catch (e) {
    console.error('Unexpected error checking Supabase connection:', e);
    lastChecked = Date.now();
    connectionStatus = 'disconnected';
    return false;
  }
};

// Function to get connection status without making a request
export const getConnectionStatus = () => {
  return {
    status: connectionStatus,
    lastChecked
  };
};

// Export the full Tables type interface
export type Tables = {
  brands: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  garments: {
    id: string;
    name: string;
    description: string | null;
  };
  size_ranges: {
    id: string;
    brand_id: string;
    garment_id: string;
    region: string;
    size_label: string;
    measurement_type: string;
    min_value: number;
    max_value: number;
    unit: string;
  };
  feedback: {
    id: string;
    brand_id: string;
    garment_type: string;
    measurement_value: number;
    measurement_type: string;
    measurement_unit: string;
    size_us: string;
    size_uk: string;
    size_eu: string;
    is_accurate: boolean;
    created_at: string;
  };
};
