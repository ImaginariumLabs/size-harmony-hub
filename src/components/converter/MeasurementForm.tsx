
import React from 'react';
import { MeasurementValueInput } from './MeasurementValueInput';
import { UnitSelector } from './UnitSelector';
import { MeasurementTypeSelector } from './MeasurementTypeSelector';
import { MeasurementLabel } from './MeasurementLabel';
import MeasurementGuide from '@/components/MeasurementGuide';

interface MeasurementFormProps {
  measurementType: string;
  measurementValue: string;
  measurementUnit: string;
  onMeasurementTypeChange: (type: string) => void;
  onMeasurementValueChange: (value: string) => void;
  onMeasurementUnitChange: (unit: string) => void;
  clothingType: string;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({
  measurementType,
  measurementValue,
  measurementUnit,
  onMeasurementTypeChange,
  onMeasurementValueChange,
  onMeasurementUnitChange,
  clothingType,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <MeasurementLabel
            measurementType={measurementType}
            clothingType={clothingType}
          />
          <MeasurementGuide measurementType={measurementType} />
        </div>
        
        <MeasurementTypeSelector
          selectedType={measurementType}
          onChange={onMeasurementTypeChange}
          clothingType={clothingType}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="measurement-value" className="text-sm font-medium">
            Measurement Value
          </label>
          <UnitSelector
            selectedUnit={measurementUnit}
            onChange={onMeasurementUnitChange}
          />
        </div>
        
        <MeasurementValueInput
          value={measurementValue}
          onChange={onMeasurementValueChange}
          unit={measurementUnit}
        />
      </div>
    </div>
  );
};

export default MeasurementForm;
