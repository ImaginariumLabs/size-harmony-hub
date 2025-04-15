
import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { findSizeByMeasurement } from '../services/sizing';
import { useToast } from '@/hooks/use-toast';
import { SizeConverterContextType, SizeResultType } from './converter/types';
import { useShare } from './converter/useShare';
import { useConnectionStatus } from './converter/useConnectionStatus';

const SizeConverterContext = createContext<SizeConverterContextType | undefined>(undefined);

export const SizeConverterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { shareResults: share } = useShare();
  
  // State
  const [step, setStep] = useState(1);
  const [clothingType, setClothingType] = useState('');
  const [brand, setBrand] = useState('');
  const [bust, setBust] = useState('');
  const [units, setUnits] = useState('inches');
  const [measurementType, setMeasurementType] = useState('bust');
  const [result, setResult] = useState<SizeResultType>(null);
  const [loading, setLoading] = useState(false);
  
  const handleConnectionChange = useCallback((isOffline: boolean) => {
    if (!isOffline && result && brand && bust) {
      calculateSize();
    }
  }, [result, brand, bust]);
  
  const { isOfflineMode } = useConnectionStatus(handleConnectionChange);
  
  // When clothing type changes, update measurement type and move to step 2
  useEffect(() => {
    if (clothingType) {
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
  }, [brand, bust, units, measurementType]);
  
  const calculateSize = useCallback(async () => {
    if (!brand || !bust || isNaN(parseFloat(bust)) || parseFloat(bust) <= 0) {
      setResult(null);
      return;
    }
    
    try {
      setLoading(true);
      const sizingResult = await findSizeByMeasurement(
        brand,
        clothingType,
        measurementType,
        parseFloat(bust),
        units
      );
      setResult(sizingResult);
      
      if (isOfflineMode) {
        console.log("Using estimated sizes (offline mode)");
      }
    } catch (error) {
      console.error('Error calculating size:', error);
      toast({
        title: "Size calculation issue",
        description: "We're having trouble with precise calculations. Showing estimated sizes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [brand, bust, clothingType, measurementType, units, isOfflineMode, toast]);
  
  const goBack = useCallback(() => {
    if (step === 3) {
      setBust('');
      setResult(null);
      setStep(2);
    } else if (step === 2) {
      setBrand('');
      setStep(1);
    }
  }, [step]);
  
  const resetForm = useCallback(() => {
    setClothingType('');
    setBrand('');
    setBust('');
    setResult(null);
    setStep(1);
  }, []);
  
  const shareResults = useCallback(() => {
    share(result, brand, clothingType);
  }, [result, brand, clothingType, share]);
  
  return (
    <SizeConverterContext.Provider
      value={{
        step,
        clothingType,
        brand,
        bust,
        units,
        measurementType,
        result,
        loading,
        isOfflineMode,
        setClothingType,
        setBrand,
        setBust,
        setUnits,
        setMeasurementType,
        goBack,
        resetForm,
        calculateSize,
        shareResults,
      }}
    >
      {children}
    </SizeConverterContext.Provider>
  );
};

export const useSizeConverter = () => {
  const context = useContext(SizeConverterContext);
  if (context === undefined) {
    throw new Error('useSizeConverter must be used within a SizeConverterProvider');
  }
  return context;
};
