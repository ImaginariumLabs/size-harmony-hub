
import React from 'react';
import { Info } from 'lucide-react';

const MeasurementInstructions: React.FC = () => {
  return (
    <div className="flex items-center mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
      <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
      <p className="text-sm text-amber-700">
        Enter your measurements and we'll automatically find your size. No button needed!
      </p>
    </div>
  );
};

export default MeasurementInstructions;
