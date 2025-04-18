
import React from 'react';
import { motion } from 'framer-motion';
import { useSizeConverter } from '@/contexts/SizeConverterContext';
import StepContent from './StepContent';
import ClothingTypeSelector from '../ClothingTypeSelector';
import BrandSelector from '../BrandSelector';
import BackButton from './BackButton';
import ResetButton from './ResetButton';
import ProgressIndicator from './ProgressIndicator';
import SizeResult from '../SizeResult';
import LoadingIndicator from './LoadingIndicator';
import OfflineModeIndicator from './OfflineModeIndicator';
import AdSpace from './AdSpace';
import MeasurementForm from './MeasurementForm';
import SizeComparison from '../SizeComparison';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveToHistory } from '@/services/sizing/historyService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SizeConverterContent: React.FC = () => {
  
  const {
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
    shareResults
  } = useSizeConverter();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveHistoryAndGetResult = async () => {
    if (!user || !result || !brand || !bust) return;
    
    try {
      await saveToHistory(
        user.id,
        brand,
        clothingType,
        measurementType,
        parseFloat(bust),
        units,
        result
      );
      
      toast({
        title: "Size conversion saved",
        description: "This conversion has been added to your history.",
      });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  return (
    <div className="relative">
      {isOfflineMode && <OfflineModeIndicator />}
      
      <div className="flex items-center justify-between mb-8">
        <BackButton visible={step > 1} onClick={goBack} />
        <ProgressIndicator currentStep={step} totalSteps={3} />
        <ResetButton visible={step > 1} onClick={resetForm} />
      </div>
      
      <StepContent visible={step === 1}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-medium mb-6">Select Clothing Type</h2>
          <ClothingTypeSelector
            selectedType={clothingType}
            onTypeChange={setClothingType}
            visible={true}
          />
        </motion.div>
      </StepContent>
      
      
      <StepContent visible={step === 2}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-medium mb-6">Select Brand</h2>
          <BrandSelector 
            selectedBrand={brand} 
            onBrandChange={setBrand} 
          />
        </motion.div>
      </StepContent>
      
      <StepContent visible={step === 3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-xl font-medium mb-6">Enter Your Measurements</h2>
            <MeasurementForm 
              measurementType={measurementType}
              measurementValue={bust}
              measurementUnit={units}
              onMeasurementTypeChange={setMeasurementType}
              onMeasurementValueChange={setBust}
              onMeasurementUnitChange={setUnits}
              clothingType={clothingType}
            />
          </div>
          
          {loading && <LoadingIndicator />}
          
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SizeResult
                result={result}
                brand={brand}
                clothingType={clothingType}
                bust={bust}
                measurementType={measurementType}
                units={units}
                isLoggedIn={!!user}
                showLoginPrompt={() => navigate('/auth')}
              />
              
              <div className="mt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SizeComparison />
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </StepContent>
      
      <div className="mt-8">
        <AdSpace />
      </div>
    </div>
  );
};

export default SizeConverterContent;
