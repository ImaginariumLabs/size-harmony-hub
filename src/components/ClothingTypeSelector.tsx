
import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Pants, Dress } from 'lucide-react';

interface ClothingTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  visible: boolean;
}

const ClothingTypeSelector: React.FC<ClothingTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  visible
}) => {
  if (!visible) return null;
  
  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <label className="text-sm text-muted-foreground mb-4 block">What are you shopping for?</label>
      
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedType === 'tops' 
              ? 'bg-primary/10 border-2 border-primary'
              : 'glass-card hover:shadow-md'
          }`}
          onClick={() => onTypeChange('tops')}
        >
          <Shirt className={`w-10 h-10 mb-3 ${selectedType === 'tops' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`font-medium ${selectedType === 'tops' ? 'text-primary' : 'text-foreground'}`}>Tops</span>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedType === 'bottoms' 
              ? 'bg-primary/10 border-2 border-primary'
              : 'glass-card hover:shadow-md'
          }`}
          onClick={() => onTypeChange('bottoms')}
        >
          <Pants className={`w-10 h-10 mb-3 ${selectedType === 'bottoms' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`font-medium ${selectedType === 'bottoms' ? 'text-primary' : 'text-foreground'}`}>Bottoms</span>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedType === 'dresses' 
              ? 'bg-primary/10 border-2 border-primary'
              : 'glass-card hover:shadow-md'
          }`}
          onClick={() => onTypeChange('dresses')}
        >
          <Dress className={`w-10 h-10 mb-3 ${selectedType === 'dresses' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`font-medium ${selectedType === 'dresses' ? 'text-primary' : 'text-foreground'}`}>Dresses</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClothingTypeSelector;
