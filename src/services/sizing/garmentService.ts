
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';
import { SizeRange } from './types';

// Define the Garment type
export type Garment = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

// Mock garment data for when Supabase is not connected
export const mockGarments: Garment[] = [
  { id: '1', name: 'tops', description: 'Shirts, blouses, t-shirts', created_at: new Date().toISOString() },
  { id: '2', name: 'bottoms', description: 'Pants, skirts, shorts', created_at: new Date().toISOString() },
  { id: '3', name: 'dresses', description: 'All types of dresses', created_at: new Date().toISOString() }
];

// Fetch all garment types
export const fetchGarments = async (): Promise<Garment[]> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock garments data (Supabase not connected)');
      return mockGarments;
    }
    
    // Fetch garments with sorting
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching garments:', error);
      return mockGarments;
    }
    
    return data.length > 0 ? data : mockGarments;
  } catch (e) {
    console.error('Unexpected error fetching garments:', e);
    return mockGarments;
  }
};

// Fetch size ranges for a specific brand and garment type
export const fetchSizeRanges = async (
  brandName: string, 
  garmentType: string
): Promise<SizeRange[]> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock size ranges (Supabase not connected)');
      return [];
    }
    
    // Get brand ID
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName)
      .single();
      
    if (!brand) {
      console.warn(`Brand ${brandName} not found`);
      return [];
    }
    
    // Get garment ID
    const { data: garment } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType)
      .single();
      
    if (!garment) {
      console.warn(`Garment type ${garmentType} not found`);
      return [];
    }
    
    // Get size ranges with proper filtering
    const { data, error } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('garment_id', garment.id);
      
    if (error) {
      console.error('Error fetching size ranges:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching size ranges:', e);
    return [];
  }
};
