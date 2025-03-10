
import { supabase } from '../../integrations/supabase/client';
import { getConnectionStatus } from '../../lib/supabase';

// Enhanced export function with better error handling and validation
export const exportSizeDataToCSV = async (
  brandFilter?: string,
  garmentFilter?: string
): Promise<string> => {
  try {
    const status = await getConnectionStatus();
    if (!status.connected) {
      throw new Error('Database connection is not available. Please try again when online.');
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
  } catch (error) {
    console.error('Error exporting size data:', error);
    throw error;
  }
};

// Enhanced import function with better error handling and validation
export const importSizeDataFromCSV = async (
  csvContent: string
): Promise<{ total: number; success: number; errors: string[] }> => {
  try {
    const status = await getConnectionStatus();
    if (!status.connected) {
      throw new Error('Database connection is not available. Please try again when online.');
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
