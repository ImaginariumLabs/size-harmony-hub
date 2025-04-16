
import React from 'react';

interface UnitSelectorProps {
  selectedUnit: string;
  onChange: (units: string) => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ selectedUnit, onChange }) => {
  return (
    <div className="flex shrink-0 h-full border-l border-gray-100">
      <button
        type="button"
        onClick={() => onChange('inches')}
        className={`px-4 py-3 transition-all duration-300 text-sm font-medium ${
          selectedUnit === 'inches'
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
          selectedUnit === 'cm'
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
