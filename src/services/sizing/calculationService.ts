
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
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock size calculation (Supabase not connected)');
      // Use the static size data for offline mode
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    // Convert to inches if needed for consistency (database uses inches)
    const valueInInches = normalizeToInches(measurementValue, unit);
    
    // Fetch size data from Supabase
    const sizes = await fetchSizeDataFromSupabase(
      brandName,
      garmentType,
      measurementType,
      valueInInches
    );
    
    // If we don't have exact matches in the database, use offline calculation as fallback
    if (sizes.usSize === 'No exact match found' && 
        sizes.ukSize === 'No exact match found' && 
        sizes.euSize === 'No exact match found') {
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    return sizes;
  } catch (e) {
    console.error('Error finding size by measurement:', e);
    return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
  }
};

// Re-export calculation utilities for backward compatibility
export { 
  calculateOfflineSizeFromData,
  calculateFallbackSize
};
