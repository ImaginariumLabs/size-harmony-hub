
import React from 'react';
import { motion } from 'framer-motion';

interface MeasurementInputProps {
  bustValue: string;
  onBustChange: (value: string) => void;
  units: string;
  onUnitsChange: (units: string) => void;
}

const MeasurementInput: React.FC<MeasurementInputProps> = ({
  bustValue,
  onBustChange,
  units,
  onUnitsChange,
}) => {
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <label className="text-sm text-muted-foreground mb-2 block">Bust Measurement</label>
      
      <div className="flex items-center glass-card p-1 pl-4">
        <input
          type="number"
          value={bustValue}
          onChange={(e) => onBustChange(e.target.value)}
          className="input-clean text-lg w-full"
          placeholder="Enter your bust measurement"
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
      
      <motion.p 
        className="mt-2 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Measure around the fullest part of your bust while wearing a non-padded bra.
      </motion.p>
    </motion.div>
  );
};

export default MeasurementInput;
