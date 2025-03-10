
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';

export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
};

// Mock data for when Supabase is not connected
const mockBrands: Brand[] = [
  { id: '1', name: 'H&M', logo_url: null, created_at: new Date().toISOString() },
  { id: '2', name: 'Zara', logo_url: null, created_at: new Date().toISOString() },
  { id: '3', name: 'Nike', logo_url: null, created_at: new Date().toISOString() },
  { id: '4', name: 'Adidas', logo_url: null, created_at: new Date().toISOString() },
];

// Fetch all brands
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock brands data (Supabase not connected)');
      return mockBrands;
    }
    
    // Continue with Supabase query if connected
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching brands:', error);
      return mockBrands;
    }
    
    return data.length > 0 ? data : mockBrands;
  } catch (e) {
    console.error('Unexpected error fetching brands:', e);
    return mockBrands;
  }
};
