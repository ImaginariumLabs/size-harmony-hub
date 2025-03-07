
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Ad {
  id: string;
  name: string;
  slot: string;
  link: string;
  imageUrl: string; // In a real app, this would be a URL to the image
  active: boolean;
}

// Mock ads data (in a real app, this would come from Supabase)
const mockAds: Ad[] = [
  {
    id: '1',
    name: 'Premium Brand Feature',
    slot: 'featured-premium',
    link: 'https://example.com/premium',
    imageUrl: 'https://via.placeholder.com/300x250?text=Premium+Brand',
    active: true
  },
  {
    id: '2',
    name: 'Trending Brand Feature',
    slot: 'featured-trending',
    link: 'https://example.com/trending',
    imageUrl: 'https://via.placeholder.com/300x250?text=Trending+Brand',
    active: true
  },
  {
    id: '3',
    name: 'Top Rated Brand Feature',
    slot: 'featured-rated',
    link: 'https://example.com/top-rated',
    imageUrl: 'https://via.placeholder.com/300x250?text=Top+Rated+Brand',
    active: true
  },
  {
    id: '4',
    name: 'Banner Ad',
    slot: 'banner',
    link: 'https://example.com/banner',
    imageUrl: 'https://via.placeholder.com/728x90?text=Banner+Ad',
    active: true
  },
  {
    id: '5',
    name: 'Sidebar Ad',
    slot: 'sidebar',
    link: 'https://example.com/sidebar',
    imageUrl: 'https://via.placeholder.com/300x250?text=Sidebar+Ad',
    active: true
  }
];

interface AdSpaceProps {
  variant?: 'sidebar' | 'banner' | 'featured';
  title?: string;
  slot?: string; // e.g., 'featured-premium', 'featured-trending', etc.
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  variant = 'sidebar',
  title = 'ADVERTISEMENT',
  slot
}) => {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to Supabase
    // to get an ad for the specified slot
    
    // Figure out which slot to use
    let adSlot = slot;
    if (!adSlot) {
      // If no slot is specified, use the default based on variant
      switch(variant) {
        case 'featured':
          adSlot = 'featured-premium'; // Default for featured
          break;
        case 'banner':
          adSlot = 'banner';
          break;
        case 'sidebar':
        default:
          adSlot = 'sidebar';
          break;
      }
    }
    
    // Find an active ad for the slot
    const matchingAd = mockAds.find(a => a.slot === adSlot && a.active);
    setAd(matchingAd || null);
  }, [variant, slot]);

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

  if (!ad) {
    // No active ad found for this slot, show placeholder
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
          <p className="text-sm text-gray-400 mb-2">Ad Space ({dimensions.label})</p>
          <p className="text-xs text-gray-300">No active ad for this slot</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`mt-8 pt-4 ${variant === 'featured' ? 'border-t-0' : 'border-t border-gray-100'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <motion.a 
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${dimensions.height} ${dimensions.width} rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center justify-center overflow-hidden group relative`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <img 
          src={ad.imageUrl} 
          alt={ad.name}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-3 w-3 text-primary" />
        </div>
      </motion.a>
    </motion.div>
  );
};

export default AdSpace;
