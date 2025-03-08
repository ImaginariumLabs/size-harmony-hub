
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Allow": "POST, OPTIONS",
      },
      status: 204,
    });
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get admin token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Verify token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();
      
    if (!adminData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }
    
    // Import H&M Tops Size Chart data
    const topsData = [
      // XS (US)
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'XS', measurement: 'bust', min: 76, max: 80, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'XS', measurement: 'waist', min: 60, max: 64, unit: 'cm' },
      
      // S (US)
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'S', measurement: 'bust', min: 84, max: 88, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'S', measurement: 'waist', min: 68, max: 72, unit: 'cm' },
      
      // M (US)
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'M', measurement: 'bust', min: 92, max: 96, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'M', measurement: 'waist', min: 76, max: 80, unit: 'cm' },
      
      // L (US)
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'L', measurement: 'bust', min: 100, max: 104, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'L', measurement: 'waist', min: 84, max: 88, unit: 'cm' },
      
      // XL (US)
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'XL', measurement: 'bust', min: 110, max: 116, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'US', size: 'XL', measurement: 'waist', min: 94, max: 100, unit: 'cm' },
      
      // UK sizes
      { brand: 'H&M', garment: 'tops', region: 'UK', size: '6', measurement: 'bust', min: 76, max: 80, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'UK', size: '8', measurement: 'bust', min: 84, max: 88, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'UK', size: '10', measurement: 'bust', min: 92, max: 96, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'UK', size: '12', measurement: 'bust', min: 100, max: 104, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'UK', size: '14', measurement: 'bust', min: 110, max: 116, unit: 'cm' },
      
      // EU sizes
      { brand: 'H&M', garment: 'tops', region: 'EU', size: '32', measurement: 'bust', min: 76, max: 80, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'EU', size: '34', measurement: 'bust', min: 84, max: 88, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'EU', size: '36', measurement: 'bust', min: 92, max: 96, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'EU', size: '38', measurement: 'bust', min: 100, max: 104, unit: 'cm' },
      { brand: 'H&M', garment: 'tops', region: 'EU', size: '40', measurement: 'bust', min: 110, max: 116, unit: 'cm' },
    ];
    
    // Import H&M Bottoms Size Chart data
    const bottomsData = [
      // XS (US)
      { brand: 'H&M', garment: 'bottoms', region: 'US', size: 'XS', measurement: 'waist', min: 61, max: 64, unit: 'cm' },
      { brand: 'H&M', garment: 'bottoms', region: 'US', size: 'XS', measurement: 'hip', min: 84, max: 88, unit: 'cm' },
      
      // S (US)
      { brand: 'H&M', garment: 'bottoms', region: 'US', size: 'S', measurement: 'waist', min: 66, max: 71, unit: 'cm' },
      { brand: 'H&M', garment: 'bottoms', region: 'US', size: 'S', measurement: 'hip', min: 92, max: 96, unit: 'cm' },
      
      // Add all the other size data from the charts
      // ...
    ];
    
    // Import H&M Dresses Size Chart data
    const dressesData = [
      // XS (US)
      { brand: 'H&M', garment: 'dresses', region: 'US', size: 'XS', measurement: 'bust', min: 76, max: 80, unit: 'cm' },
      { brand: 'H&M', garment: 'dresses', region: 'US', size: 'XS', measurement: 'waist', min: 60, max: 64, unit: 'cm' },
      { brand: 'H&M', garment: 'dresses', region: 'US', size: 'XS', measurement: 'hip', min: 84, max: 88, unit: 'cm' },
      
      // Add more dress size data
      // ...
    ];
    
    // Combine all data
    const allData = [...topsData, ...bottomsData, ...dressesData];
    
    // Import data into Supabase
    const importPromises = allData.map(item => {
      return supabase.rpc('import_size_data', {
        p_brand_name: item.brand,
        p_garment_name: item.garment,
        p_region: item.region,
        p_size_label: item.size,
        p_measurement_type: item.measurement,
        p_min_value: item.min,
        p_max_value: item.max,
        p_unit: item.unit
      });
    });
    
    await Promise.all(importPromises);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Imported ${allData.length} size data entries for H&M`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
