
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          
          return (
            <div key={`step-${index}`} className="flex flex-col items-center">
              <motion.div
                className={`h-3 w-3 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-300'}`}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-xs mt-1 text-gray-500">
                {index === 0 && 'Category'}
                {index === 1 && 'Brand'}
                {index === 2 && 'Size'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
