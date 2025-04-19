
import { isSupabaseConnected } from '@/lib/supabase';
import { SizeResult } from './types';
import { normalizeToInches } from './calculations/converters';
import { calculateOfflineSizeFromData } from './calculations/offlineCalculator';
import { calculateFallbackSize } from './calculations/fallbackCalculator';
import { fetchSizeDataFromSupabase } from './calculations/supabaseCalculator';

// Determine size based on measurement
export const findSizeByMeasurement = async (
  brandName: string,
  garmentType: string,
  measurementType: string,
  measurementValue: number,
  unit: string
): Promise<SizeResult> => {
  try {
    // Validate input parameters
    if (!brandName || !garmentType || !measurementType || 
        isNaN(measurementValue) || measurementValue <= 0) {
      console.log('Invalid inputs for size calculation');
      // Return a null/empty result for invalid inputs
      return null;
    }
    
    // Check if Supabase is connected
    let connected = false;
    try {
      connected = await isSupabaseConnected();
    } catch (error) {
      console.error('Error checking Supabase connection:', error);
      connected = false;
    }
    
    if (!connected) {
      console.log('Using offline size calculation (Supabase not connected)');
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit, garmentType);
    }
    
    // Convert to inches for consistency
    const valueInInches = normalizeToInches(measurementValue, unit);
    
    try {
      // Fetch size data from Supabase with confidence scores
      const sizes = await fetchSizeDataFromSupabase(
        brandName,
        garmentType,
        measurementType,
        valueInInches
      );
      
      // If no exact matches or error strings returned, use offline calculation
      if (!sizes || 
          (sizes.usSize === 'No exact match found' && 
           sizes.ukSize === 'No exact match found' && 
           sizes.euSize === 'No exact match found')) {
        console.log(`No exact match found for ${brandName}, using offline calculation`);
        return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit, garmentType);
      }
      
      return sizes;
    } catch (supabaseError) {
      console.error('Error fetching from Supabase:', supabaseError);
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit, garmentType);
    }
  } catch (e) {
    console.error('Error in size calculation service:', e);
    try {
      return calculateFallbackSize(measurementType, measurementValue, unit);
    } catch (fallbackError) {
      console.error('Even fallback calculation failed:', fallbackError);
      return null;
    }
  }
};

// Re-export calculation utilities
export { 
  calculateOfflineSizeFromData,
  calculateFallbackSize
};
