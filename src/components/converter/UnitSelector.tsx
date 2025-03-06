
import React from 'react';

interface UnitSelectorProps {
  units: string;
  onUnitsChange: (units: string) => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ units, onUnitsChange }) => {
  return (
    <div className="flex shrink-0 h-full border-l border-gray-100">
      <button
        type="button"
        onClick={() => onUnitsChange('inches')}
        className={`px-4 py-3 transition-all duration-300 text-sm font-medium ${
          units === 'inches'
            ? 'bg-primary text-white'
            : 'hover:bg-gray-50'
        }`}
      >
        in
      </button>
      
      <button
        type="button"
        onClick={() => onUnitsChange('cm')}
        className={`px-4 py-3 transition-all duration-300 text-sm font-medium ${
          units === 'cm'
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
