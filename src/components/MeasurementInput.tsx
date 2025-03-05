
import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

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
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const getMeasurementLabel = () => {
    switch (measurementType) {
      case 'bust': return 'Bust Measurement';
      case 'waist': return 'Waist Measurement';
      case 'hips': return 'Hip Measurement';
      default: return 'Measurement';
    }
  };
  
  const getTooltipText = () => {
    switch (measurementType) {
      case 'bust': 
        return 'Measure around the fullest part of your bust while wearing a non-padded bra.';
      case 'waist': 
        return 'Measure around your natural waistline, which is the narrowest part of your torso.';
      case 'hips': 
        return 'Measure around the fullest part of your hips and buttocks.';
      default: 
        return 'Measure according to the selected body part.';
    }
  };
  
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      {/* Measurement type selector for dresses - where multiple measurements might apply */}
      {clothingType === 'dresses' && (
        <div className="mb-4">
          <label className="text-sm text-muted-foreground mb-2 block">Which measurement would you like to use?</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onMeasurementTypeChange('bust')}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                measurementType === 'bust' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Bust
            </button>
            <button
              type="button"
              onClick={() => onMeasurementTypeChange('waist')}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                measurementType === 'waist' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Waist
            </button>
            <button
              type="button"
              onClick={() => onMeasurementTypeChange('hips')}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                measurementType === 'hips' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Hips
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-2">
        <label className="text-sm text-muted-foreground">{getMeasurementLabel()}</label>
        <div className="relative ml-2">
          <HelpCircle 
            className="w-4 h-4 text-muted-foreground cursor-pointer" 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <motion.div 
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 w-64 text-xs rounded-lg shadow-lg glass-card z-20"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>{getTooltipText()}</p>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="flex items-center glass-card p-1 pl-4">
        <input
          type="number"
          value={bustValue}
          onChange={(e) => onBustChange(e.target.value)}
          className="input-clean text-lg w-full"
          placeholder={`Enter your ${measurementType} measurement`}
          min="0"
          step="0.1"
        />
        
        <div className="flex space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => onUnitsChange('inches')}
            className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
              units === 'inches'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            in
          </button>
          
          <button
            type="button"
            onClick={() => onUnitsChange('cm')}
            className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
              units === 'cm'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            cm
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MeasurementInput;
