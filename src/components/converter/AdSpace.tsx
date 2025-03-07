
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  variant?: 'sidebar' | 'banner' | 'featured';
  title?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  variant = 'sidebar',
  title = 'ADVERTISEMENT'
}) => {
  const getAdDimensions = () => {
    switch(variant) {
      case 'banner':
        return { height: 'h-[90px]', width: 'w-full', label: '728x90' };
      case 'featured':
        return { height: 'h-[250px]', width: 'w-full md:w-[300px]', label: 'Featured Brand' };
      case 'sidebar':
      default:
        return { height: 'h-[250px]', width: 'w-full', label: '300x250' };
    }
  };

  const dimensions = getAdDimensions();

  return (
    <motion.div 
      className={`mt-8 pt-4 ${variant === 'featured' ? 'border-t-0' : 'border-t border-gray-100'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <motion.div 
        className={`${dimensions.height} ${dimensions.width} bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center justify-center overflow-hidden group`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p className="text-sm text-gray-400 mb-2">Ad Space ({dimensions.label})</p>
        <button className="text-xs text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Learn More</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AdSpace;
