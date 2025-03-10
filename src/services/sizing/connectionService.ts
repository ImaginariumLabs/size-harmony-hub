
import { supabase } from '../../integrations/supabase/client';

// Update isSupabaseConnected to include a max retries pattern for better reliability
export const isSupabaseConnectedWithRetry = async (maxRetries = 2): Promise<boolean> => {
  let retries = 0;
  
  const checkConnection = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from('brands').select('count', { count: 'exact', head: true });
      return !error;
    } catch (e) {
      console.error('Supabase connection check failed:', e);
      return false;
    }
  };
  
  while (retries <= maxRetries) {
    const connected = await checkConnection();
    if (connected) return true;
    
    retries++;
    if (retries <= maxRetries) {
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, retries - 1)));
    }
  }
  
  return false;
};
