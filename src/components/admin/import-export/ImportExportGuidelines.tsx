
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';

const ImportExportGuidelines: React.FC = () => {
  return (
    <Alert className="bg-primary/5 border-primary/20">
      <Info className="h-4 w-4 text-primary" />
      <AlertTitle>CSV Import/Export Guidelines</AlertTitle>
      <AlertDescription className="text-sm">
        <p className="mb-2">
          The CSV file should include the following columns: brand, garment, region, sizeLabel, 
          measurementType, minValue, maxValue, and unit (optional, defaults to cm).
        </p>
        <p>
          Import will add new size data and update existing entries if the brand, garment, region, 
          size label, and measurement type combination already exists.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ImportExportGuidelines;
