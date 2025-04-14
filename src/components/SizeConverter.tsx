
import React from 'react';
import { SizeConverterProvider } from '../contexts/SizeConverterContext';
import SizeConverterContent from './converter/SizeConverterContent';

const SizeConverter: React.FC = () => {
  return (
    <SizeConverterProvider>
      <SizeConverterContent />
    </SizeConverterProvider>
  );
};

export default SizeConverter;
