
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface MeasurementValueInputProps {
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  measurementType?: string;
}

const MeasurementValueInput: React.FC<MeasurementValueInputProps> = ({ 
  value, 
  onChange,
  unit,
  measurementType
}) => {
  // Reset state when input is cleared
  useEffect(() => {
    if (value === '') {
      // Ensure the parent component knows the input is cleared
      onChange('');
    }
  }, [value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value
    const newValue = e.target.value;
    
    // Allow empty values or valid positive numbers
    if (newValue === '' || (!isNaN(parseFloat(newValue)) && parseFloat(newValue) >= 0)) {
      onChange(newValue);
    }
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="input-clean text-lg w-full px-4 py-3 rounded-md bg-white/70 hover:bg-white transition-colors border-b-2 border-accent/30 focus:border-primary"
        placeholder={`Enter your ${measurementType || 'measurement'}`}
        min="0"
        step="0.1"
      />
      <div className="absolute inset-0 rounded-md pointer-events-none shadow-sm"></div>
    </motion.div>
  );
};

export default MeasurementValueInput;
