
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  hasResult: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, hasResult }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className={`h-2 w-2 rounded-full ${currentStep >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`h-0.5 w-8 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`h-2 w-2 rounded-full ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`h-0.5 w-8 ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`h-2 w-2 rounded-full ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`h-0.5 w-8 ${hasResult ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`h-2 w-2 rounded-full ${hasResult ? 'bg-primary' : 'bg-gray-200'}`}></div>
    </div>
  );
};

export default ProgressIndicator;
