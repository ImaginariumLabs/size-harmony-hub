
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import ClothingTypeSelector from './ClothingTypeSelector';
import { useToast } from '@/hooks/use-toast';
import { useConverterSteps, ConversionResult } from '../hooks/useConverterSteps';
import { findSizeByMeasurement } from '../services/sizingService';

// Import sub-components
import ProgressIndicator from './converter/ProgressIndicator';
import BackButton from './converter/BackButton';
import MeasurementInstructions from './converter/MeasurementInstructions';
import ResetButton from './converter/ResetButton';
import AdSpace from './converter/AdSpace';

const SizeConverter: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const calculateSize = async () => {
    if (!state.brand || !state.bust || isNaN(parseFloat(state.bust)) || parseFloat(state.bust) <= 0) {
      state.setResult(null);
      return;
    }
    
    try {
      setLoading(true);
      
      // Call our Supabase service to find the size
      const result = await findSizeByMeasurement(
        state.brand,
        state.clothingType,
        state.measurementType,
        parseFloat(state.bust),
        state.units
      );
      
      state.setResult(result);
    } catch (error) {
      console.error('Error calculating size:', error);
      toast({
        title: "Size calculation failed",
        description: "We couldn't determine your size. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to local calculation
      const measurementInches = state.units === 'cm' ? parseFloat(state.bust) / 2.54 : parseFloat(state.bust);
      
      const findMatchingSize = (sizeSystem: 'US' | 'UK' | 'EU') => {
        // Simple fallback logic - this would be replaced by the Supabase data
        if (measurementInches < 34) return 'XS';
        if (measurementInches < 36) return 'S';
        if (measurementInches < 38) return 'M';
        if (measurementInches < 40) return 'L';
        return 'XL';
      };
      
      state.setResult({
        usSize: findMatchingSize('US'),
        ukSize: findMatchingSize('UK'),
        euSize: findMatchingSize('EU')
      });
    } finally {
      setLoading(false);
    }
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
        
        {/* Loading indicator */}
        {loading && (
          <div className="w-full flex justify-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Step 4: Results */}
        <SizeResult 
          result={state.result} 
          brandName={state.brand}
          onShare={shareResults}
          clothingType={state.clothingType}
          measurementType={state.measurementType}
          measurementValue={state.bust}
          measurementUnit={state.units}
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
