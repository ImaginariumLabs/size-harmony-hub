
import { supabase } from '@/integrations/supabase/client';
import { SizeResult } from '../types';
import { calculateOfflineSizeFromData } from './offlineCalculator';

/**
 * Fetch size data from Supabase for a specific measurement
 */
export const fetchSizeDataFromSupabase = async (
  brandName: string,
  garmentType: string,
  measurementType: string,
  valueInInches: number
): Promise<SizeResult> => {
  // Initialize with the correct property structure
  const sizes: SizeResult = {
    usSize: 'No exact match found',
    ukSize: 'No exact match found',
    euSize: 'No exact match found'
  };
  
  try {
    // First get the brand ID
    const { data: brands } = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName);
      
    if (!brands || brands.length === 0) {
      console.log(`Brand ${brandName} not found, using fallback calculation`);
      return calculateOfflineSizeFromData(brandName, measurementType, valueInInches, 'inches');
    }
    
    const brandId = brands[0].id;
    
    // Then get the garment ID
    const { data: garments } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType);
      
    if (!garments || garments.length === 0) {
      console.log(`Garment type ${garmentType} not found, using fallback calculation`);
      return calculateOfflineSizeFromData(brandName, measurementType, valueInInches, 'inches');
    }
    
    const garmentId = garments[0].id;
    
    // Query size ranges for US region
    const { data: usRanges } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garmentId)
      .eq('region', 'US')
      .eq('measurement_type', measurementType)
      .eq('unit', 'inches');
    
    if (usRanges && usRanges.length > 0) {
      // Find the right size range
      for (const range of usRanges) {
        if (valueInInches >= range.min_value && valueInInches <= range.max_value) {
          sizes.usSize = range.size_label;
          break;
        }
      }
    }
    
    // Query size ranges for UK region
    const { data: ukRanges } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garmentId)
      .eq('region', 'UK')
      .eq('measurement_type', measurementType)
      .eq('unit', 'inches');
    
    if (ukRanges && ukRanges.length > 0) {
      // Find the right size range
      for (const range of ukRanges) {
        if (valueInInches >= range.min_value && valueInInches <= range.max_value) {
          sizes.ukSize = range.size_label;
          break;
        }
      }
    }
    
    // Query size ranges for EU region
    const { data: euRanges } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garmentId)
      .eq('region', 'EU')
      .eq('measurement_type', measurementType)
      .eq('unit', 'inches');
    
    if (euRanges && euRanges.length > 0) {
      // Find the right size range
      for (const range of euRanges) {
        if (valueInInches >= range.min_value && valueInInches <= range.max_value) {
          sizes.euSize = range.size_label;
          break;
        }
      }
    }
    
    return sizes;
  } catch (error) {
    console.error('Error fetching size data from Supabase:', error);
    throw error;
  }
};
