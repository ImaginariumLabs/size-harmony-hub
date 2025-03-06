
import React from 'react';
import { motion } from 'framer-motion';

interface MeasurementTypeSelectorProps {
  measurementType: string;
  onMeasurementTypeChange: (type: string) => void;
  clothingType: string;
}

const MeasurementTypeSelector: React.FC<MeasurementTypeSelectorProps> = ({
  measurementType,
  onMeasurementTypeChange,
  clothingType
}) => {
  if (clothingType !== 'dresses') {
    return null;
  }
  
  return (
    <div className="mb-4">
      <label className="text-sm text-muted-foreground mb-2 block">Which measurement would you like to use?</label>
      <div className="flex flex-wrap gap-2">
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
  );
};

export default MeasurementTypeSelector;
