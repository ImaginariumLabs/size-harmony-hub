
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import ClothingTypeSelector from './ClothingTypeSelector';
import { SizeConverterProvider, useSizeConverter } from '../contexts/SizeConverterContext';
import { Sparkles } from 'lucide-react';

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
  
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-8 shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-300/10 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-300/10 blur-xl"></div>
        
        {/* Offline Mode Indicator */}
        <AnimatePresence>
          {isOfflineMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-md text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Offline Mode: Using estimated sizes</span>
            </motion.div>
          )}
        </AnimatePresence>
      
        {/* Progress indicator */}
        <ProgressIndicator 
          currentStep={step} 
          hasResult={!!result} 
        />
        
        {/* Back button */}
        <AnimatePresence>
          {step > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BackButton onClick={goBack} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Step 1: Clothing Type Selection */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
            >
              <ClothingTypeSelector
                selectedType={clothingType}
                onTypeChange={setClothingType}
                visible={step === 1}
              />
            </motion.div>
          )}
          
          {/* Step 2: Brand Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              className="relative z-10" // Higher z-index for the brand selector
            >
              <BrandSelector 
                selectedBrand={brand} 
                onBrandChange={setBrand} 
              />
            </motion.div>
          )}
          
          {/* Step 3: Measurement Input */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
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
        </AnimatePresence>
        
        {/* Loading indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex justify-center my-6"
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Reset button (only visible when there's a result) */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <ResetButton onClick={resetForm} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Ad Space */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <AdSpace />
            </motion.div>
          )}
        </AnimatePresence>
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
