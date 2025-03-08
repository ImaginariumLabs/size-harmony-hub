
import { supabase, Tables } from '../lib/supabase';

export type Brand = Tables['brands'];
export type SizeRange = Tables['size_ranges'];
export type Feedback = Tables['feedback'];

// Fetch all brands
export const fetchBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch size ranges for a specific brand and garment type
export const fetchSizeRanges = async (
  brandId: string, 
  garmentType: string
): Promise<SizeRange[]> => {
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
};

// Determine size based on measurement
export const findSizeByMeasurement = async (
  brandName: string,
  garmentType: string,
  measurementType: string,
  measurementValue: number,
  unit: string
): Promise<{ usSize: string; ukSize: string; euSize: string }> => {
  // First get the brand ID
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single();
    
  if (!brand) {
    throw new Error(`Brand ${brandName} not found`);
  }
  
  // Then get the garment ID
  const { data: garment } = await supabase
    .from('garments')
    .select('id')
    .eq('name', garmentType)
    .single();
    
  if (!garment) {
    throw new Error(`Garment type ${garmentType} not found`);
  }
  
  // Convert to cm if needed for consistency
  const valueInCm = unit === 'inches' ? measurementValue * 2.54 : measurementValue;
  
  // Query size ranges for each region
  const regions = ['US', 'UK', 'EU'];
  // Fix for TypeScript error: Initialize with the correct property structure
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
};

// Submit user feedback
export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('feedback')
    .insert(feedback);
    
  if (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
  
  return data;
};

// Get feedback statistics for admin
export const getFeedbackStats = async () => {
  // Fix for TypeScript error: The .group() method doesn't exist in Supabase JS v2
  // Instead, we'll select the fields we need and do the grouping in code
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
};
