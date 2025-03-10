
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';

export type Garment = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

// Fetch size ranges for a specific brand and garment type
export const fetchSizeRanges = async (
  brandName: string, 
  garmentType: string
) => {
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
      throw new Error(`Brand ${brandName} not found`);
    }
    
    // Get garment ID
    const { data: garment } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType)
      .single();
      
    if (!garment) {
      throw new Error(`Garment type ${garmentType} not found`);
    }
    
    // Get size ranges
    const { data, error } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('garment_id', garment.id);
      
    if (error) {
      console.error('Error fetching size ranges:', error);
      throw error;
    }
    
    return data || [];
  } catch (e) {
    console.error('Error fetching size ranges:', e);
    return [];
  }
};
