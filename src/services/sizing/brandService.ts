
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';

export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
};

// Mock data for when Supabase is not connected
const mockBrands: Brand[] = [
  { id: '1', name: 'H&M', logo_url: null, created_at: new Date().toISOString() },
  { id: '2', name: 'Zara', logo_url: null, created_at: new Date().toISOString() },
  { id: '3', name: 'Nike', logo_url: null, created_at: new Date().toISOString() },
  { id: '4', name: 'Adidas', logo_url: null, created_at: new Date().toISOString() },
  { id: '5', name: 'Uniqlo', logo_url: null, created_at: new Date().toISOString() },
  { id: '6', name: 'Gap', logo_url: null, created_at: new Date().toISOString() },
  { id: '7', name: 'Levi\'s', logo_url: null, created_at: new Date().toISOString() },
  { id: '8', name: 'Calvin Klein', logo_url: null, created_at: new Date().toISOString() },
  { id: '9', name: 'Tommy Hilfiger', logo_url: null, created_at: new Date().toISOString() },
  { id: '10', name: 'Gucci', logo_url: null, created_at: new Date().toISOString() },
  { id: '11', name: 'Prada', logo_url: null, created_at: new Date().toISOString() },
  { id: '12', name: 'Louis Vuitton', logo_url: null, created_at: new Date().toISOString() }
];

// Cache for brands to improve performance
let brandsCache: Brand[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all brands with improved error handling and caching
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (brandsCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      console.log('Using cached brands data');
      return brandsCache;
    }
    
    // Check if Supabase is connected
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Using mock brands data (Supabase not connected)');
      brandsCache = mockBrands;
      cacheTimestamp = now;
      return mockBrands;
    }
    
    // Fetch brands with sorting and limit
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true })
      .limit(100); // Increased limit to show more brands
    
    if (error) {
      console.error('Error fetching brands:', error);
      brandsCache = mockBrands;
      cacheTimestamp = now;
      return mockBrands;
    }
    
    const brands = data.length > 0 ? data : mockBrands;
    brandsCache = brands;
    cacheTimestamp = now;
    return brands;
  } catch (e) {
    console.error('Unexpected error fetching brands:', e);
    return mockBrands;
  }
};

// Fetch a specific brand by name with caching
export const fetchBrandByName = async (brandName: string): Promise<Brand | null> => {
  try {
    // Try to find in cache first for better performance
    if (brandsCache) {
      const cachedBrand = brandsCache.find(b => b.name === brandName);
      if (cachedBrand) {
        return cachedBrand;
      }
    }
    
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      return mockBrands.find(b => b.name === brandName) || null;
    }
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('name', brandName)
      .single();
    
    if (error) {
      console.error('Error fetching brand:', error);
      return mockBrands.find(b => b.name === brandName) || null;
    }
    
    return data;
  } catch (e) {
    console.error('Unexpected error fetching brand:', e);
    return mockBrands.find(b => b.name === brandName) || null;
  }
};
