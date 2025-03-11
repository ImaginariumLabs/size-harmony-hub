
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SizeConverter from '@/components/SizeConverter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedBrands from '@/components/FeaturedBrands';
import { motion } from 'framer-motion';
import { Ruler, Check, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-40"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
      </div>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="md:w-1/2 text-center md:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                    Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Perfect Size</span> in Any Brand
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                    Shop with confidence using our size converter that translates your measurements across different brands and regions.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <Button size="lg" asChild>
                      <a href="#converter" className="group">
                        <Ruler className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                        Convert My Size
                      </a>
                    </Button>
                    
                    {user ? (
                      <Button variant="outline" size="lg" onClick={signOut}>
                        <UserCircle className="mr-2 h-5 w-5" />
                        Sign Out
                      </Button>
                    ) : (
                      <Button variant="outline" size="lg" asChild>
                        <Link to="/auth">
                          <UserCircle className="mr-2 h-5 w-5" />
                          Sign In / Register
                        </Link>
                      </Button>
                    )}
                  </div>
                </motion.div>
              </div>
              
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <img 
                    src="/fashion-background.jpg" 
                    alt="Fashion size guide" 
                    className="rounded-xl object-cover w-full h-80 md:h-96"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Why Use Size Harmony Hub?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform offers accurate size conversions based on real measurements, not just generic size charts.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="glass-card p-6"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Brands */}
        <section className="py-16 px-4">
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
        
        {/* Converter Section */}
        <section id="converter" className="py-16 px-4 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Size Converter</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Convert your size across different brands and regions with just a few clicks.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <SizeConverter />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
