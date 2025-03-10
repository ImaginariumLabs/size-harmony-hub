
import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { findSizeByMeasurement } from '../services/sizing';
import { isSupabaseConnected, getConnectionStatus } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SizeResult as SizingServiceResult } from '../services/sizing';

// Rename the local type to avoid conflict with the imported type
export type SizeResultType = {
  usSize: string;
  ukSize: string;
  euSize: string;
} | null;

interface SizeConverterContextType {
  // State
  step: number;
  clothingType: string;
  brand: string;
  bust: string;
  units: string;
  measurementType: string;
  result: SizeResultType;
  loading: boolean;
  isOfflineMode: boolean;
  
  // Actions
  setClothingType: (type: string) => void;
  setBrand: (brand: string) => void;
  setBust: (value: string) => void;
  setUnits: (units: string) => void;
  setMeasurementType: (type: string) => void;
  goBack: () => void;
  resetForm: () => void;
  calculateSize: () => Promise<void>;
  shareResults: () => void;
}

const SizeConverterContext = createContext<SizeConverterContextType | undefined>(undefined);

export const SizeConverterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // State
  const [step, setStep] = useState(1); // 1 = clothing type, 2 = brand selection, 3 = measurement input
  const [clothingType, setClothingType] = useState('');
  const [brand, setBrand] = useState('');
  const [bust, setBust] = useState('');
  const [units, setUnits] = useState('inches');
  const [measurementType, setMeasurementType] = useState('bust');
  const [result, setResult] = useState<SizeResultType>(null);
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);

  // Check Supabase connection on mount and retry every 10 seconds
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await isSupabaseConnected();
        const wasOffline = isOfflineMode;
        setIsOfflineMode(!connected);
        setConnectionChecked(true);
        
        if (!connected && !wasOffline) {
          console.log("Supabase connection not available, using offline mode");
          toast({
            title: "Offline Mode",
            description: "Using local data since database connection is unavailable. Some features may be limited.",
            variant: "warning",
            duration: 5000
          });
        } else if (connected && wasOffline) {
          // We've reconnected
          console.log("Supabase connection restored");
          toast({
            title: "Online Mode",
            description: "Connected to the database successfully. All features are now available.",
            variant: "default",
            duration: 3000
          });
          
          // Recalculate sizes with online data if we have a result
          if (result && brand && bust) {
            calculateSize();
          }
        }
      } catch (error) {
        console.error("Error checking Supabase connection:", error);
        setIsOfflineMode(true);
      }
    };
    
    // Check immediately
    checkConnection();
    
    // Check again every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    
    return () => clearInterval(interval);
  }, [toast, isOfflineMode, brand, bust, result]);
  
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
  }, [brand, bust, units, measurementType]);
  
  const calculateSize = useCallback(async () => {
    if (!brand || !bust || isNaN(parseFloat(bust)) || parseFloat(bust) <= 0) {
      setResult(null);
      return;
    }
    
    try {
      setLoading(true);
      
      // Call our sizing service to find the size
      const sizingResult = await findSizeByMeasurement(
        brand,
        clothingType,
        measurementType,
        parseFloat(bust),
        units
      );
      
      setResult(sizingResult);
      
      // Show offline mode indicator if we're using fallback calculations
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
    if (!result) return;
    
    const text = `My ${clothingType} size at ${brand} is US: ${result.usSize}, UK: ${result.ukSize}, EU: ${result.euSize} (via Size Harmony Hub)`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Size Results from Size Harmony Hub',
        text: text,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
        navigator.clipboard.writeText(text).then(() => {
          toast({
            title: "Copied to clipboard!",
            description: "Your size info has been copied to share",
          });
        });
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Your size info has been copied to share",
        });
      });
    }
  }, [brand, clothingType, result, toast]);
  
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
