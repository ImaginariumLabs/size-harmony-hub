
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
    const connected = await isSupabaseConnected();
    
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
      
      // If no exact matches or error strings returned, use null
      if (!sizes || sizes.usSize === 'No exact match found') {
        console.log(`No exact match found for ${brandName}, using offline calculation`);
        const offlineResult = calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit, garmentType);
        
        // If even offline calculation fails, return null
        if (!offlineResult || (offlineResult.usSize === '' && offlineResult.ukSize === '' && offlineResult.euSize === '')) {
          return null;
        }
        
        return offlineResult;
      }
      
      return sizes;
    } catch (supabaseError) {
      console.error('Error fetching from Supabase:', supabaseError);
      const fallbackResult = calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit, garmentType);
      return fallbackResult || null;
    }
  } catch (e) {
    console.error('Error in size calculation service:', e);
    const fallbackResult = calculateFallbackSize(measurementType, measurementValue, unit);
    return fallbackResult || null;
  }
};

// Re-export calculation utilities
export { 
  calculateOfflineSizeFromData,
  calculateFallbackSize
};
