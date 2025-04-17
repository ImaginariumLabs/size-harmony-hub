
import React from 'react';
import { motion } from 'framer-motion';

type SizeComparisonResult = {
  brandId: string;
  brandName: string;
  sizes: {
    usSize: string;
    ukSize: string;
    euSize: string;
  };
};

interface ComparisonResultsProps {
  results: SizeComparisonResult[];
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 bg-gray-100 p-3 rounded-md">
        <div className="font-medium">Brand</div>
        <div className="font-medium text-center">US Size</div>
        <div className="font-medium text-center">UK Size</div>
        <div className="font-medium text-center">EU Size</div>
      </div>
      
      {results.map((result, index) => (
        <motion.div 
          key={index} 
          className="grid grid-cols-4 gap-2 p-3 rounded-md border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          <div className="font-medium">{result.brandName}</div>
          <div className="text-center font-bold">{result.sizes.usSize}</div>
          <div className="text-center font-bold">{result.sizes.ukSize}</div>
          <div className="text-center font-bold">{result.sizes.euSize}</div>
        </motion.div>
      ))}
      
      <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800">
        <p>
          <strong>Note:</strong> Sizes may vary slightly even within brands depending on the specific style and cut of the garment.
        </p>
      </div>
    </div>
  );
};

export default ComparisonResults;
