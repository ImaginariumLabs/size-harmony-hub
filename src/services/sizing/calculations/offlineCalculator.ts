
import { SizeResult } from '../types';
import sizeData from '@/utils/sizeData';
import { calculateFallbackSize } from './fallbackCalculator';

/**
 * Use the static size data for offline calculations
 */
export const calculateOfflineSizeFromData = (
  brandName: string,
  measurementType: string,
  value: number,
  unit: string
): SizeResult => {
  // Find the brand in our static data
  const brand = sizeData.brands.find(b => b.name === brandName);
  
  if (!brand) {
    console.log(`Brand ${brandName} not found in static data, using generic fallback`);
    return calculateFallbackSize(measurementType, value, unit);
  }
  
  // Ensure we're working with inches as that's what our static data uses
  const valueInInches = unit === 'cm' ? value / 2.54 : value;
  
  // Initialize result object
  const result = {
    usSize: 'No exact match found',
    ukSize: 'No exact match found',
    euSize: 'No exact match found'
  };
  
  // Only handling bust measurements from the static data for simplicity
  if (measurementType === 'bust') {
    // Check US sizes
    for (const sizeInfo of brand.sizes.US) {
      if (valueInInches >= sizeInfo.bust_min_inches && valueInInches <= sizeInfo.bust_max_inches) {
        result.usSize = sizeInfo.size;
        break;
      }
    }
    
    // Check UK sizes
    for (const sizeInfo of brand.sizes.UK) {
      if (valueInInches >= sizeInfo.bust_min_inches && valueInInches <= sizeInfo.bust_max_inches) {
        result.ukSize = sizeInfo.size;
        break;
      }
    }
    
    // Check EU sizes
    for (const sizeInfo of brand.sizes.EU) {
      if (valueInInches >= sizeInfo.bust_min_inches && valueInInches <= sizeInfo.bust_max_inches) {
        result.euSize = sizeInfo.size;
        break;
      }
    }
  } else {
    // For other measurement types, use the generic fallback
    return calculateFallbackSize(measurementType, value, unit);
  }
  
  return result;
};
