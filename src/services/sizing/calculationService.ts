
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';
import sizeData from '../../utils/sizeData';
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
    
    // Convert to cm if needed for consistency
    const valueInCm = unit === 'inches' ? measurementValue * 2.54 : measurementValue;
    
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
      .lte('max_value', valueInCm)
      .gte('min_value', valueInCm);
    
    if (usRanges && usRanges.length > 0) {
      sizes.usSize = usRanges[0].size_label;
    }
    
    // Query size ranges for UK region
    const { data: ukRanges } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garmentId)
      .eq('region', 'UK')
      .eq('measurement_type', measurementType)
      .lte('max_value', valueInCm)
      .gte('min_value', valueInCm);
    
    if (ukRanges && ukRanges.length > 0) {
      sizes.ukSize = ukRanges[0].size_label;
    }
    
    // Query size ranges for EU region
    const { data: euRanges } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garmentId)
      .eq('region', 'EU')
      .eq('measurement_type', measurementType)
      .lte('max_value', valueInCm)
      .gte('min_value', valueInCm);
    
    if (euRanges && euRanges.length > 0) {
      sizes.euSize = euRanges[0].size_label;
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
  const valueInCm = unit === 'inches' ? value * 2.54 : value;
  
  // Get the appropriate mapping based on measurement type
  const mapping = mockSizeMapping[measurementType as keyof typeof mockSizeMapping];
  if (!mapping) {
    return { usSize: 'M', ukSize: 'M', euSize: 'M' }; // Default fallback
  }
  
  // Find the size where value falls within range
  let sizeLabel = 'M'; // Default to medium if no match
  
  for (const [size, range] of Object.entries(mapping)) {
    if (valueInCm >= range.min && valueInCm <= range.max) {
      sizeLabel = size;
      break;
    }
  }
  
  // Simple mapping for different regions (in reality, these would vary by brand)
  const euMapping: Record<string, string> = {
    'XS': '34',
    'S': '36',
    'M': '38',
    'L': '40',
    'XL': '42'
  };
  
  return {
    usSize: sizeLabel,
    ukSize: sizeLabel,
    euSize: euMapping[sizeLabel] || '38'
  };
};
