
import React from 'react';
import { motion } from 'framer-motion';
import MeasurementTypeSelector from './converter/MeasurementTypeSelector';
import MeasurementLabel from './converter/MeasurementLabel';
import MeasurementValueInput from './converter/MeasurementValueInput';
import UnitSelector from './converter/UnitSelector';

interface MeasurementInputProps {
  bustValue: string;
  onBustChange: (value: string) => void;
  units: string;
  onUnitsChange: (units: string) => void;
  measurementType: string;
  onMeasurementTypeChange: (type: string) => void;
  clothingType: string;
}

const MeasurementInput: React.FC<MeasurementInputProps> = ({
  bustValue,
  onBustChange,
  units,
  onUnitsChange,
  measurementType,
  onMeasurementTypeChange,
  clothingType
}) => {
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <MeasurementTypeSelector 
        measurementType={measurementType}
        onMeasurementTypeChange={onMeasurementTypeChange}
        clothingType={clothingType}
      />
      
      <MeasurementLabel measurementType={measurementType} />
      
      <div className="flex items-center glass-card">
        <MeasurementValueInput 
          value={bustValue}
          onChange={onBustChange}
          measurementType={measurementType}
        />
        
        <UnitSelector units={units} onUnitsChange={onUnitsChange} />
      </div>
    </motion.div>
  );
};

export default MeasurementInput;
