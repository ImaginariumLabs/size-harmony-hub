
import { supabase } from '@/lib/supabase';
import { SizeResult } from './types';

export async function saveToHistory(
  userId: string,
  brandName: string,
  garmentType: string,
  measurementType: string,
  measurementValue: number,
  measurementUnit: string,
  convertedSize: SizeResult
) {
  try {
    // First, get the brand ID
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName)
      .single();
    
    if (brandError) {
      console.error('Error getting brand ID:', brandError);
      return { error: 'Brand not found' };
    }
    
    // Get the garment ID
    const { data: garmentData, error: garmentError } = await supabase
      .from('garments')
      .select('id')
      .eq('name', garmentType)
      .single();
    
    let garmentId;
    
    if (garmentError) {
      // Create the garment if it doesn't exist
      const { data: newGarment, error: createError } = await supabase
        .from('garments')
        .insert({ name: garmentType })
        .select('id')
        .single();
      
      if (createError) {
        console.error('Error creating garment:', createError);
        return { error: 'Failed to create garment' };
      }
      
      garmentId = newGarment.id;
    } else {
      garmentId = garmentData.id;
    }
    
    // Save to history
    const { data, error } = await supabase
      .from('user_size_history')
      .insert({
        user_id: userId,
        brand_id: brandData.id,
        garment_id: garmentId,
        measurement_type: measurementType,
        measurement_value: measurementValue,
        measurement_unit: measurementUnit,
        converted_size: convertedSize
      });
    
    if (error) {
      console.error('Error saving to history:', error);
      return { error: 'Failed to save to history' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in saveToHistory:', error);
    return { error: 'An unexpected error occurred' };
  }
}
