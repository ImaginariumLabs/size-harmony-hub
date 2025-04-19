
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SizeInfo {
  numericSize: string;
  alphaSize: string;
  measurements: {
    bust?: { min: number; max: number };
    waist?: { min: number; max: number };
  };
  equivalents: {
    US: string;
    UK: string;
    EU: string;
  };
}

export const useSizeLookup = () => {
  const [sizeInfo, setSizeInfo] = useState<SizeInfo | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const lookupSize = async (region: 'EU' | 'US' | 'UK', sizeInput: string) => {
    setError('');
    setSizeInfo(null);
    setIsLoading(true);

    if (!sizeInput) {
      setError('Please enter a size');
      setIsLoading(false);
      return;
    }

    try {
      // Fetch current size data
      const { data: sizeData, error: sizeError } = await supabase
        .from('standard_size_mappings')
        .select('*')
        .eq('region', region)
        .eq('numeric_size', sizeInput)
        .eq('measurement_type', 'bust')
        .single();

      if (sizeError) throw sizeError;
      if (!sizeData) {
        setError(`Size ${sizeInput} not found for ${region}`);
        setIsLoading(false);
        return;
      }

      // Fetch measurements
      const { data: measurementsData } = await supabase
        .from('standard_size_mappings')
        .select('*')
        .eq('region', region)
        .eq('numeric_size', sizeInput);

      const measurements: SizeInfo['measurements'] = {};
      measurementsData?.forEach(m => {
        if (m.measurement_type === 'bust') {
          measurements.bust = { min: m.min_value, max: m.max_value };
        } else if (m.measurement_type === 'waist') {
          measurements.waist = { min: m.min_value, max: m.max_value };
        }
      });

      // Fetch equivalent sizes
      const equivalents: SizeInfo['equivalents'] = { US: '', UK: '', EU: '' };
      const regions: Array<keyof typeof equivalents> = ['US', 'UK', 'EU'];
      
      await Promise.all(regions.map(async r => {
        if (r === region) {
          equivalents[r] = sizeInput;
          return;
        }

        const { data: equivData } = await supabase
          .from('standard_size_mappings')
          .select('numeric_size')
          .eq('measurement_type', 'bust')
          .gte('min_value', sizeData.min_value)
          .lte('max_value', sizeData.max_value)
          .eq('region', r)
          .limit(1);

        if (equivData?.[0]) {
          equivalents[r] = equivData[0].numeric_size;
        }
      }));

      setSizeInfo({
        numericSize: sizeData.numeric_size,
        alphaSize: sizeData.alpha_size,
        measurements,
        equivalents
      });
    } catch (err) {
      console.error('Error looking up size:', err);
      setError('Failed to look up size information');
    } finally {
      setIsLoading(false);
    }
  };

  return { sizeInfo, error, isLoading, lookupSize };
};
