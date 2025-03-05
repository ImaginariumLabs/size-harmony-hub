
import React from 'react';
import { motion } from 'framer-motion';
import sizeData from '../utils/sizeData';
import { Brand } from '../utils/sizeData';
import { Check, ChevronDown } from 'lucide-react';

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ 
  selectedBrand, 
  onBrandChange 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSelect = (brandName: string) => {
    onBrandChange(brandName);
    setIsOpen(false);
  };
  
  const selectedBrandObj = sizeData.brands.find(b => b.name === selectedBrand);
  
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
        >
          <span className={`text-lg ${!selectedBrand ? 'text-gray-400' : 'text-foreground font-medium'}`}>
            {selectedBrandObj ? selectedBrandObj.name : 'Choose a brand'}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2 z-10 max-h-56 overflow-auto rounded-xl glass-card shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {sizeData.brands.map((brand: Brand) => (
              <div
                key={brand.name}
                className={`p-4 transition-colors duration-200 cursor-pointer flex items-center justify-between
                  ${selectedBrand === brand.name ? 'bg-primary/10' : 'hover:bg-gray-50'}`}
                onClick={() => handleSelect(brand.name)}
              >
                <span className="font-medium">{brand.name}</span>
                {selectedBrand === brand.name && <Check className="w-4 h-4 text-primary" />}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BrandSelector;
