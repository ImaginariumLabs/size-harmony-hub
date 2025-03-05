
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import sizeData from '../utils/sizeData';
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SizeConverter: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [bust, setBust] = useState('');
  const [units, setUnits] = useState('inches');
  const [result, setResult] = useState<{ usSize: string; ukSize: string; euSize: string } | null>(null);
  const { toast } = useToast();
  
  // Calculate size whenever inputs change
  React.useEffect(() => {
    if (brand && bust && !isNaN(parseFloat(bust)) && parseFloat(bust) > 0) {
      calculateSize();
    } else {
      setResult(null);
    }
  }, [brand, bust, units]);
  
  const calculateSize = () => {
    if (!brand || !bust || isNaN(parseFloat(bust)) || parseFloat(bust) <= 0) {
      setResult(null);
      return;
    }

    // Convert to inches if needed
    const bustInches = units === 'cm' ? parseFloat(bust) / 2.54 : parseFloat(bust);

    // Find the selected brand
    const selectedBrand = sizeData.brands.find(b => b.name === brand);
    if (!selectedBrand) {
      setResult(null);
      return;
    }

    // Find matching sizes
    const findMatchingSize = (sizeSystem: 'US' | 'UK' | 'EU') => {
      if (!selectedBrand.sizes[sizeSystem]) {
        return 'Not available';
      }
      
      const matchedSize = selectedBrand.sizes[sizeSystem].find(
        size => bustInches >= size.bust_min_inches && bustInches <= size.bust_max_inches
      );
      return matchedSize ? matchedSize.size : 'No exact match found';
    };

    setResult({
      usSize: findMatchingSize('US'),
      ukSize: findMatchingSize('UK'),
      euSize: findMatchingSize('EU')
    });
  };
  
  const shareResults = () => {
    if (!result) return;
    
    const text = `My size at ${brand} is US: ${result.usSize}, UK: ${result.ukSize}, EU: ${result.euSize}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Size Results',
        text: text,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Your size info has been copied to share",
        });
      });
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-8">
        <BrandSelector 
          selectedBrand={brand} 
          onBrandChange={setBrand} 
        />
        
        <MeasurementInput 
          bustValue={bust}
          onBustChange={setBust}
          units={units}
          onUnitsChange={setUnits}
        />
        
        <div className="flex items-center mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Enter your measurements and we'll automatically find your size. No button needed!
          </p>
        </div>
        
        <SizeResult 
          result={result} 
          brandName={brand}
          onShare={shareResults} 
        />
        
        {/* Ad Space */}
        {result && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-muted-foreground mb-2">ADVERTISEMENT</p>
            <div className="h-[250px] bg-gray-100 rounded flex items-center justify-center">
              <p className="text-sm text-gray-400">Ad Space (300x250)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeConverter;
