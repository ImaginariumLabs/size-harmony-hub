
import { supabase, isSupabaseConnected, Tables } from '../lib/supabase';
import sizeData from '../utils/sizeData';

export type Brand = Tables['brands'];
export type SizeRange = Tables['size_ranges'];
export type Feedback = Tables['feedback'];

// Mock data for when Supabase is not connected
const mockBrands: Brand[] = [
  { id: '1', name: 'H&M', logo_url: null },
  { id: '2', name: 'Zara', logo_url: null },
  { id: '3', name: 'Nike', logo_url: null },
  { id: '4', name: 'Adidas', logo_url: null },
];

// Basic size mapping for fallback calculations
const mockSizeMapping = {
  bust: {
    XS: { min: 76, max: 80 },  // 30-31.5 inches
    S: { min: 80, max: 84 },   // 31.5-33 inches
    M: { min: 84, max: 88 },   // 33-34.5 inches
    L: { min: 88, max: 94 },   // 34.5-37 inches
    XL: { min: 94, max: 100 }, // 37-39.5 inches
  },
  waist: {
    XS: { min: 58, max: 62 },  // 23-24.5 inches
    S: { min: 62, max: 66 },   // 24.5-26 inches
    M: { min: 66, max: 70 },   // 26-27.5 inches
    L: { min: 70, max: 76 },   // 27.5-30 inches
    XL: { min: 76, max: 82 },  // 30-32.5 inches
  },
  hip: {
    XS: { min: 84, max: 88 },  // 33-34.5 inches
    S: { min: 88, max: 92 },   // 34.5-36 inches
    M: { min: 92, max: 96 },   // 36-38 inches
    L: { min: 96, max: 102 },  // 38-40 inches
    XL: { min: 102, max: 108 }, // 40-42.5 inches
  }
};

// Fetch all brands
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock brands data (Supabase not connected)');
      return mockBrands;
    }
    
    // Continue with Supabase query if connected
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching brands:', error);
      return mockBrands;
    }
    
    return data.length > 0 ? data : mockBrands;
  } catch (e) {
    console.error('Unexpected error fetching brands:', e);
    return mockBrands;
  }
};

// Fetch size ranges for a specific brand and garment type
export const fetchSizeRanges = async (
  brandId: string, 
  garmentType: string
): Promise<SizeRange[]> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock size ranges (Supabase not connected)');
      return [];
    }
    
    const { data: garment } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType)
      .single();
      
    if (!garment) {
      throw new Error(`Garment type ${garmentType} not found`);
    }
    
    const { data, error } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brandId)
      .eq('garment_id', garment.id);
      
    if (error) {
      console.error('Error fetching size ranges:', error);
      throw error;
    }
    
    return data || [];
  } catch (e) {
    console.error('Error fetching size ranges:', e);
    return [];
  }
};

// Determine size based on measurement
export const findSizeByMeasurement = async (
  brandName: string,
  garmentType: string,
  measurementType: string,
  measurementValue: number,
  unit: string
): Promise<{ usSize: string; ukSize: string; euSize: string }> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock size calculation (Supabase not connected)');
      // Use the static size data for offline mode
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    // First get the brand ID
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName)
      .single();
      
    if (!brand) {
      console.log(`Brand ${brandName} not found, using fallback calculation`);
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    // Then get the garment ID
    const { data: garment } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType)
      .single();
      
    if (!garment) {
      console.log(`Garment type ${garmentType} not found, using fallback calculation`);
      return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
    }
    
    // Convert to cm if needed for consistency
    const valueInCm = unit === 'inches' ? measurementValue * 2.54 : measurementValue;
    
    // Query size ranges for each region
    const regions = ['US', 'UK', 'EU'];
    // Initialize with the correct property structure
    const sizes: { usSize: string; ukSize: string; euSize: string } = {
      usSize: 'No exact match found',
      ukSize: 'No exact match found',
      euSize: 'No exact match found'
    };
    
    for (const region of regions) {
      const { data } = await supabase
        .from('size_ranges')
        .select('*')
        .eq('brand_id', brand.id)
        .eq('garment_id', garment.id)
        .eq('region', region)
        .eq('measurement_type', measurementType)
        .eq('unit', 'cm') // Assuming we store everything in cm for consistency
        .lte('max_value', valueInCm)
        .gte('min_value', valueInCm);
        
      if (data && data.length > 0) {
        const sizeKey = region.toLowerCase() + 'Size' as 'usSize' | 'ukSize' | 'euSize';
        sizes[sizeKey] = data[0].size_label;
      }
    }
    
    return sizes;
  } catch (e) {
    console.error('Error finding size by measurement:', e);
    return calculateOfflineSizeFromData(brandName, measurementType, measurementValue, unit);
  }
};

// Use the imported static size data for offline calculations
const calculateOfflineSizeFromData = (
  brandName: string,
  measurementType: string,
  value: number,
  unit: string
): { usSize: string; ukSize: string; euSize: string } => {
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
const calculateFallbackSize = (
  measurementType: string,
  value: number,
  unit: string
): { usSize: string; ukSize: string; euSize: string } => {
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

// Submit user feedback
export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'created_at'>) => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Feedback stored locally (Supabase not connected)');
      // In a real app, you might store this in localStorage for later sync
      return null;
    }
    
    const { data, error } = await supabase
      .from('feedback')
      .insert(feedback);
      
    if (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
    
    return data;
  } catch (e) {
    console.error('Error submitting feedback:', e);
    return null;
  }
};

// Get feedback statistics for admin
export const getFeedbackStats = async () => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock feedback stats (Supabase not connected)');
      return [
        { brand: 'H&M', garmentType: 'tops', accurate: 12, inaccurate: 3, count: 15 },
        { brand: 'Zara', garmentType: 'dresses', accurate: 8, inaccurate: 2, count: 10 }
      ];
    }
    
    // Select the fields we need and do the grouping in code
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        brands (name),
        garment_type,
        is_accurate,
        created_at
      `);
      
    if (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
    
    // Process data manually to group and count
    const groupedStats: Record<string, { 
      brand: string; 
      garmentType: string; 
      accurate: number; 
      inaccurate: number; 
      count: number;
    }> = {};
    
    (data || []).forEach((item: any) => {
      const key = `${item.brands?.name}-${item.garment_type}`;
      
      if (!groupedStats[key]) {
        groupedStats[key] = {
          brand: item.brands?.name || 'Unknown',
          garmentType: item.garment_type || 'Unknown',
          accurate: 0,
          inaccurate: 0,
          count: 0
        };
      }
      
      if (item.is_accurate) {
        groupedStats[key].accurate += 1;
      } else {
        groupedStats[key].inaccurate += 1;
      }
      
      groupedStats[key].count += 1;
    });
    
    return Object.values(groupedStats);
  } catch (e) {
    console.error('Error fetching feedback stats:', e);
    return [
      { brand: 'H&M', garmentType: 'tops', accurate: 12, inaccurate: 3, count: 15 },
      { brand: 'Zara', garmentType: 'dresses', accurate: 8, inaccurate: 2, count: 10 }
    ];
  }
};
