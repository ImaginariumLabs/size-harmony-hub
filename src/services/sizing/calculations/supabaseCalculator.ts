
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
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
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
  const brands = await executeSupabaseQuery(
    () => supabase.from('brands').select('id').eq('name', brandName),
    `Error fetching brand "${brandName}"`
  );
  
  if (!brands || brands.length === 0) {
    throw new Error(`Brand ${brandName} not found`);
  }
  
  return brands[0].id;
}

/**
 * Fetch garment ID from garment type
 */
async function getGarmentId(garmentType: string): Promise<string> {
  const garments = await executeSupabaseQuery(
    () => supabase.from('garments').select('id').eq('name', garmentType),
    `Error fetching garment "${garmentType}"`
  );
  
  if (!garments || garments.length === 0) {
    throw new Error(`Garment type ${garmentType} not found`);
  }
  
  return garments[0].id;
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
  const ranges = await executeSupabaseQuery(
    () => supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garmentId)
      .eq('region', region)
      .eq('measurement_type', measurementType)
      .eq('unit', 'inches'),
    `Error fetching ${region} size ranges`
  );
  
  // Find the right size range
  for (const range of ranges) {
    if (valueInInches >= range.min_value && valueInInches <= range.max_value) {
      return range.size_label;
    }
  }
  
  return null;
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
    throw error;
  }
};
