
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitFeedback, fetchBrands } from '../services/sizingService';

interface SizeResultProps {
  result: {
    usSize: string;
    ukSize: string;
    euSize: string;
  } | null;
  brandName: string;
  clothingType?: string;
  measurementType?: string;
  measurementValue?: string;
  measurementUnit?: string;
  isOfflineMode?: boolean;
  onShare: () => void;
}

const SizeResult: React.FC<SizeResultProps> = ({ 
  result, 
  brandName, 
  clothingType = '',
  measurementType = '',
  measurementValue = '',
  measurementUnit = 'inches',
  isOfflineMode = false,
  onShare 
}) => {
  const { toast } = useToast();
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [brandId, setBrandId] = useState<string | null>(null);
  
  // Fetch brand ID when brandName changes
  useEffect(() => {
    const getBrandId = async () => {
      if (!brandName) return;
      
      try {
        const brands = await fetchBrands();
        const brand = brands.find(b => b.name === brandName);
        if (brand) {
          setBrandId(brand.id);
        }
      } catch (error) {
        console.error("Error fetching brand ID:", error);
      }
    };
    
    getBrandId();
  }, [brandName]);

  if (!result) return null;

  // Helper to determine if a size is a match or not
  const isSizeMatch = (size: string) => !size.includes('No exact match') && !size.includes('Not available');
  
  // Get clothing type display name
  const getClothingTypeDisplay = () => {
    switch(clothingType) {
      case 'tops': return 'Top';
      case 'bottoms': return 'Bottom';
      case 'dresses': return 'Dress';
      default: return '';
    }
  };

  const handleFeedback = async (isAccurate: boolean) => {
    try {
      setSubmittingFeedback(true);
      
      // If we couldn't get the brand ID, show an error
      if (!brandId && !isOfflineMode) {
        toast({
          title: "Cannot submit feedback",
          description: "Could not identify the brand. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      // In offline mode, we'll use a placeholder brand ID
      const feedbackBrandId = brandId || "offline-mode-brand-id";
      
      await submitFeedback({
        brand_id: feedbackBrandId,
        garment_type: clothingType,
        measurement_value: parseFloat(measurementValue) || 0,
        measurement_type: measurementType,
        measurement_unit: measurementUnit,
        size_us: result.usSize,
        size_uk: result.ukSize,
        size_eu: result.euSize,
        is_accurate: isAccurate
      });
      
      setFeedbackSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our size recommendations.",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Feedback submission failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="w-full mt-6"
      >
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Your {getClothingTypeDisplay()} Size at {brandName}
              {measurementType && <span className="text-sm text-muted-foreground ml-2">({measurementType})</span>}
            </h3>
            <button 
              onClick={onShare}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share results"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-xl p-4 border shadow-sm ${
                  isSizeMatch(result.usSize) 
                    ? 'bg-white border-gray-100' 
                    : 'bg-yellow-50 border-yellow-100'
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">US Size</div>
                <div className="text-3xl font-display">{result.usSize}</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-xl p-4 border shadow-sm ${
                  isSizeMatch(result.ukSize) 
                    ? 'bg-white border-gray-100' 
                    : 'bg-yellow-50 border-yellow-100'
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">UK Size</div>
                <div className="text-3xl font-display">{result.ukSize}</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-xl p-4 border shadow-sm ${
                  isSizeMatch(result.euSize) 
                    ? 'bg-white border-gray-100' 
                    : 'bg-yellow-50 border-yellow-100'
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">EU Size</div>
                <div className="text-3xl font-display">{result.euSize}</div>
              </motion.div>
            </div>
            
            {!feedbackSubmitted ? (
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-muted-foreground mb-4">Is this size recommendation accurate?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={submittingFeedback}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    This size is correct
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={submittingFeedback}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    This size is incorrect
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center text-green-600 font-medium"
              >
                Thank you for your feedback!
              </motion.div>
            )}
            
            <motion.p 
              className="mt-6 text-sm text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sizes are approximate and may vary based on the specific garment and fit.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SizeResult;
