
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, ShoppingBag } from 'lucide-react';
import AdSpace from './converter/AdSpace';

// Mock content data (in a real app, this would come from Supabase)
const mockContent = {
  'featured-title': 'Popular Fashion Brands',
  'featured-description': 'Discover these popular brands with excellent size consistency and customer satisfaction.',
  'premium-title': 'Premium Selection',
  'premium-description': 'Brands known for their quality and consistency in sizing',
  'trending-title': 'Trending Now',
  'trending-description': 'The most searched brands by our users this month',
  'rated-title': 'Best Rated',
  'rated-description': 'Top-rated brands based on user satisfaction and feedback',
};

// Mock section visibility (in a real app, this would come from Supabase)
const mockVisibility = {
  'featured': true,
  'premium': true,
  'trending': true,
  'rated': true
};

const FeaturedBrands: React.FC = () => {
  const [content, setContent] = useState(mockContent);
  const [visibility, setVisibility] = useState(mockVisibility);
  
  useEffect(() => {
    // In a real app, this would be an API call to Supabase
    // to get the current content and section visibility
    
    // For now, we'll use the mock data
    setContent(mockContent);
    setVisibility(mockVisibility);
  }, []);
  
  // If the entire featured section is hidden, don't render anything
  if (!visibility.featured) {
    return null;
  }
  
  return (
    <motion.section
      className="py-12 my-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <motion.div 
          className="inline-flex items-center px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Star className="h-4 w-4 mr-2" />
          Featured Brands
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-display mb-2">{content['featured-title']}</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {content['featured-description']}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibility.premium && (
          <FeaturedBrandCard 
            icon={<ShoppingBag className="h-5 w-5 text-primary" />} 
            title={content['premium-title']} 
            description={content['premium-description']}
          >
            <AdSpace variant="featured" title="FEATURED BRAND" slot="featured-premium" />
          </FeaturedBrandCard>
        )}
        
        {visibility.trending && (
          <FeaturedBrandCard 
            icon={<TrendingUp className="h-5 w-5 text-primary" />} 
            title={content['trending-title']} 
            description={content['trending-description']}
          >
            <AdSpace variant="featured" title="TRENDING BRAND" slot="featured-trending" />
          </FeaturedBrandCard>
        )}
        
        {visibility.rated && (
          <FeaturedBrandCard 
            icon={<Star className="h-5 w-5 text-primary" />} 
            title={content['rated-title']} 
            description={content['rated-description']}
          >
            <AdSpace variant="featured" title="TOP RATED BRAND" slot="featured-rated" />
          </FeaturedBrandCard>
        )}
      </div>
    </motion.section>
  );
};

interface FeaturedBrandCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

const FeaturedBrandCard: React.FC<FeaturedBrandCardProps> = ({ 
  icon, 
  title, 
  description, 
  children 
}) => {
  return (
    <motion.div 
      className="glass-card p-6 flex flex-col items-center"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 bg-accent/50 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 text-center">{description}</p>
      {children}
    </motion.div>
  );
};

export default FeaturedBrands;
