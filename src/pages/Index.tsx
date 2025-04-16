
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SizeConverter from '@/components/SizeConverter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedBrands from '@/components/FeaturedBrands';
import WelcomePopup from '@/components/WelcomePopup';
import { motion } from 'framer-motion';
import { Ruler, Check, UserCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { user, signOut } = useAuth();
  
  const features = [
    {
      title: "Accurate Conversions",
      description: "Our data-driven size converter uses real measurements to match your size across brands."
    },
    {
      title: "Save Your Sizes",
      description: "Create an account to save your measurements and quickly convert sizes for future shopping."
    },
    {
      title: "Brand Database",
      description: "We maintain size charts for hundreds of popular brands, updated regularly for accuracy."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Size Harmony | Find Your Perfect Size Across Brands</title>
        <meta name="description" content="Convert clothing sizes between brands with our accurate size converter. Find your perfect fit every time with measurements that match your body." />
        <meta name="keywords" content="size converter, clothing size, size calculator, measurement converter, fashion sizes, brand sizes, US size, UK size, EU size" />
        <link rel="canonical" href="https://sizeharmony.com/" />
        
        {/* Structured data for rich results */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Size Harmony",
            "description": "Convert clothing sizes between brands with our accurate size converter.",
            "url": "https://sizeharmony.com",
            "applicationCategory": "UtilityApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-40"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
      </div>
      
      <Navbar />
      
      {/* Welcome Popup */}
      <WelcomePopup />
      
      <main className="flex-grow">
        {/* Hero Section with Size Converter */}
        <section className="pt-20 md:pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
                  Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Perfect Size</span> in Any Brand
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
                  Shop with confidence using our size converter that translates your measurements across different brands and regions.
                </p>
              </motion.div>
              
              {/* Size Converter - Now more prominent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 mb-16"
              >
                <SizeConverter />
              </motion.div>
            </div>

            {/* Features Section - Now below converter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  className="glass-card p-6"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Blog Teaser Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-20"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold mb-3">Size & Fashion Insights</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover the latest trends, sizing tips, and fashion advice on our blog
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/blog" className="glass-card overflow-hidden group">
                  <div className="h-48 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">Fashion Sizing Guide</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Understanding Size Differences</h3>
                    <p className="text-sm text-gray-600 mb-3">Learn why sizes vary between brands and regions, and how to find your perfect fit every time.</p>
                    <div className="flex items-center text-primary font-medium text-sm">
                      Read more <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link to="/blog" className="glass-card overflow-hidden group">
                  <div className="h-48 bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">Shopping Tips</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Online Shopping Strategies</h3>
                    <p className="text-sm text-gray-600 mb-3">Our expert guide to buying clothes online with confidence and avoiding return hassles.</p>
                    <div className="flex items-center text-primary font-medium text-sm">
                      Read more <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link to="/blog" className="glass-card overflow-hidden group">
                  <div className="h-48 bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">Brand Insights</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Brand Size Comparisons</h3>
                    <p className="text-sm text-gray-600 mb-3">Compare sizing across popular clothing brands and discover which ones run large or small.</p>
                    <div className="flex items-center text-primary font-medium text-sm">
                      Read more <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button asChild variant="outline">
                  <Link to="/blog" className="flex items-center gap-2">
                    Visit Our Blog <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Featured Brands Section */}
        <section className="py-16 px-4 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Brands We Support</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our size converter works with hundreds of fashion brands worldwide.
              </p>
            </div>
            
            <FeaturedBrands />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
