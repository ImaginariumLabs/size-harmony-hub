
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchBrands, Brand } from '../services/sizing';
import { useIsMobile } from '@/hooks/use-mobile';

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
  selectedBrand,
  onBrandChange
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const fetchedBrands = await fetchBrands();
        setBrands(fetchedBrands);
        setLoading(false);
      } catch (error) {
        console.error('Error loading brands:', error);
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const getBrandStyles = (brandName: string) => {
    if (selectedBrand === brandName) {
      return 'bg-primary/10 border-2 border-primary shadow-lg ring-2 ring-primary/20';
    }
    return 'glass-card hover:shadow-md hover:bg-accent/5 border border-transparent';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <label className="text-sm text-muted-foreground mb-4 block">
        Choose a brand for size reference
      </label>
      
      <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4`}>
        {brands.map((brand) => (
          <motion.div
            key={brand.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${getBrandStyles(brand.name)}`}
            onClick={() => onBrandChange(brand.name)}
          >
            <span className={`font-medium text-sm sm:text-base ${selectedBrand === brand.name ? 'text-primary' : 'text-foreground'}`}>
              {brand.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BrandSelector;
