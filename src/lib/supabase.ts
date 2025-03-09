
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getConnectionStatus() {
  try {
    const { data, error } = await supabase.from('brands').select('id').limit(1);
    if (error) {
      console.error("Supabase connection error:", error);
      return { connected: false, error: error.message };
    }
    return { connected: true };
  } catch (error) {
    console.error("Supabase connection error:", error);
    return { connected: false, error: String(error) };
  }
}

// Function to check if Supabase is connected - returns a boolean for simpler use
export async function isSupabaseConnected() {
  const status = await getConnectionStatus();
  return status.connected;
}

// Function to check if a table exists in the database
export async function tableExists(tableName: string) {
  try {
    // This is a workaround to check if a table exists
    // We try to select a single row with a limit of 1
    // If the table doesn't exist, it will throw an error
    const { error } = await supabase
      .from(tableName as any)
      .select('*')
      .limit(1);
    
    // If there's an error with a message containing "does not exist", 
    // the table doesn't exist
    if (error && error.message.includes('does not exist')) {
      return false;
    }
    
    // Otherwise, the table exists
    return true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}
