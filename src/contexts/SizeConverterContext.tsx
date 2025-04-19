
import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect, useRef } from 'react';
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
  const calculationInProgress = useRef(false);
  const lastCalculationInputs = useRef<{
    brand: string;
    bust: string;
    clothingType: string;
    measurementType: string;
    units: string;
  } | null>(null);
  
  // First create the calculateSize function without using the hook values
  const calculateSizeImpl = useCallback(async (
    currentBrand: string,
    currentBust: string,
    currentClothingType: string,
    currentMeasurementType: string,
    currentUnits: string,
    isOffline: boolean
  ) => {
    // If any required field is empty or bust is not a valid number, reset result
    if (!currentBrand || !currentBust || isNaN(parseFloat(currentBust)) || parseFloat(currentBust) <= 0) {
      setResult(null);
      setLoading(false);
      return;
    }
    
    // Skip calculation if inputs haven't changed since last calculation
    const currentInputs = {
      brand: currentBrand,
      bust: currentBust,
      clothingType: currentClothingType,
      measurementType: currentMeasurementType,
      units: currentUnits
    };
    
    const inputsMatch = lastCalculationInputs.current &&
      lastCalculationInputs.current.brand === currentInputs.brand &&
      lastCalculationInputs.current.bust === currentInputs.bust &&
      lastCalculationInputs.current.clothingType === currentInputs.clothingType &&
      lastCalculationInputs.current.measurementType === currentInputs.measurementType &&
      lastCalculationInputs.current.units === currentInputs.units;
    
    if (inputsMatch) {
      return;
    }
    
    // Prevent multiple calculations running at the same time
    if (calculationInProgress.current) {
      return;
    }
    
    try {
      calculationInProgress.current = true;
      setLoading(true);
      
      // Add a small delay to prevent too rapid recalculations
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const bustValue = parseFloat(currentBust);
      
      // Early check to avoid calculations with invalid values
      if (isNaN(bustValue) || bustValue <= 0) {
        setResult(null);
        setLoading(false);
        return;
      }
      
      // Store current inputs to prevent duplicate calculations
      lastCalculationInputs.current = { ...currentInputs };
      
      const sizingResult = await findSizeByMeasurement(
        currentBrand,
        currentClothingType,
        currentMeasurementType,
        bustValue,
        currentUnits
      );
      
      // Check if we got an empty result
      const isEmpty = !sizingResult || 
        (sizingResult.usSize === '' && sizingResult.ukSize === '' && sizingResult.euSize === '');
      
      setResult(isEmpty ? null : sizingResult);
      
      if (isOffline) {
        console.log("Using estimated sizes (offline mode)");
      }
    } catch (error) {
      console.error('Error calculating size:', error);
      toast({
        title: "Size calculation issue",
        description: "We're having trouble with precise calculations. Showing estimated sizes.",
        variant: "destructive"
      });
      setResult(null);
    } finally {
      setLoading(false);
      calculationInProgress.current = false;
    }
  }, [toast]);
  
  // Use the converter steps hook
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
  } = useConverterSteps();
  
  // Now wire up the calculateSize function that uses the hook values
  const calculateSize = useCallback(() => {
    return calculateSizeImpl(brand, bust, clothingType, measurementType, units, isOfflineMode);
  }, [brand, bust, clothingType, measurementType, units, calculateSizeImpl]);
  
  const handleConnectionChange = useCallback((isOffline: boolean) => {
    if (!isOffline && result && brand && bust) {
      calculateSize();
    }
  }, [result, brand, bust, calculateSize]);
  
  const { isOfflineMode } = useConnectionStatus(handleConnectionChange);
  
  // Update the bust setter to properly handle clearing
  const handleBustChange = (newValue: string) => {
    // Clear previous calculation cache when input changes
    lastCalculationInputs.current = null;
    
    setBust(newValue);
    // Immediately clear results if input is cleared
    if (newValue === '') {
      setResult(null);
      setLoading(false);
    }
  };
  
  // Use a more stable approach to recalculate sizes when inputs change
  useEffect(() => {
    // Don't do anything if there's no brand selected yet
    if (!brand) return;
    
    // Clear the previous timer if it exists
    let debounceTimer: NodeJS.Timeout;
    
    // If bust has a valid value, debounce the calculation
    if (bust && parseFloat(bust) > 0) {
      debounceTimer = setTimeout(() => {
        // Only calculate if we're not already calculating
        if (!calculationInProgress.current) {
          calculateSize();
        }
      }, 800);  // Longer debounce to prevent rapid calculations
    } else {
      // Clear result if bust is empty or invalid
      setResult(null);
      setLoading(false);
    }
    
    // Clean up the timer when inputs change or component unmounts
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [brand, bust, units, measurementType, calculateSize]);
  
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
        setBust: handleBustChange,  // Use our modified bust setter
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
