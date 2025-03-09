
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConnected } from '@/lib/supabase';

/**
 * Helper function to handle database query errors consistently
 */
export async function handleDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T,
  errorMessage: string
): Promise<T> {
  try {
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log(`Using mock data (Supabase not connected): ${errorMessage}`);
      return fallbackValue;
    }
    
    return await queryFn();
  } catch (e) {
    console.error(`Unexpected error: ${errorMessage}`, e);
    return fallbackValue;
  }
}
