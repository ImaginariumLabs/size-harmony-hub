
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import AdManager from '../ads/AdManager';

interface AdSpaceProps {
  variant?: 'sidebar' | 'banner' | 'featured';
  title?: string;
  slot?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  variant = 'sidebar',
  title = 'ADVERTISEMENT',
  slot
}) => {
  // Map variant to ad format
  const getAdFormat = () => {
    switch(variant) {
      case 'banner':
        return 'horizontal';
      case 'featured':
        return 'rectangle';
      case 'sidebar':
      default:
        return 'rectangle';
    }
  };

  // Get ad slot ID based on variant
  const getAdSlotId = () => {
    const slotPrefix = 'size-harmony-';
    
    if (slot) return slot;
    
    switch(variant) {
      case 'banner':
        return `${slotPrefix}banner`;
      case 'featured':
        return `${slotPrefix}featured`;
      case 'sidebar':
      default:
        return `${slotPrefix}sidebar`;
    }
  };

  return (
    <motion.div 
      className={`mt-8 pt-4 ${variant === 'featured' ? 'border-t-0' : 'border-t border-gray-100'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <AdManager 
        adSlot={getAdSlotId()} 
        format={getAdFormat() as 'auto' | 'rectangle' | 'horizontal' | 'vertical'} 
        className="w-full"
      />
    </motion.div>
  );
};

export default AdSpace;
