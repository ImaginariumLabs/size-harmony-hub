
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight, Ruler } from 'lucide-react';
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

const ReverseSizeLookup: React.FC = () => {
  const [gender, setGender] = useState<'women' | 'men'>('women');
  const [region, setRegion] = useState<'EU' | 'US' | 'UK'>('EU');
  const [sizeInput, setSizeInput] = useState('');
  const [sizeInfo, setSizeInfo] = useState<SizeInfo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setSizeInfo(null);
    setError('');
  }, [gender, region]);

  const lookupSize = async () => {
    setError('');
    setSizeInfo(null);
    
    if (!sizeInput) {
      setError('Please enter a size');
      return;
    }

    try {
      // Get size information for the input size
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
      
      // Get measurements for this size
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

      // Get equivalent sizes in other regions
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
    <div className="w-full max-w-md mx-auto">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select value={region} onValueChange={(value) => setRegion(value as 'EU' | 'US' | 'UK')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EU">European (EU)</SelectItem>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Input 
                  value={sizeInput} 
                  onChange={(e) => setSizeInput(e.target.value)} 
                  placeholder={`Enter ${region} size`}
                />
              </div>
            </div>
            
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
            
            {sizeInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-primary/5 rounded-lg"
              >
                <h3 className="text-lg font-medium mb-2">Size Information</h3>
                
                <div className="grid gap-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Size:</span>
                    <span>{sizeInfo.numericSize} ({sizeInfo.alphaSize})</span>
                  </div>
                  
                  {sizeInfo.measurements.bust && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Bust:</span>
                      <span>{sizeInfo.measurements.bust.min}-{sizeInfo.measurements.bust.max} cm</span>
                    </div>
                  )}
                  
                  {sizeInfo.measurements.waist && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Waist:</span>
                      <span>{sizeInfo.measurements.waist.min}-{sizeInfo.measurements.waist.max} cm</span>
                    </div>
                  )}
                  
                  <div className="mt-2 pt-2 border-t">
                    <p className="font-medium mb-1">Equivalent sizes:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(sizeInfo.equivalents)
                        .filter(([r]) => r !== region)
                        .map(([r, size]) => (
                          <div key={r} className="text-center p-1 bg-primary/10 rounded">
                            <div className="font-medium text-xs text-primary/70">{r}</div>
                            <div>{size}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReverseSizeLookup;
