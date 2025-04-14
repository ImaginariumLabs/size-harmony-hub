
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';
import { toast } from 'sonner';
import sizeData from '../../utils/sizeData';

/**
 * Synchronizes the static size data with the Supabase database
 * This is useful for development and initial setup
 */
export const syncSizeDataWithSupabase = async () => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Cannot sync data: Supabase not connected');
      return {
        success: false,
        error: 'Supabase connection not available',
        message: 'Cannot sync data because Supabase is not connected.'
      };
    }
    
    let brandCount = 0;
    let sizeRangeCount = 0;
    const errors: string[] = [];
    
    // Process each brand
    for (const brand of sizeData.brands) {
      try {
        // Add or update the brand
        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .upsert({ name: brand.name })
          .select('id')
          .single();
          
        if (brandError) {
          errors.push(`Error adding brand ${brand.name}: ${brandError.message}`);
          continue;
        }
        
        const brandId = brandData.id;
        brandCount++;
        
        // First ensure we have the garment types
        const garmentTypes = ['tops', 'bottoms', 'dresses'];
        
        for (const garmentType of garmentTypes) {
          // Add or update the garment type
          const { data: garmentData, error: garmentError } = await supabase
            .from('garments')
            .upsert({ name: garmentType })
            .select('id')
            .single();
            
          if (garmentError) {
            errors.push(`Error adding garment ${garmentType}: ${garmentError.message}`);
            continue;
          }
          
          const garmentId = garmentData.id;
          
          // Process regions (US, UK, EU)
          for (const region of ['US', 'UK', 'EU']) {
            // Get size data for this region
            const regionSizes = brand.sizes[region as keyof typeof brand.sizes];
            
            if (!regionSizes || !Array.isArray(regionSizes)) {
              errors.push(`No size data for brand ${brand.name}, region ${region}`);
              continue;
            }
            
            // Process each size in this region
            for (const sizeData of regionSizes) {
              // Add measurement types based on garment
              const measurementTypes = ['bust', 'waist', 'hips'];
              
              for (const measurementType of measurementTypes) {
                // Get min/max values based on measurement type
                let minValue, maxValue;
                
                if (measurementType === 'bust') {
                  minValue = sizeData.bust_min_inches;
                  maxValue = sizeData.bust_max_inches;
                } else if (measurementType === 'waist') {
                  // Use bust values as fallback for other measurements
                  minValue = sizeData.bust_min_inches - 10;
                  maxValue = sizeData.bust_max_inches - 10;
                } else if (measurementType === 'hips') {
                  minValue = sizeData.bust_min_inches + 2;
                  maxValue = sizeData.bust_max_inches + 2;
                }
                
                if (minValue === undefined || maxValue === undefined) {
                  continue;
                }
                
                // Add size range
                const { error: sizeError } = await supabase
                  .from('size_ranges')
                  .upsert({
                    brand_id: brandId,
                    garment_id: garmentId,
                    region: region,
                    size_label: sizeData.size,
                    measurement_type: measurementType,
                    min_value: minValue,
                    max_value: maxValue,
                    unit: 'inches'
                  });
                  
                if (sizeError) {
                  errors.push(`Error adding size range for ${brand.name}, ${garmentType}, ${region}, ${sizeData.size}: ${sizeError.message}`);
                } else {
                  sizeRangeCount++;
                }
              }
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`Unexpected error processing brand ${brand.name}: ${errorMessage}`);
      }
    }
    
    return {
      success: true,
      message: `Synced ${brandCount} brands and ${sizeRangeCount} size ranges`,
      details: {
        brands: brandCount,
        sizeRanges: sizeRangeCount,
        errors: errors
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
      message: 'Error syncing size data with Supabase'
    };
  }
};
