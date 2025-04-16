
import React from 'react';
import { ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShare } from '@/contexts/converter/useShare';
import { SizeResultType } from '@/contexts/converter/types';
import SaveMeasurements from './SaveMeasurements';

interface SizeResultProps {
  result: SizeResultType;
  brand: string;
  clothingType: string;
  bust: string;
  measurementType: string;
  units: string;
}

const SizeResult: React.FC<SizeResultProps> = ({ 
  result, 
  brand, 
  clothingType,
  bust,
  measurementType,
  units
}) => {
  const { shareResults } = useShare();

  if (!result) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Your Size</h3>
        <p>US: {result.usSize}</p>
        <p>UK: {result.ukSize}</p>
        <p>EU: {result.euSize}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => shareResults(result, brand, clothingType)}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <ShareIcon className="h-4 w-4" />
          Share Result
        </Button>

        <SaveMeasurements 
          bust={bust}
          measurementType={measurementType}
          units={units}
        />
      </div>
    </div>
  );
};

export default SizeResult;
