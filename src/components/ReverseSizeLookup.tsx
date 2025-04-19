
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Ruler } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SizeSearchForm from './lookup/SizeSearchForm';
import SizeInfo from './lookup/SizeInfo';

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

const ReverseSizeLookup: React.FC = () => {
  const [region, setRegion] = useState<'EU' | 'US' | 'UK'>('EU');
  const [sizeInput, setSizeInput] = useState('');
  const [sizeInfo, setSizeInfo] = useState<SizeInfo | null>(null);
  const [error, setError] = useState('');

  const lookupSize = async () => {
    setError('');
    setSizeInfo(null);
    
    if (!sizeInput) {
      setError('Please enter a size');
      return;
    }

    try {
      const { data: sizeData, error: sizeError } = await supabase
        .from('standard_size_mappings')
        .select('*')
        .eq('region', region)
        .eq('numeric_size', sizeInput)
        .eq('measurement_type', 'bust');

      if (sizeError) throw sizeError;
      if (!sizeData?.length) {
        setError(`Size ${sizeInput} not found for ${region}`);
        return;
      }

      const currentSize = sizeData[0];
      
      // Get measurements
      const measurements: SizeInfo['measurements'] = {};
      const { data: measurementsData } = await supabase
        .from('standard_size_mappings')
        .select('*')
        .eq('region', region)
        .eq('numeric_size', sizeInput);

      if (measurementsData) {
        measurementsData.forEach(m => {
          if (m.measurement_type === 'bust') {
            measurements.bust = { min: m.min_value, max: m.max_value };
          } else if (m.measurement_type === 'waist') {
            measurements.waist = { min: m.min_value, max: m.max_value };
          }
        });
      }

      // Get equivalent sizes
      const equivalents: SizeInfo['equivalents'] = { US: '', UK: '', EU: '' };
      const regions = ['US', 'UK', 'EU'];
      
      await Promise.all(regions.map(async r => {
        if (r === region) {
          equivalents[r as keyof typeof equivalents] = sizeInput;
          return;
        }

        const { data: equivData } = await supabase
          .from('standard_size_mappings')
          .select('numeric_size')
          .eq('measurement_type', 'bust')
          .gte('min_value', currentSize.min_value)
          .lte('max_value', currentSize.max_value)
          .eq('region', r)
          .limit(1);

        if (equivData?.[0]) {
          equivalents[r as keyof typeof equivalents] = equivData[0].numeric_size;
        }
      }));

      setSizeInfo({
        numericSize: currentSize.numeric_size,
        alphaSize: currentSize.alpha_size,
        measurements,
        equivalents
      });
    } catch (err) {
      console.error('Error looking up size:', err);
      setError('Failed to look up size information');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Reverse Size Lookup
        </CardTitle>
        <CardDescription>
          Enter a clothing size to find equivalent sizes and measurements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SizeSearchForm
            region={region}
            sizeInput={sizeInput}
            onRegionChange={setRegion}
            onSizeInputChange={setSizeInput}
          />
          
          <Button 
            onClick={lookupSize} 
            className="w-full flex items-center gap-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Find Size Information
          </Button>
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          
          {sizeInfo && <SizeInfo sizeInfo={sizeInfo} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReverseSizeLookup;
