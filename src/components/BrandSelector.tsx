
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchBrands, Brand } from '../services/sizing';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
  selectedBrand,
  onBrandChange
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const fetchedBrands = await fetchBrands();
        setBrands(fetchedBrands);
        setFilteredBrands(fetchedBrands);
        setLoading(false);
      } catch (error) {
        console.error('Error loading brands:', error);
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  useEffect(() => {
    // Filter brands based on search query
    if (searchQuery.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchQuery, brands]);

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
      
      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search for a brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/80 backdrop-blur-sm"
        />
      </div>
      
      <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4`}>
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-muted-foreground">
            No brands found matching "{searchQuery}". Try a different search term.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BrandSelector;
