
import { supabase } from '@/integrations/supabase/client';
import { SizeResult } from '../types';
import { calculateOfflineSizeFromData } from './offlineCalculator';

/**
 * Generic function to safely execute Supabase queries with error handling
 */
async function executeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null, error: any }>,
  errorMessage: string
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error(`${errorMessage}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from query');
    }
    
    return data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  }
}

/**
 * Fetch brand ID from brand name
 */
async function getBrandId(brandName: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName)
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Brand ${brandName} not found`);
    }
    
    return data[0].id;
  } catch (error) {
    console.error(`Error fetching brand "${brandName}":`, error);
    throw error;
  }
}

/**
 * Fetch garment ID from garment type
 */
async function getGarmentId(garmentType: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType)
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Garment type ${garmentType} not found`);
    }
    
    return data[0].id;
  } catch (error) {
    console.error(`Error fetching garment "${garmentType}":`, error);
    throw error;
  }
}

/**
 * Fetch size ranges for a specific region
 */
async function getSizeRanges(
  brandId: string,
  garmentId: string,
  region: string,
  measurementType: string,
  valueInInches: number
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garmentId)
      .eq('region', region)
      .eq('measurement_type', measurementType)
      .eq('unit', 'inches');
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Find the right size range
    for (const range of data) {
      if (valueInInches >= range.min_value && valueInInches <= range.max_value) {
        return range.size_label;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${region} size ranges:`, error);
    return null;
  }
}

/**
 * Fetch size data from Supabase for a specific measurement
 */
export const fetchSizeDataFromSupabase = async (
  brandName: string,
  garmentType: string,
  measurementType: string,
  valueInInches: number
): Promise<SizeResult> => {
  // Initialize with default values
  const sizes: SizeResult = {
    usSize: 'No exact match found',
    ukSize: 'No exact match found',
    euSize: 'No exact match found'
  };
  
  try {
    // Get brand and garment IDs
    const brandId = await getBrandId(brandName);
    const garmentId = await getGarmentId(garmentType);
    
    // Get size ranges for each region in parallel for better performance
    const [usSize, ukSize, euSize] = await Promise.allSettled([
      getSizeRanges(brandId, garmentId, 'US', measurementType, valueInInches),
      getSizeRanges(brandId, garmentId, 'UK', measurementType, valueInInches),
      getSizeRanges(brandId, garmentId, 'EU', measurementType, valueInInches)
    ]);
    
    // Set the size values from results
    if (usSize.status === 'fulfilled' && usSize.value) {
      sizes.usSize = usSize.value;
    }
    
    if (ukSize.status === 'fulfilled' && ukSize.value) {
      sizes.ukSize = ukSize.value;
    }
    
    if (euSize.status === 'fulfilled' && euSize.value) {
      sizes.euSize = euSize.value;
    }
    
    return sizes;
  } catch (error) {
    console.error('Error fetching size data from Supabase:', error);
    // Fallback to offline calculator if there's an error
    // Fix: Pass the correct parameters to calculateOfflineSizeFromData
    return calculateOfflineSizeFromData(brandName, measurementType, valueInInches, 'inches', garmentType);
  }
};
