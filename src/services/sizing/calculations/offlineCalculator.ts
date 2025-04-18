
import { SizeResult } from '../types';
import { normalizeToInches } from './converters';

/**
 * Calculate size based on offline data when Supabase is not available
 * @param brandName The brand name
 * @param measurementType The type of measurement (bust, waist, etc.)
 * @param measurementValue The measurement value
 * @param unit The unit of measurement (inches or cm)
 * @returns The calculated size result
 */
export const calculateOfflineSizeFromData = (
  brandName: string,
  measurementType: string,
  measurementValue: number,
  unit: string,
  garmentType?: string // Make garmentType optional
): SizeResult => {
  // Normalize to inches for consistent calculations
  const valueInInches = normalizeToInches(measurementValue, unit);
  
  // Initialize with default values
  const sizeResult: SizeResult = {
    usSize: 'No exact match found',
    ukSize: 'No exact match found',
    euSize: 'No exact match found'
  };
  
  // Define size ranges for popular brands (simplified for demo)
  const brandSizeRanges: Record<string, Record<string, Record<string, { min: number, max: number }>>> = {
    'Zara': {
      bust: {
        XS: { min: 31, max: 32.5 },
        S: { min: 32.5, max: 34 },
        M: { min: 34, max: 36 },
        L: { min: 36, max: 38 },
        XL: { min: 38, max: 40 }
      }
    },
    'H&M': {
      bust: {
        XS: { min: 31, max: 32 },
        S: { min: 32, max: 34 },
        M: { min: 34, max: 36 },
        L: { min: 36, max: 38 },
        XL: { min: 38, max: 41 }
      }
    },
    'Nike': {
      bust: {
        XS: { min: 30, max: 32 },
        S: { min: 32, max: 34 },
        M: { min: 34, max: 36 },
        L: { min: 36, max: 39 },
        XL: { min: 39, max: 42 }
      }
    },
    'UNIQLO': {
      bust: {
        XS: { min: 31, max: 33 },
        S: { min: 33, max: 35 },
        M: { min: 35, max: 37 },
        L: { min: 37, max: 40 },
        XL: { min: 40, max: 43 }
      }
    },
    'GAP': {
      bust: {
        XS: { min: 31, max: 33 },
        S: { min: 33, max: 35 },
        M: { min: 35, max: 37 },
        L: { min: 37, max: 39 },
        XL: { min: 39, max: 42 }
      }
    },
    'Levi\'s': {
      bust: {
        XS: { min: 30, max: 32 },
        S: { min: 32, max: 34 },
        M: { min: 34, max: 36 },
        L: { min: 36, max: 38 },
        XL: { min: 38, max: 41 }
      }
    }
  };
  
  // Find the size in the brand's size ranges
  const brand = brandSizeRanges[brandName];
  if (brand && brand[measurementType]) {
    const sizes = brand[measurementType];
    for (const [sizeLabel, range] of Object.entries(sizes)) {
      if (valueInInches >= range.min && valueInInches <= range.max) {
        // Convert to regional sizing
        sizeResult.usSize = sizeLabel;
        sizeResult.ukSize = sizeLabel;
        sizeResult.euSize = sizeLabel;
        break;
      }
    }
  }
  
  // US to UK/EU size conversion (simplified)
  if (sizeResult.usSize !== 'No exact match found') {
    // Simple size conversion (could be more detailed in a real app)
    switch (sizeResult.usSize) {
      case 'XS':
        sizeResult.ukSize = '6';
        sizeResult.euSize = '34';
        break;
      case 'S':
        sizeResult.ukSize = '8';
        sizeResult.euSize = '36';
        break;
      case 'M':
        sizeResult.ukSize = '10';
        sizeResult.euSize = '38';
        break;
      case 'L':
        sizeResult.ukSize = '12';
        sizeResult.euSize = '40';
        break;
      case 'XL':
        sizeResult.ukSize = '14';
        sizeResult.euSize = '42';
        break;
    }
  }
  
  return sizeResult;
};

/**
 * Alternative calculation using generic approach if brand specifics are not available
 */
export const calculateGenericSize = (
  measurementType: string,
  measurementValue: number,
  unit: string
): SizeResult => {
  // Normalize to inches
  const valueInInches = normalizeToInches(measurementValue, unit);
  
  // Simplified size chart (example values)
  let usSize = 'No exact match found';
  
  if (measurementType === 'bust') {
    if (valueInInches < 32) usSize = 'XS';
    else if (valueInInches < 34) usSize = 'S';
    else if (valueInInches < 37) usSize = 'M';
    else if (valueInInches < 40) usSize = 'L';
    else usSize = 'XL';
  } else if (measurementType === 'waist') {
    if (valueInInches < 26) usSize = 'XS';
    else if (valueInInches < 29) usSize = 'S';
    else if (valueInInches < 32) usSize = 'M';
    else if (valueInInches < 35) usSize = 'L';
    else usSize = 'XL';
  }
  
  // Simple conversion
  let ukSize, euSize;
  
  switch (usSize) {
    case 'XS':
      ukSize = '6';
      euSize = '34';
      break;
    case 'S':
      ukSize = '8';
      euSize = '36';
      break;
    case 'M':
      ukSize = '10';
      euSize = '38';
      break;
    case 'L':
      ukSize = '12';
      euSize = '40';
      break;
    case 'XL':
      ukSize = '14';
      euSize = '42';
      break;
    default:
      ukSize = 'No exact match found';
      euSize = 'No exact match found';
  }
  
  return { usSize, ukSize, euSize };
};
