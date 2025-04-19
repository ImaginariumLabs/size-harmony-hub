
import React from 'react';
import { motion } from 'framer-motion';

interface SizeInfo {
  numericSize: string;
  alphaSize: string;
  measurements: {
    bust?: { min: number; max: number };
    waist?: { min: number; max: number };
  };
  equivalents: {
    US: string;
    UK: string;
    EU: string;
  };
}

interface SizeLookupResultsProps {
  sizeInfo: SizeInfo;
}

const SizeLookupResults: React.FC<SizeLookupResultsProps> = ({ sizeInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-primary/5 rounded-lg"
    >
      <h3 className="text-lg font-medium mb-2">Size Information</h3>
      
      <div className="grid gap-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium">Size:</span>
          <span>{sizeInfo.numericSize} ({sizeInfo.alphaSize})</span>
        </div>
        
        {sizeInfo.measurements.bust && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Bust:</span>
            <span>{sizeInfo.measurements.bust.min}-{sizeInfo.measurements.bust.max} cm</span>
          </div>
        )}
        
        {sizeInfo.measurements.waist && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Waist:</span>
            <span>{sizeInfo.measurements.waist.min}-{sizeInfo.measurements.waist.max} cm</span>
          </div>
        )}
        
        <div className="mt-2 pt-2 border-t">
          <p className="font-medium mb-1">Equivalent sizes:</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(sizeInfo.equivalents)
              .map(([r, size]) => (
                <div key={r} className="text-center p-1 bg-primary/10 rounded">
                  <div className="font-medium text-xs text-primary/70">{r}</div>
                  <div>{size}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SizeLookupResults;
