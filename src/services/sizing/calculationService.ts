
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConnected } from '@/lib/supabase';
import sizeData from '@/utils/sizeData';
import { SizeResult, mockSizeMapping } from './types';

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
    
    // First get the brand ID
    const { data: brands } = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName);
      
    if (!brands || brands.length === 0) {
      console.log(`Brand ${brandName} not found, using fallback calculation`);
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    const brandId = brands[0].id;
    
    // Then get the garment ID
    const { data: garments } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType);
      
    if (!garments || garments.length === 0) {
      console.log(`Garment type ${garmentType} not found, using fallback calculation`);
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    const garmentId = garments[0].id;
    
    // Convert to inches if needed for consistency (database uses inches)
    const valueInInches = unit === 'cm' ? measurementValue / 2.54 : measurementValue;
    
    // Initialize with the correct property structure
    const sizes: SizeResult = {
      usSize: 'No exact match found',
      ukSize: 'No exact match found',
      euSize: 'No exact match found'
    };
    
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
    
    // If we don't have exact matches in the database, use offline calculation as fallback
    if (sizes.usSize === 'No exact match found' && sizes.ukSize === 'No exact match found' && sizes.euSize === 'No exact match found') {
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    return sizes;
  } catch (e) {
    console.error('Error finding size by measurement:', e);
    return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
  }
};

// Use the imported static size data for offline calculations
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

// Fallback size calculation when no brand-specific data is available
export const calculateFallbackSize = (
  measurementType: string,
  value: number,
  unit: string
): SizeResult => {
  // Ensure we're working with cm
  const valueInInches = unit === 'cm' ? value / 2.54 : value;
  
  // Get the appropriate mapping based on measurement type
  const mapping = mockSizeMapping[measurementType as keyof typeof mockSizeMapping];
  if (!mapping) {
    return { usSize: 'M', ukSize: '10', euSize: '38' }; // Default fallback
  }
  
  // Find the size where value falls within range
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
