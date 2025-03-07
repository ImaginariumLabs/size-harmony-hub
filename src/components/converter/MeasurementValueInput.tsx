
import React from 'react';
import { motion } from 'framer-motion';

interface MeasurementValueInputProps {
  value: string;
  onChange: (value: string) => void;
  measurementType: string;
}

const MeasurementValueInput: React.FC<MeasurementValueInputProps> = ({ 
  value, 
  onChange,
  measurementType
}) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-clean text-lg w-full px-4 py-3 rounded-md bg-white/70 hover:bg-white transition-colors border-b-2 border-accent/30 focus:border-primary"
        placeholder={`Enter your ${measurementType} measurement`}
        min="0"
        step="0.1"
      />
      <div className="absolute inset-0 rounded-md pointer-events-none shadow-sm"></div>
    </motion.div>
  );
};

export default MeasurementValueInput;
