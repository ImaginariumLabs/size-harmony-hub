
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandSelector from '../BrandSelector';
import MeasurementInput from '../MeasurementInput';
import SizeResult from '../SizeResult';
import ClothingTypeSelector from '../ClothingTypeSelector';
import { useSizeConverter } from '@/contexts/SizeConverterContext';
import ProgressIndicator from './ProgressIndicator';
import BackButton from './BackButton';
import MeasurementInstructions from './MeasurementInstructions';
import ResetButton from './ResetButton';
import AdSpace from './AdSpace';
import OfflineModeIndicator from './OfflineModeIndicator';
import LoadingIndicator from './LoadingIndicator';
import StepContent from './StepContent';

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
      <div className="glass-card p-8 shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-300/10 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-300/10 blur-xl"></div>
        
        <OfflineModeIndicator isOfflineMode={isOfflineMode} />
        <ProgressIndicator currentStep={step} hasResult={!!result} />
        
        <AnimatePresence>
          {step > 1 && <BackButton onClick={goBack} />}
        </AnimatePresence>
        
        <StepContent
          step={step}
          clothingType={clothingType}
          brand={brand}
          bust={bust}
          units={units}
          measurementType={measurementType}
          onTypeChange={setClothingType}
          onBrandChange={setBrand}
          onBustChange={setBust}
          onUnitsChange={setUnits}
          onMeasurementTypeChange={setMeasurementType}
        />
        
        <LoadingIndicator loading={loading} />
        
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
                brand={brand}
                clothingType={clothingType}
                bust={bust}
                measurementType={measurementType}
                units={units}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {result && <ResetButton onClick={resetForm} />}
        </AnimatePresence>
        
        <AnimatePresence>
          {result && <AdSpace />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SizeConverterContent;
