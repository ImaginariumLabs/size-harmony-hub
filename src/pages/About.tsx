
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ruler, Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Size Converter
          </Link>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">About Size Harmony Hub</h1>
          
          <div className="space-y-8">
            <section className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Size Harmony Hub was created to solve one of the most frustrating experiences in online shopping: 
                finding your perfect size across different brands. Our mission is to simplify size selection, 
                reduce returns, and make online shopping more confident and enjoyable for everyone.
              </p>
            </section>
            
            <section className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">The Problem We're Solving</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-primary/5 rounded-lg p-6 flex flex-col items-center text-center">
                  <Ruler className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-medium mb-2">Inconsistent Sizing</h3>
                  <p className="text-sm text-muted-foreground">
                    Brand sizes vary widely, making it difficult to know your size when shopping across different stores.
                  </p>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-6 flex flex-col items-center text-center">
                  <ShoppingBag className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-medium mb-2">High Return Rates</h3>
                  <p className="text-sm text-muted-foreground">
                    Sizing issues are the #1 reason for returns in online fashion retail, creating waste and frustration.
                  </p>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-6 flex flex-col items-center text-center">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-medium mb-2">Shopping Confidence</h3>
                  <p className="text-sm text-muted-foreground">
                    Many shoppers avoid certain brands or online shopping altogether due to sizing uncertainty.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our size converter uses comprehensive measurement data collected from various brands 
                to provide accurate size recommendations based on your actual body measurements.
              </p>
              <ol className="space-y-4 pl-6 list-decimal">
                <li className="text-muted-foreground">
                  <span className="text-foreground font-medium">Input Your Measurements:</span> Enter your 
                  body measurements in either inches or centimeters.
                </li>
                <li className="text-muted-foreground">
                  <span className="text-foreground font-medium">Select a Brand and Clothing Type:</span> Choose 
                  from our database of supported brands and clothing categories.
                </li>
                <li className="text-muted-foreground">
                  <span className="text-foreground font-medium">Get Your Size:</span> Our algorithm calculates 
                  your recommended size in US, UK, and EU standards.
                </li>
                <li className="text-muted-foreground">
                  <span className="text-foreground font-medium">Shop with Confidence:</span> Use your personalized 
                  size recommendation to make more informed shopping decisions.
                </li>
              </ol>
            </section>
            
            <section className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">Our Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                We maintain an extensive database of sizing information from popular clothing brands. 
                Our data is regularly updated and refined based on user feedback to ensure the most 
                accurate recommendations possible. We use a combination of official brand size charts, 
                crowdsourced measurements, and statistical analysis to account for sizing variations.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
