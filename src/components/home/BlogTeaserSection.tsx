
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BlogTeaserSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-20 container mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold mb-3">Size & Fashion Insights</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the latest trends, sizing tips, and fashion advice on our blog
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard 
          title="Understanding Size Differences" 
          description="Learn why sizes vary between brands and regions, and how to find your perfect fit every time."
          category="Fashion Sizing Guide"
          gradientClass="from-purple-100 to-pink-100" 
        />
        
        <BlogCard 
          title="Online Shopping Strategies" 
          description="Our expert guide to buying clothes online with confidence and avoiding return hassles."
          category="Shopping Tips"
          gradientClass="from-blue-100 to-teal-100" 
        />
        
        <BlogCard 
          title="Brand Size Comparisons" 
          description="Compare sizing across popular clothing brands and discover which ones run large or small."
          category="Brand Insights"
          gradientClass="from-amber-100 to-orange-100" 
        />
      </div>
      
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline">
          <Link to="/blog" className="flex items-center gap-2">
            Visit Our Blog <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

interface BlogCardProps {
  title: string;
  description: string;
  category: string;
  gradientClass: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, description, category, gradientClass }) => (
  <Link to="/blog" className="glass-card overflow-hidden group">
    <div className={`h-48 bg-gradient-to-r ${gradientClass} flex items-center justify-center`}>
      <span className="text-lg font-medium text-primary">{category}</span>
    </div>
    <div className="p-5">
      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex items-center text-primary font-medium text-sm">
        Read more <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

export default BlogTeaserSection;
