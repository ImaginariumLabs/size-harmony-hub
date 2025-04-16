
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface MeasurementLabelProps {
  measurementType: string;
  clothingType: string;
}

const MeasurementLabel: React.FC<MeasurementLabelProps> = ({ measurementType, clothingType }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
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
  );
};

export default MeasurementLabel;
