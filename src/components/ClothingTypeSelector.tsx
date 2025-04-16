
import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Scissors, ShoppingBag } from 'lucide-react';

interface ClothingTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  visible?: boolean;  // Made optional
}

const ClothingTypeSelector: React.FC<ClothingTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  visible = true  // Default value
}) => {
  if (!visible) return null;
  
  const getSelectedStyles = (type: string) => {
    if (selectedType === type) {
      return 'bg-primary/10 border-2 border-primary shadow-lg ring-2 ring-primary/20';
    }
    return 'glass-card hover:shadow-md hover:bg-accent/5 border border-transparent';
  };
  
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <label className="text-sm text-muted-foreground mb-4 block">What are you shopping for?</label>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 sm:p-6 rounded-xl flex flex-row sm:flex-col items-center sm:justify-center cursor-pointer transition-all ${getSelectedStyles('tops')}`}
          onClick={() => onTypeChange('tops')}
        >
          <Shirt className={`w-8 h-8 sm:w-10 sm:h-10 sm:mb-3 mr-3 sm:mr-0 ${selectedType === 'tops' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`font-medium ${selectedType === 'tops' ? 'text-primary' : 'text-foreground'}`}>Tops</span>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 sm:p-6 rounded-xl flex flex-row sm:flex-col items-center sm:justify-center cursor-pointer transition-all ${getSelectedStyles('bottoms')}`}
          onClick={() => onTypeChange('bottoms')}
        >
          <Scissors className={`w-8 h-8 sm:w-10 sm:h-10 sm:mb-3 mr-3 sm:mr-0 ${selectedType === 'bottoms' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`font-medium ${selectedType === 'bottoms' ? 'text-primary' : 'text-foreground'}`}>Bottoms</span>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 sm:p-6 rounded-xl flex flex-row sm:flex-col items-center sm:justify-center cursor-pointer transition-all ${getSelectedStyles('dresses')}`}
          onClick={() => onTypeChange('dresses')}
        >
          <ShoppingBag className={`w-8 h-8 sm:w-10 sm:h-10 sm:mb-3 mr-3 sm:mr-0 ${selectedType === 'dresses' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`font-medium ${selectedType === 'dresses' ? 'text-primary' : 'text-foreground'}`}>Dresses</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClothingTypeSelector;
