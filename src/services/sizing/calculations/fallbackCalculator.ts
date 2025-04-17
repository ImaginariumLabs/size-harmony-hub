
import { SizeResult } from '../types';

/**
 * Fallback size calculation when no brand-specific data is available
 */
export const calculateFallbackSize = (
  measurementType: string,
  value: number,
  unit: string
): SizeResult => {
  // Ensure we're working with cm
  const valueInInches = unit === 'cm' ? value / 2.54 : value;
  
  // Initialize with default sizes
  let usSizeLabel = 'M'; // Default to medium if no match
  let ukSizeLabel = '10';
  let euSizeLabel = '38';
  
  // Simple mapping table based on bust measurement in inches
  if (measurementType === 'bust') {
    if (valueInInches < 32) {
      usSizeLabel = 'XS';
      ukSizeLabel = '6';
      euSizeLabel = '34';
    } else if (valueInInches >= 32 && valueInInches < 35) {
      usSizeLabel = 'S';
      ukSizeLabel = '8';
      euSizeLabel = '36';
    } else if (valueInInches >= 35 && valueInInches < 38) {
      usSizeLabel = 'M';
      ukSizeLabel = '10';
      euSizeLabel = '38';
    } else if (valueInInches >= 38 && valueInInches < 41) {
      usSizeLabel = 'L';
      ukSizeLabel = '12';
      euSizeLabel = '40';
    } else {
      usSizeLabel = 'XL';
      ukSizeLabel = '14';
      euSizeLabel = '42';
    }
  }
  
  return {
    usSize: usSizeLabel,
    ukSize: ukSizeLabel,
    euSize: euSizeLabel
  };
};
