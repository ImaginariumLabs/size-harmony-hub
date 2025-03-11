
import { supabase } from '@/lib/supabase';
import sizeData, { Brand, Size, SizeChart } from './sizeData';

// Function to import all size data from the static file to Supabase
export async function importAllSizeDataToSupabase() {
  try {
    const isConnected = await isSupabaseConnected();
    if (!isConnected) {
      console.error("Cannot import data: Supabase connection is not available");
      return {
        success: false,
        message: "Database connection is not available. Using demo data instead."
      };
    }

    const results = {
      brands: 0,
      sizeRanges: 0,
      errors: [] as string[]
    };

    // Process each brand
    for (const brand of sizeData.brands) {
      try {
        // Add the brand to Supabase
        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .upsert({ name: brand.name })
          .select('id')
          .single();

        if (brandError) {
          throw new Error(`Error adding brand ${brand.name}: ${brandError.message}`);
        }

        const brandId = brandData.id;
        results.brands++;

        // Process size data for each region (US, UK, EU)
        await processSizeRegion(brandId, brand, 'US', results);
        await processSizeRegion(brandId, brand, 'UK', results);
        await processSizeRegion(brandId, brand, 'EU', results);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    return {
      success: true,
      message: `Imported ${results.brands} brands and ${results.sizeRanges} size ranges`,
      details: results
    };
  } catch (error) {
    console.error("Error importing size data:", error);
    return {
      success: false,
      message: "Failed to import size data",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Helper function to process size data for a specific region
async function processSizeRegion(brandId: string, brand: Brand, region: 'US' | 'UK' | 'EU', results: { sizeRanges: number, errors: string[] }) {
  try {
    // Get garment ID for "tops" (default)
    let { data: garmentData, error: garmentError } = await supabase
      .from('garments')
      .select('id')
      .eq('name', 'tops')
      .maybeSingle();

    if (garmentError) {
      throw new Error(`Error getting garment: ${garmentError.message}`);
    }

    // If garment doesn't exist, create it
    if (!garmentData) {
      const { data: newGarment, error: newGarmentError } = await supabase
        .from('garments')
        .insert({ name: 'tops' })
        .select('id')
        .single();

      if (newGarmentError) {
        throw new Error(`Error creating garment: ${newGarmentError.message}`);
      }

      garmentData = newGarment;
    }

    const garmentId = garmentData.id;
    const sizeRanges = brand.sizes[region];

    // Process each size range for the region
    for (const sizeRange of sizeRanges) {
      await supabase.rpc('import_size_data', {
        p_brand_name: brand.name,
        p_garment_name: 'tops',
        p_region: region,
        p_size_label: sizeRange.size,
        p_measurement_type: 'bust',
        p_min_value: sizeRange.bust_min_inches,
        p_max_value: sizeRange.bust_max_inches,
        p_unit: 'inches'
      });

      results.sizeRanges++;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.errors.push(errorMessage);
    console.error(errorMessage);
  }
}

// Utility to check if Supabase is connected
async function isSupabaseConnected() {
  try {
    const { data, error } = await supabase.from('brands').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
