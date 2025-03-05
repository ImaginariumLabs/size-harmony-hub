
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import ClothingTypeSelector from './ClothingTypeSelector';
import sizeData from '../utils/sizeData';
import { Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SizeConverter: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [bust, setBust] = useState('');
  const [units, setUnits] = useState('inches');
  const [result, setResult] = useState<{ usSize: string; ukSize: string; euSize: string } | null>(null);
  const [step, setStep] = useState(1); // 1 = clothing type, 2 = brand selection, 3 = measurement input
  const [clothingType, setClothingType] = useState(''); // 'tops', 'dresses', 'bottoms'
  const [measurementType, setMeasurementType] = useState('bust'); // 'bust', 'waist', 'hips'
  const { toast } = useToast();
  
  // When clothing type changes, update measurement type and move to step 2
  React.useEffect(() => {
    if (clothingType) {
      // Set default measurement based on clothing type
      if (clothingType === 'tops') setMeasurementType('bust');
      else if (clothingType === 'bottoms') setMeasurementType('waist');
      else if (clothingType === 'dresses') setMeasurementType('bust');
      
      setStep(2);
    }
  }, [clothingType]);
  
  // When brand changes, move to step 3
  React.useEffect(() => {
    if (brand) {
      setStep(3);
    }
  }, [brand]);
  
  // Calculate size whenever inputs change
  React.useEffect(() => {
    if (brand && bust && !isNaN(parseFloat(bust)) && parseFloat(bust) > 0) {
      calculateSize();
    } else {
      setResult(null);
    }
  }, [brand, bust, units, measurementType]);
  
  const calculateSize = () => {
    if (!brand || !bust || isNaN(parseFloat(bust)) || parseFloat(bust) <= 0) {
      setResult(null);
      return;
    }

    // Convert to inches if needed
    const measurementInches = units === 'cm' ? parseFloat(bust) / 2.54 : parseFloat(bust);

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
      
      // Use appropriate measurement field based on type
      const matchedSize = selectedBrand.sizes[sizeSystem].find(
        size => {
          if (measurementType === 'bust') {
            return measurementInches >= size.bust_min_inches && measurementInches <= size.bust_max_inches;
          } else if (measurementType === 'waist') {
            // Using bust measurements as a fallback since we don't have waist in the data yet
            return measurementInches >= size.bust_min_inches && measurementInches <= size.bust_max_inches;
          } else if (measurementType === 'hips') {
            // Using bust measurements as a fallback since we don't have hips in the data yet
            return measurementInches >= size.bust_min_inches && measurementInches <= size.bust_max_inches;
          }
          return false;
        }
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
    
    const text = `My ${clothingType} size at ${brand} is US: ${result.usSize}, UK: ${result.ukSize}, EU: ${result.euSize}`;
    
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
  
  const goBack = () => {
    if (step === 3) {
      setBust('');
      setResult(null);
      setStep(2);
    } else if (step === 2) {
      setBrand('');
      setStep(1);
    }
  };
  
  const resetForm = () => {
    setClothingType('');
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
          <div className={`h-0.5 w-8 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-0.5 w-8 ${result ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-2 rounded-full ${result ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* Back button */}
        {step > 1 && (
          <motion.button
            onClick={goBack}
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </motion.button>
        )}
        
        {/* Step 1: Clothing Type Selection */}
        <motion.div
          animate={{ opacity: step === 1 ? 1 : 0.3, height: step === 1 ? 'auto' : 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <ClothingTypeSelector
            selectedType={clothingType}
            onTypeChange={setClothingType}
            visible={step === 1}
          />
        </motion.div>
        
        {/* Step 2: Brand Selection */}
        {clothingType && (
          <motion.div
            animate={{ opacity: step === 2 ? 1 : 0.3, height: step === 2 ? 'auto' : 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <BrandSelector 
              selectedBrand={brand} 
              onBrandChange={setBrand} 
            />
          </motion.div>
        )}
        
        {/* Step 3: Measurement Input */}
        {brand && clothingType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step === 3 ? 1 : 0.8, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MeasurementInput 
              bustValue={bust}
              onBustChange={setBust}
              units={units}
              onUnitsChange={setUnits}
              measurementType={measurementType}
              onMeasurementTypeChange={setMeasurementType}
              clothingType={clothingType}
            />
            
            <div className="flex items-center mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                Enter your measurements and we'll automatically find your size. No button needed!
              </p>
            </div>
          </motion.div>
        )}
        
        {/* Step 4: Results */}
        <SizeResult 
          result={result} 
          brandName={brand}
          onShare={shareResults}
          clothingType={clothingType}
          measurementType={measurementType}
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
