
import { createClient } from '@supabase/supabase-js';

// Ensure these env variables are set in your production environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase connection is working
export const isSupabaseConnected = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('brands').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};

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
