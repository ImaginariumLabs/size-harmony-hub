
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BrandSelector from './BrandSelector';
import MeasurementInput from './MeasurementInput';
import SizeResult from './SizeResult';
import sizeData from '../utils/sizeData';

const SizeConverter: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [bust, setBust] = useState('');
  const [units, setUnits] = useState('inches');
  const [result, setResult] = useState<{ usSize: string; ukSize: string } | null>(null);
  
  const calculateSize = () => {
    if (!brand || !bust || isNaN(parseFloat(bust)) || parseFloat(bust) <= 0) {
      setResult(null);
      return;
    }

    // Convert to inches if needed
    const bustInches = units === 'cm' ? parseFloat(bust) / 2.54 : parseFloat(bust);

    // Find the selected brand
    const selectedBrand = sizeData.brands.find(b => b.name === brand);
    if (!selectedBrand) {
      setResult(null);
      return;
    }

    // Find matching US and UK sizes
    const findMatchingSize = (sizeSystem: 'US' | 'UK') => {
      const matchedSize = selectedBrand.sizes[sizeSystem].find(
        size => bustInches >= size.bust_min_inches && bustInches <= size.bust_max_inches
      );
      return matchedSize ? matchedSize.size : 'No exact match found';
    };

    setResult({
      usSize: findMatchingSize('US'),
      ukSize: findMatchingSize('UK')
    });
  };
  
  // Recalculate when inputs change
  React.useEffect(() => {
    calculateSize();
  }, [brand, bust, units]);
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.div 
          className="inline-block px-4 py-1 bg-primary bg-opacity-10 rounded-full text-primary text-sm font-medium mb-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Find Your Perfect Fit
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight mb-2">Size Harmony</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Convert your measurements across popular brands for a perfect fit, every time.
        </p>
      </motion.div>
      
      <div className="glass-card p-8">
        <BrandSelector 
          selectedBrand={brand} 
          onBrandChange={setBrand} 
        />
        
        <MeasurementInput 
          bustValue={bust}
          onBustChange={setBust}
          units={units}
          onUnitsChange={setUnits}
        />
        
        <SizeResult 
          result={result} 
          brandName={brand} 
        />
      </div>
    </div>
  );
};

export default SizeConverter;
