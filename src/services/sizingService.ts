import { supabase, isSupabaseConnected } from '../lib/supabase';
import sizeData from '../utils/sizeData';

// Define types for our database tables
export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
};

export type Garment = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type SizeRange = {
  id: string;
  brand_id: string;
  garment_id: string;
  region: string;
  size_label: string;
  measurement_type: string;
  min_value: number;
  max_value: number;
  unit: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  brand_id: string;
  garment_type: string;
  measurement_value: number;
  measurement_type: string;
  measurement_unit: string;
  size_us: string;
  size_uk: string;
  size_eu: string;
  is_accurate: boolean;
  created_at: string;
};

// Mock data for when Supabase is not connected
const mockBrands: Brand[] = [
  { id: '1', name: 'H&M', logo_url: null, created_at: new Date().toISOString() },
  { id: '2', name: 'Zara', logo_url: null, created_at: new Date().toISOString() },
  { id: '3', name: 'Nike', logo_url: null, created_at: new Date().toISOString() },
  { id: '4', name: 'Adidas', logo_url: null, created_at: new Date().toISOString() },
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
  brandName: string, 
  garmentType: string
): Promise<SizeRange[]> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock size ranges (Supabase not connected)');
      return [];
    }
    
    // Get brand ID
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName)
      .single();
      
    if (!brand) {
      throw new Error(`Brand ${brandName} not found`);
    }
    
    // Get garment ID
    const { data: garment } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType)
      .single();
      
    if (!garment) {
      throw new Error(`Garment type ${garmentType} not found`);
    }
    
    // Get size ranges
    const { data, error } = await supabase
      .from('size_ranges')
      .select('*')
      .eq('brand_id', brand.id)
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
    const sizes: { usSize: string; ukSize: string; euSize: string } = {
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
    
    // Get feedback stats with brand names
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        brand_id,
        garment_type,
        is_accurate,
        brands!inner(name)
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
      const brandName = item.brands.name;
      const key = `${brandName}-${item.garment_type}`;
      
      if (!groupedStats[key]) {
        groupedStats[key] = {
          brand: brandName,
          garmentType: item.garment_type,
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

// Improved CSV import and export functions
export const exportSizeDataToCSV = async (brandFilter?: string, garmentFilter?: string) => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      throw new Error('Cannot export data in offline mode - Please check your Supabase connection');
    }
    
    let query = supabase
      .from('size_ranges')
      .select(`
        id,
        region,
        size_label,
        measurement_type,
        min_value,
        max_value,
        unit,
        brands!inner(name),
        garments!inner(name)
      `);
    
    // Apply filters if provided
    if (brandFilter) {
      query = query.eq('brands.name', brandFilter);
    }
    
    if (garmentFilter) {
      query = query.eq('garments.name', garmentFilter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error exporting size data:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data found with the specified filters');
    }
    
    // Format data for CSV
    const csvRows = data.map((row: any) => {
      return {
        brand: row.brands.name,
        garment: row.garments.name,
        region: row.region,
        sizeLabel: row.size_label,
        measurementType: row.measurement_type,
        minValue: row.min_value,
        maxValue: row.max_value,
        unit: row.unit
      };
    });
    
    // Convert to CSV string
    const headers = Object.keys(csvRows[0]);
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => headers.map(header => JSON.stringify(row[header as keyof typeof row])).join(','))
    ].join('\n');
    
    return csvContent;
  } catch (e) {
    console.error('Error exporting size data to CSV:', e);
    throw e;
  }
};

// Enhanced import function with better error handling and validation
export const importSizeDataFromCSV = async (csvContent: string) => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      throw new Error('Cannot import data in offline mode - Please check your Supabase connection');
    }
    
    // Parse CSV content
    const rows = csvContent.split('\n');
    if (rows.length < 2) {
      throw new Error('CSV file appears to be empty or invalid');
    }
    
    const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const requiredHeaders = ['brand', 'garment', 'region', 'sizeLabel', 'measurementType', 'minValue', 'maxValue'];
    
    // Validate required headers
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`Missing required column: ${required}. Please check your CSV format.`);
      }
    }
    
    // Track results
    const results = {
      total: rows.length - 1, // Exclude header row
      success: 0,
      errors: [] as string[]
    };
    
    // Process each row
    for (let i = 1; i < rows.length; i++) {
      try {
        const row = rows[i].trim();
        if (!row) continue; // Skip empty rows
        
        // Parse CSV row (handling quoted values correctly)
        const values: string[] = [];
        let inQuotes = false;
        let currentValue = '';
        
        for (let j = 0; j < row.length; j++) {
          const char = row[j];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.replace(/^"|"$/g, ''));
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        values.push(currentValue.replace(/^"|"$/g, ''));
        
        if (values.length !== headers.length) {
          results.errors.push(`Row ${i}: Column count mismatch. Found ${values.length}, expected ${headers.length}`);
          continue;
        }
        
        // Create a record object from the CSV row
        const record: Record<string, string> = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        
        // Validate numeric fields
        const minValue = parseFloat(record.minValue);
        const maxValue = parseFloat(record.maxValue);
        
        if (isNaN(minValue) || isNaN(maxValue)) {
          results.errors.push(`Row ${i}: minValue and maxValue must be numeric`);
          continue;
        }
        
        if (minValue > maxValue) {
          results.errors.push(`Row ${i}: minValue (${minValue}) cannot be greater than maxValue (${maxValue})`);
          continue;
        }
        
        // Call the import function via RPC
        const { data, error } = await supabase.rpc('import_size_data', {
          p_brand_name: record.brand,
          p_garment_name: record.garment,
          p_region: record.region,
          p_size_label: record.sizeLabel,
          p_measurement_type: record.measurementType,
          p_min_value: minValue,
          p_max_value: maxValue,
          p_unit: record.unit || 'cm'
        });
        
        if (error) {
          results.errors.push(`Row ${i}: ${error.message}`);
        } else {
          results.success++;
        }
      } catch (err) {
        results.errors.push(`Row ${i}: ${(err as Error).message}`);
      }
    }
    
    return results;
  } catch (e) {
    console.error('Error importing size data from CSV:', e);
    throw e;
  }
};

// Update isSupabaseConnected to include a max retries pattern for better reliability
export const isSupabaseConnected = async (maxRetries = 2): Promise<boolean> => {
  let retries = 0;
  
  const checkConnection = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from('brands').select('count', { count: 'exact', head: true });
      return !error;
    } catch (e) {
      console.error('Supabase connection check failed:', e);
      return false;
    }
  };
  
  while (retries <= maxRetries) {
    const connected = await checkConnection();
    if (connected) return true;
    
    retries++;
    if (retries <= maxRetries) {
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, retries - 1)));
    }
  }
  
  return false;
};
