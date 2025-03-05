
import React from 'react';
import { motion } from 'framer-motion';
import sizeData from '../utils/sizeData';
import { Brand } from '../utils/sizeData';

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ 
  selectedBrand, 
  onBrandChange 
}) => {
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <label className="text-sm text-muted-foreground mb-2 block">Select Brand</label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sizeData.brands.map((brand: Brand) => (
          <motion.div
            key={brand.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`
              relative p-4 rounded-xl cursor-pointer transition-all duration-300
              ${selectedBrand === brand.name 
                ? 'bg-primary bg-opacity-5 border border-primary border-opacity-30 shadow-sm' 
                : 'bg-white border border-gray-100 hover:border-gray-200'}
            `}
            onClick={() => onBrandChange(brand.name)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-lg">{brand.name}</span>
              
              {selectedBrand === brand.name && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 rounded-full bg-primary"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BrandSelector;
