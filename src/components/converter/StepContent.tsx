
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClothingTypeSelector from '../ClothingTypeSelector';
import BrandSelector from '../BrandSelector';
import MeasurementInput from '../MeasurementInput';
import MeasurementInstructions from './MeasurementInstructions';

interface StepContentProps {
  step: number;
  clothingType: string;
  brand: string;
  bust: string;
  units: string;
  measurementType: string;
  onTypeChange: (type: string) => void;
  onBrandChange: (brand: string) => void;
  onBustChange: (value: string) => void;
  onUnitsChange: (units: string) => void;
  onMeasurementTypeChange: (type: string) => void;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  clothingType,
  brand,
  bust,
  units,
  measurementType,
  onTypeChange,
  onBrandChange,
  onBustChange,
  onUnitsChange,
  onMeasurementTypeChange,
}) => {
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
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
            onTypeChange={onTypeChange}
            visible={step === 1}
          />
        </motion.div>
      )}
      
      {step === 2 && (
        <motion.div
          key="step2"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeVariants}
          className="relative z-10"
        >
          <BrandSelector 
            selectedBrand={brand} 
            onBrandChange={onBrandChange} 
          />
        </motion.div>
      )}
      
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
            onBustChange={onBustChange}
            units={units}
            onUnitsChange={onUnitsChange}
            measurementType={measurementType}
            onMeasurementTypeChange={onMeasurementTypeChange}
            clothingType={clothingType}
          />
          
          <MeasurementInstructions />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepContent;
