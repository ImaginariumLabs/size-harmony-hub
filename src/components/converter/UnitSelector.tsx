
import React from 'react';

interface UnitSelectorProps {
  selectedUnit?: string;
  onChange: (units: string) => void;
  units?: string; // Added this prop
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ 
  selectedUnit, 
  onChange, 
  units 
}) => {
  // Use units prop if provided, otherwise fall back to selectedUnit
  const activeUnit = units || selectedUnit || 'inches';
  
  return (
    <div className="flex shrink-0 h-full border-l border-gray-100">
      <button
        type="button"
        onClick={() => onChange('inches')}
        className={`px-4 py-3 transition-all duration-300 text-sm font-medium ${
          activeUnit === 'inches'
            ? 'bg-primary text-white'
            : 'hover:bg-gray-50'
        }`}
      >
        in
      </button>
      
      <button
        type="button"
        onClick={() => onChange('cm')}
        className={`px-4 py-3 transition-all duration-300 text-sm font-medium ${
          activeUnit === 'cm'
            ? 'bg-primary text-white'
            : 'hover:bg-gray-50'
        } rounded-r-xl`}
      >
        cm
      </button>
    </div>
  );
};

export default UnitSelector;
