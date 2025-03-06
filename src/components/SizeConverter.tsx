
import React from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import ClothingTypeSelector from './ClothingTypeSelector';
import sizeData from '../utils/sizeData';
import { useToast } from '@/hooks/use-toast';
import { useConverterSteps, ConversionResult } from '../hooks/useConverterSteps';

// Import sub-components
import ProgressIndicator from './converter/ProgressIndicator';
import BackButton from './converter/BackButton';
import MeasurementInstructions from './converter/MeasurementInstructions';
import ResetButton from './converter/ResetButton';
import AdSpace from './converter/AdSpace';

const SizeConverter: React.FC = () => {
  const { toast } = useToast();
  
  const calculateSize = () => {
    if (!state.brand || !state.bust || isNaN(parseFloat(state.bust)) || parseFloat(state.bust) <= 0) {
      state.setResult(null);
      return;
    }

    // Convert to inches if needed
    const measurementInches = state.units === 'cm' ? parseFloat(state.bust) / 2.54 : parseFloat(state.bust);

    // Find the selected brand
    const selectedBrand = sizeData.brands.find(b => b.name === state.brand);
    if (!selectedBrand) {
      state.setResult(null);
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
          if (state.measurementType === 'bust') {
            return measurementInches >= size.bust_min_inches && measurementInches <= size.bust_max_inches;
          } else if (state.measurementType === 'waist') {
            // Using bust measurements as a fallback since we don't have waist in the data yet
            return measurementInches >= size.bust_min_inches && measurementInches <= size.bust_max_inches;
          } else if (state.measurementType === 'hips') {
            // Using bust measurements as a fallback since we don't have hips in the data yet
            return measurementInches >= size.bust_min_inches && measurementInches <= size.bust_max_inches;
          }
          return false;
        }
      );
      return matchedSize ? matchedSize.size : 'No exact match found';
    };

    state.setResult({
      usSize: findMatchingSize('US'),
      ukSize: findMatchingSize('UK'),
      euSize: findMatchingSize('EU')
    });
  };

  const state = useConverterSteps({ calculateSize });
  
  const shareResults = () => {
    if (!state.result) return;
    
    const text = `My ${state.clothingType} size at ${state.brand} is US: ${state.result.usSize}, UK: ${state.result.ukSize}, EU: ${state.result.euSize}`;
    
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
        {/* Progress indicator */}
        <ProgressIndicator 
          currentStep={state.step} 
          hasResult={!!state.result} 
        />
        
        {/* Back button */}
        {state.step > 1 && (
          <BackButton onClick={state.goBack} />
        )}
        
        {/* Step 1: Clothing Type Selection */}
        <motion.div
          animate={{ opacity: state.step === 1 ? 1 : 0.3, height: state.step === 1 ? 'auto' : 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <ClothingTypeSelector
            selectedType={state.clothingType}
            onTypeChange={state.setClothingType}
            visible={state.step === 1}
          />
        </motion.div>
        
        {/* Step 2: Brand Selection */}
        {state.clothingType && (
          <motion.div
            animate={{ opacity: state.step === 2 ? 1 : 0.3, height: state.step === 2 ? 'auto' : 'auto' }}
            transition={{ duration: 0.3 }}
            className="relative z-10" // Higher z-index for the brand selector
          >
            <BrandSelector 
              selectedBrand={state.brand} 
              onBrandChange={state.setBrand} 
            />
          </motion.div>
        )}
        
        {/* Step 3: Measurement Input */}
        {state.brand && state.clothingType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: state.step === 3 ? 1 : 0.8, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MeasurementInput 
              bustValue={state.bust}
              onBustChange={state.setBust}
              units={state.units}
              onUnitsChange={state.setUnits}
              measurementType={state.measurementType}
              onMeasurementTypeChange={state.setMeasurementType}
              clothingType={state.clothingType}
            />
            
            <MeasurementInstructions />
          </motion.div>
        )}
        
        {/* Step 4: Results */}
        <SizeResult 
          result={state.result} 
          brandName={state.brand}
          onShare={shareResults}
          clothingType={state.clothingType}
          measurementType={state.measurementType}
        />
        
        {/* Reset button (only visible when there's a result) */}
        {state.result && (
          <ResetButton onClick={state.resetForm} />
        )}
        
        {/* Ad Space */}
        {state.result && (
          <AdSpace />
        )}
      </div>
    </div>
  );
};

export default SizeConverter;
