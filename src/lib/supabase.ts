import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqbhsowztsxwmjnmsgqw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYmhzb3d6dHN4d21qbm1zZ3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzc3OTgsImV4cCI6MjA1Njk1Mzc5OH0._He1AM3Zbu5VJgQ-lU5UnDIupZ72vqr5PFdMLKj_dWA';

// Create a single instance of the supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Improved connection status checking with better error handling
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
    // More informative error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
      connected: false, 
      error: errorMessage,
      details: "Application running in offline mode with demonstration data."
    };
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
