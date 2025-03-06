
import React from 'react';

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
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-clean text-lg w-full px-4 py-3"
      placeholder={`Enter your ${measurementType} measurement`}
      min="0"
      step="0.1"
    />
  );
};

export default MeasurementValueInput;
