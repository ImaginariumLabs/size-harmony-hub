
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import ClothingTypeSelector from './ClothingTypeSelector';
import { useToast } from '@/hooks/use-toast';
import { useConverterSteps, ConversionResult } from '../hooks/useConverterSteps';
import { findSizeByMeasurement } from '../services/sizingService';
import { isSupabaseConnected } from '../lib/supabase';

// Import sub-components
import ProgressIndicator from './converter/ProgressIndicator';
import BackButton from './converter/BackButton';
import MeasurementInstructions from './converter/MeasurementInstructions';
import ResetButton from './converter/ResetButton';
import AdSpace from './converter/AdSpace';

const SizeConverter: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await isSupabaseConnected();
      if (!connected) {
        setIsOfflineMode(true);
        toast({
          title: "Offline Mode",
          description: "Using local data since database connection is unavailable.",
          variant: "default"
        });
      }
    };
    
    checkConnection();
  }, [toast]);
  
  const calculateSize = async () => {
    if (!state.brand || !state.bust || isNaN(parseFloat(state.bust)) || parseFloat(state.bust) <= 0) {
      state.setResult(null);
      return;
    }
    
    try {
      setLoading(true);
      
      // Call our sizing service to find the size
      const result = await findSizeByMeasurement(
        state.brand,
        state.clothingType,
        state.measurementType,
        parseFloat(state.bust),
        state.units
      );
      
      state.setResult(result);
      
      // Show offline mode indicator if we're using fallback calculations
      const offlineToastId = 'offline-mode';
      const existingToast = toast.dismiss ? toast.dismiss.bind(null, offlineToastId) : undefined;
      
      if (isOfflineMode && !existingToast) {
        toast({
          title: "Using estimated sizes",
          description: "Size data is estimated as database connection is unavailable.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error calculating size:', error);
      toast({
        title: "Size calculation issue",
        description: "We're having trouble with precise calculations. Showing estimated sizes.",
        variant: "destructive"
      });
      
      // Fallback calculation is now handled in the service
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
        {/* Offline Mode Indicator */}
        {isOfflineMode && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Offline Mode: Using estimated sizes</span>
          </div>
        )}
      
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
          isOfflineMode={isOfflineMode}
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
