
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
    
    try {
      setLoading(true);
      // Add a small delay to prevent too rapid recalculations
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const sizingResult = await findSizeByMeasurement(
        currentBrand,
        currentClothingType,
        currentMeasurementType,
        parseFloat(currentBust),
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
    setBust(newValue);
    // Immediately clear results if input is cleared
    if (newValue === '') {
      setResult(null);
      setLoading(false);
    }
  };
  
  // Recalculate size when inputs change
  useEffect(() => {
    if (brand) {
      // Only calculate if bust has a valid value
      if (bust && parseFloat(bust) > 0) {
        // Cancel any pending calculation if bust changes quickly
        const timer = setTimeout(() => {
          calculateSize();
        }, 500);
        
        return () => clearTimeout(timer);
      } else {
        // Clear result if bust is empty or invalid
        setResult(null);
        setLoading(false);
      }
    }
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
