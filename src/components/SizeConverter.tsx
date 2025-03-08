
import React from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import ClothingTypeSelector from './ClothingTypeSelector';
import { SizeConverterProvider, useSizeConverter } from '../contexts/SizeConverterContext';

// Import sub-components
import ProgressIndicator from './converter/ProgressIndicator';
import BackButton from './converter/BackButton';
import MeasurementInstructions from './converter/MeasurementInstructions';
import ResetButton from './converter/ResetButton';
import AdSpace from './converter/AdSpace';

// The main component is now much simpler as it just uses the context
const SizeConverterContent: React.FC = () => {
  const {
    step,
    clothingType,
    brand,
    bust,
    units,
    measurementType,
    result,
    loading,
    isOfflineMode,
    setClothingType,
    setBrand,
    setBust,
    setUnits,
    setMeasurementType,
    goBack,
    resetForm,
    shareResults
  } = useSizeConverter();
  
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
          currentStep={step} 
          hasResult={!!result} 
        />
        
        {/* Back button */}
        {step > 1 && (
          <BackButton onClick={goBack} />
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
            className="relative z-10" // Higher z-index for the brand selector
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
            
            <MeasurementInstructions />
          </motion.div>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="w-full flex justify-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Results */}
        <SizeResult 
          result={result} 
          brandName={brand}
          onShare={shareResults}
          clothingType={clothingType}
          measurementType={measurementType}
          measurementValue={bust}
          measurementUnit={units}
          isOfflineMode={isOfflineMode}
        />
        
        {/* Reset button (only visible when there's a result) */}
        {result && (
          <ResetButton onClick={resetForm} />
        )}
        
        {/* Ad Space */}
        {result && (
          <AdSpace />
        )}
      </div>
    </div>
  );
};

// Wrapper component that provides the context
const SizeConverter: React.FC = () => {
  return (
    <SizeConverterProvider>
      <SizeConverterContent />
    </SizeConverterProvider>
  );
};

export default SizeConverter;
