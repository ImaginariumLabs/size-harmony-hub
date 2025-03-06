
import { useState, useEffect } from 'react';

export type ConversionResult = {
  usSize: string;
  ukSize: string;
  euSize: string;
} | null;

interface UseConverterStepsProps {
  calculateSize: () => void;
}

export function useConverterSteps({ calculateSize }: UseConverterStepsProps) {
  const [brand, setBrand] = useState('');
  const [bust, setBust] = useState('');
  const [units, setUnits] = useState('inches');
  const [result, setResult] = useState<ConversionResult>(null);
  const [step, setStep] = useState(1); // 1 = clothing type, 2 = brand selection, 3 = measurement input
  const [clothingType, setClothingType] = useState(''); // 'tops', 'dresses', 'bottoms'
  const [measurementType, setMeasurementType] = useState('bust'); // 'bust', 'waist', 'hips'
  
  // When clothing type changes, update measurement type and move to step 2
  useEffect(() => {
    if (clothingType) {
      // Set default measurement based on clothing type
      if (clothingType === 'tops') setMeasurementType('bust');
      else if (clothingType === 'bottoms') setMeasurementType('waist');
      else if (clothingType === 'dresses') setMeasurementType('bust');
      
      setStep(2);
    }
  }, [clothingType]);
  
  // When brand changes, move to step 3
  useEffect(() => {
    if (brand) {
      setStep(3);
    }
  }, [brand]);
  
  // Calculate size whenever inputs change
  useEffect(() => {
    if (brand && bust && !isNaN(parseFloat(bust)) && parseFloat(bust) > 0) {
      calculateSize();
    } else {
      setResult(null);
    }
  }, [brand, bust, units, measurementType, calculateSize]);
  
  const goBack = () => {
    if (step === 3) {
      setBust('');
      setResult(null);
      setStep(2);
    } else if (step === 2) {
      setBrand('');
      setStep(1);
    }
  };
  
  const resetForm = () => {
    setClothingType('');
    setBrand('');
    setBust('');
    setResult(null);
    setStep(1);
  };
  
  return {
    brand,
    setBrand,
    bust,
    setBust,
    units,
    setUnits,
    result,
    setResult,
    step,
    setStep,
    clothingType,
    setClothingType,
    measurementType,
    setMeasurementType,
    goBack,
    resetForm
  };
}
