
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';
import { SizeRange } from './types';

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
