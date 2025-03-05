
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import sizeData from '../utils/sizeData';
import { Info, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SizeConverter: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [bust, setBust] = useState('');
  const [units, setUnits] = useState('inches');
  const [result, setResult] = useState<{ usSize: string; ukSize: string; euSize: string } | null>(null);
  const [step, setStep] = useState(1); // 1 = brand selection, 2 = measurement input
  const { toast } = useToast();
  
  // Calculate size whenever inputs change
  React.useEffect(() => {
    if (brand && bust && !isNaN(parseFloat(bust)) && parseFloat(bust) > 0) {
      calculateSize();
    } else {
      setResult(null);
    }
  }, [brand, bust, units]);
  
  // When brand changes, move to step 2
  React.useEffect(() => {
    if (brand) {
      setStep(2);
    }
  }, [brand]);
  
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
  
  const resetForm = () => {
    setBrand('');
    setBust('');
    setResult(null);
    setStep(1);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-0.5 w-8 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-0.5 w-8 ${result ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-2 rounded-full ${result ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* Step 1: Brand Selection */}
        <motion.div
          animate={{ opacity: step === 1 ? 1 : 0.3, height: step === 1 ? 'auto' : 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <BrandSelector 
            selectedBrand={brand} 
            onBrandChange={setBrand} 
          />
          
          {step === 1 && (
            <motion.div 
              className="flex justify-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-1 text-amber-500" />
                Select a brand to continue
              </p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Step 2: Measurement Input */}
        {brand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step === 2 ? 1 : 0.8, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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
          </motion.div>
        )}
        
        {/* Step 3: Results */}
        <SizeResult 
          result={result} 
          brandName={brand}
          onShare={shareResults} 
        />
        
        {/* Reset button (only visible when there's a result) */}
        {result && (
          <motion.div 
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={resetForm}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Try another brand or measurement
            </button>
          </motion.div>
        )}
        
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
