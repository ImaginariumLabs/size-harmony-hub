
import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, ShoppingBag } from 'lucide-react';
import AdSpace from './converter/AdSpace';

const FeaturedBrands: React.FC = () => {
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
        <h2 className="text-2xl md:text-3xl font-display mb-2">Popular Fashion Brands</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Discover these popular brands with excellent size consistency and customer satisfaction.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeaturedBrandCard 
          icon={<ShoppingBag className="h-5 w-5 text-primary" />} 
          title="Premium Selection" 
          description="Brands known for their quality and consistency in sizing"
        >
          <AdSpace variant="featured" title="FEATURED BRAND" />
        </FeaturedBrandCard>
        
        <FeaturedBrandCard 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          title="Trending Now" 
          description="The most searched brands by our users this month"
        >
          <AdSpace variant="featured" title="TRENDING BRAND" />
        </FeaturedBrandCard>
        
        <FeaturedBrandCard 
          icon={<Star className="h-5 w-5 text-primary" />} 
          title="Best Rated" 
          description="Top-rated brands based on user satisfaction and feedback"
        >
          <AdSpace variant="featured" title="TOP RATED BRAND" />
        </FeaturedBrandCard>
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
