
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, RefreshCw } from 'lucide-react';
import { fetchBrands, Brand } from '../services/sizing/brandService';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ 
  selectedBrand, 
  onBrandChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setIsLoading(true);
        const brandData = await fetchBrands();
        setBrands(brandData);
      } catch (error) {
        console.error('Failed to load brands:', error);
        toast({
          title: "Error loading brands",
          description: "Could not load brand data. Using fallback data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBrands();
  }, [toast]);
  
  const handleSelect = (brandName: string) => {
    onBrandChange(brandName);
    setIsOpen(false);
  };
  
  const selectedBrandObj = brands.find(b => b.name === selectedBrand);

  if (selectedBrand) {
    return (
      <motion.div 
        className="w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <label className="text-sm text-muted-foreground mb-2 block">Selected Brand</label>
        
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-md font-medium">
            {selectedBrandObj?.name || selectedBrand}
          </div>
          
          <button
            type="button"
            onClick={() => onBrandChange('')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Change
          </button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <label className="text-sm text-muted-foreground mb-2 block">Select Brand</label>
      
      {isLoading ? (
        <div className="w-full p-4 flex items-center justify-center rounded-xl glass-card">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          <span className="text-gray-400">Loading brands...</span>
        </div>
      ) : (
        <>
          {/* Quick selection grid for multiple brands */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {brands.slice(0, isMobile ? 4 : 8).map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleSelect(brand.name)}
                className={`p-3 text-center rounded-lg transition-all ${
                  selectedBrand === brand.name
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'glass-card hover:bg-primary/5'
                }`}
              >
                <span className="block truncate">{brand.name}</span>
              </button>
            ))}
          </div>

          {/* Show more button if there are additional brands */}
          {brands.length > (isMobile ? 4 : 8) && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 flex items-center justify-between rounded-xl glass-card"
              >
                <span className="text-gray-500">More brands...</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isOpen && (
                <motion.div 
                  className="absolute top-full left-0 right-0 mt-2 z-50 max-h-56 overflow-auto rounded-xl glass-card shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {brands.slice(isMobile ? 4 : 8).map((brand: Brand) => (
                    <div
                      key={brand.id}
                      className="p-3 transition-colors duration-200 cursor-pointer flex items-center justify-between hover:bg-gray-50"
                      onClick={() => handleSelect(brand.name)}
                    >
                      <span>{brand.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default BrandSelector;
