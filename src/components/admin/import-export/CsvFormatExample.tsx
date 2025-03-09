
import React from 'react';
import { Info } from 'lucide-react';

const CsvFormatExample: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mt-4">
      <h3 className="text-sm font-medium flex items-center mb-2">
        <Info className="h-4 w-4 mr-2 text-primary" />
        CSV Format Example
      </h3>
      <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
        brand,garment,region,sizeLabel,measurementType,minValue,maxValue,unit<br/>
        "H&M","tops","US","S","bust",84,88,"cm"<br/>
        "H&M","tops","US","S","waist",68,72,"cm"<br/>
        "Zara","dresses","UK","10","bust",90,94,"cm"
      </div>
    </div>
  );
};

export default CsvFormatExample;
