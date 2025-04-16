
import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { findSizeByMeasurement } from '../services/sizing';
import { useToast } from '@/hooks/use-toast';
import { SizeConverterContextType, SizeResultType } from './converter/types';
import { useShare } from './converter/useShare';
import { useConnectionStatus } from './converter/useConnectionStatus';
import { useConverterSteps } from '@/hooks/useConverterSteps';

const SizeConverterContext = createContext<SizeConverterContextType | undefined>(undefined);

export const SizeConverterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { shareResults: share } = useShare();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SizeResultType>(null);
  
  // Use the converter steps hook for managing form state and steps
  const {
    brand,
    setBrand,
    bust,
    setBust,
    units,
    setUnits,
    step,
    clothingType,
    setClothingType,
    measurementType,
    setMeasurementType,
    goBack,
    resetForm
  } = useConverterSteps({
    calculateSize: () => {}  // Will be properly set in useEffect below
  });
  
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
  }, [brand, bust, clothingType, measurementType, units, toast]);
  
  // Update the calculateSize reference in useConverterSteps
  useEffect(() => {
    useConverterSteps({ calculateSize });
  }, [calculateSize]);
  
  const handleConnectionChange = useCallback((isOffline: boolean) => {
    if (!isOffline && result && brand && bust) {
      calculateSize();
    }
  }, [result, brand, bust, calculateSize]);
  
  const { isOfflineMode } = useConnectionStatus(handleConnectionChange);
  
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
