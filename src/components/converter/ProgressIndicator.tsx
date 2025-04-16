
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  hasResult?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps,
  hasResult = false 
}) => {
  return (
    <div className="flex items-center justify-center mb-6">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <div 
            className={`h-2 w-2 rounded-full ${
              currentStep >= index + 1 ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
          {index < totalSteps - 1 && (
            <div 
              className={`h-0.5 w-8 ${
                currentStep > index + 1 ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
      {hasResult && (
        <>
          <div className={`h-0.5 w-8 ${hasResult ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-2 rounded-full ${hasResult ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </>
      )}
    </div>
  );
};

export default ProgressIndicator;
