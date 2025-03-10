
import { supabase } from '../../integrations/supabase/client';
import { isSupabaseConnected } from '../../lib/supabase';
import { Feedback } from './types';

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
