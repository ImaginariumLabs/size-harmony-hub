
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
  { id: '5', name: 'Uniqlo', logo_url: null, created_at: new Date().toISOString() },
  { id: '6', name: 'Gap', logo_url: null, created_at: new Date().toISOString() }
];

// Fetch all brands with improved error handling
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock brands data (Supabase not connected)');
      return mockBrands;
    }
    
    // Fetch brands with sorting and limit
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true })
      .limit(10); // Limit to prevent overwhelming the UI
    
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

// Fetch a specific brand by name
export const fetchBrandByName = async (brandName: string): Promise<Brand | null> => {
  try {
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      return mockBrands.find(b => b.name === brandName) || null;
    }
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('name', brandName)
      .single();
    
    if (error) {
      console.error('Error fetching brand:', error);
      return mockBrands.find(b => b.name === brandName) || null;
    }
    
    return data;
  } catch (e) {
    console.error('Unexpected error fetching brand:', e);
    return mockBrands.find(b => b.name === brandName) || null;
  }
};
