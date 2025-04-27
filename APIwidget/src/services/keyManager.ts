import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a real app, these would be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface ApiKeyEntry {
  id?: string;
  provider: string;
  key: string;
  label?: string;
  created_at?: string;
  last_used?: string;
  user_id?: string;
}

/**
 * Save an API key to the database
 */
export const saveApiKey = async (
  provider: string, 
  key: string, 
  label?: string
): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('api_keys')
      .upsert({
        provider,
        key,
        label: label || provider,
        user_id: user.data.user.id,
        last_used: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

/**
 * Get an API key by provider
 */
export const getApiKey = async (provider: string): Promise<string | null> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('key')
      .eq('provider', provider)
      .eq('user_id', user.data.user.id)
      .single();

    if (error) throw error;
    return data?.key || null;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};

/**
 * List all API keys for the current user
 */
export const listApiKeys = async (): Promise<ApiKeyEntry[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, provider, label, created_at, last_used')
      .eq('user_id', user.data.user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error listing API keys:', error);
    return [];
  }
};

/**
 * Delete an API key
 */
export const deleteApiKey = async (provider: string): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('provider', provider)
      .eq('user_id', user.data.user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

/**
 * Update last used timestamp for an API key
 */
export const updateKeyLastUsed = async (provider: string): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('provider', provider)
      .eq('user_id', user.data.user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating API key last used:', error);
  }
};
