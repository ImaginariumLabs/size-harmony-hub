
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Tag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AdSpace: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Later this could pull from an ad management system
  const adContent = {
    title: "Save 20% at H&M",
    description: "Use code SIZE20 at checkout",
    link: "https://www.hm.com",
    sponsored: true
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-6 relative rounded-lg overflow-hidden border border-gray-200"
    >
      <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 p-4 ${isMobile ? '' : 'flex items-center justify-between'}`}>
        <div className={isMobile ? 'mb-4' : ''}>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Tag className="h-3 w-3" />
            <span>{adContent.sponsored ? 'Sponsored' : 'Related Offer'}</span>
          </div>
          
          <h4 className="font-medium text-primary">{adContent.title}</h4>
          <p className="text-sm text-muted-foreground">{adContent.description}</p>
        </div>
        
        <a 
          href={adContent.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/70 transition-colors"
        >
          Shop Now <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
};

export default AdSpace;
