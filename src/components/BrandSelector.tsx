
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, RefreshCw } from 'lucide-react';
import { fetchBrands, Brand } from '../services/sizing/brandService';
import { useToast } from '@/hooks/use-toast';

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
  
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <label className="text-sm text-muted-foreground mb-2 block">Select Brand</label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between rounded-xl glass-card"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center text-gray-400">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              <span>Loading brands...</span>
            </div>
          ) : (
            <span className={`text-lg ${!selectedBrand ? 'text-gray-400' : 'text-foreground font-medium'}`}>
              {selectedBrandObj ? selectedBrandObj.name : 'Choose a brand'}
            </span>
          )}
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && !isLoading && (
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2 z-50 max-h-56 overflow-auto rounded-xl glass-card shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {brands.length > 0 ? (
              brands.map((brand: Brand) => (
                <div
                  key={brand.id}
                  className={`p-4 transition-colors duration-200 cursor-pointer flex items-center justify-between
                    ${selectedBrand === brand.name ? 'bg-primary/10' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelect(brand.name)}
                >
                  <span className="font-medium">{brand.name}</span>
                  {selectedBrand === brand.name && <Check className="w-4 h-4 text-primary" />}
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-center">
                No brands available. Please check the database.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BrandSelector;
