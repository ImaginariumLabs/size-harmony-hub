
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ruler, Tape, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Guide = () => {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Measurement Guide</h1>
          
          <div className="space-y-8">
            <section className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">How to Take Your Measurements</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Taking accurate measurements is essential for getting the right size recommendations. 
                Follow these guidelines for the best results.
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium text-lg mb-2 flex items-center">
                    <Tape className="h-5 w-5 mr-2 text-primary" />
                    What You'll Need
                  </h3>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    <li>A soft measuring tape (fabric tape measure)</li>
                    <li>A mirror or a friend to help</li>
                    <li>Fitted clothing or just underwear for the most accurate measurements</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium text-lg mb-2 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    General Tips
                  </h3>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    <li>Stand naturally with arms relaxed at your sides</li>
                    <li>Keep the measuring tape snug but not tight against your body</li>
                    <li>Make sure the tape is level (parallel to the floor)</li>
                    <li>Measure directly against your body, not over bulky clothing</li>
                    <li>When in doubt, take each measurement twice to confirm</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">Measuring Specific Body Areas</h2>
              
              <div className="space-y-8">
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-3">Bust/Chest Measurement</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                        <li>Stand upright with your arms relaxed at your sides</li>
                        <li>Wrap the measuring tape around the fullest part of your bust/chest</li>
                        <li>Make sure the tape is parallel to the floor</li>
                        <li>The tape should be snug but not constricting</li>
                        <li>Breathe normally during measurement</li>
                      </ol>
                      <p className="mt-4 text-sm flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>For those with breasts, wear a non-padded bra for the most accurate measurement</span>
                      </p>
                    </div>
                    <div className="md:w-1/3 flex justify-center items-center">
                      <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                        <Ruler className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-3">Waist Measurement</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                        <li>Find your natural waistline (the narrowest part of your torso)</li>
                        <li>This is typically above your belly button and below your rib cage</li>
                        <li>Wrap the measuring tape around your natural waist</li>
                        <li>Keep the tape parallel to the floor</li>
                        <li>Measure after exhaling normally, without sucking in</li>
                      </ol>
                      <p className="mt-4 text-sm flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>If you're measuring for pants or skirts with a low rise, measure where the waistband would sit</span>
                      </p>
                    </div>
                    <div className="md:w-1/3 flex justify-center items-center">
                      <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                        <Ruler className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-3">Hip Measurement</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                        <li>Stand with your feet together</li>
                        <li>Measure around the fullest part of your hips and buttocks</li>
                        <li>This is approximately 7-9 inches (18-23 cm) below your natural waist</li>
                        <li>Keep the tape parallel to the floor all the way around</li>
                        <li>The tape should be snug but not dig into your skin</li>
                      </ol>
                    </div>
                    <div className="md:w-1/3 flex justify-center items-center">
                      <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                        <Ruler className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">Using Your Measurements</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Once you have your measurements, you're ready to use our Size Converter tool:
              </p>
              
              <ol className="list-decimal pl-5 text-muted-foreground space-y-4">
                <li>
                  <span className="text-foreground font-medium">Select a clothing type</span> (tops, bottoms, dresses, etc.) that 
                  you want to find the size for
                </li>
                <li>
                  <span className="text-foreground font-medium">Choose the brand</span> you're interested in from our dropdown menu
                </li>
                <li>
                  <span className="text-foreground font-medium">Select the measurement type</span> (bust, waist, or hip) most 
                  relevant to the clothing item
                </li>
                <li>
                  <span className="text-foreground font-medium">Enter your measurement</span> in either inches or centimeters
                </li>
                <li>
                  <span className="text-foreground font-medium">Get your personalized size recommendation</span> in US, UK, and EU sizing
                </li>
              </ol>
              
              <div className="mt-8 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-amber-600" />
                  Pro Tips
                </h3>
                <ul className="list-disc pl-5 text-amber-700 space-y-2">
                  <li>Different clothing types may require different measurements. For tops, bust is most important, while bottoms typically use waist and hip measurements.</li>
                  <li>If you fall between sizes, consider the fit you prefer (loose vs. fitted) and the fabric's stretch when making your choice.</li>
                  <li>Remember that our recommendations are a starting point. Individual preferences for fit may vary.</li>
                </ul>
              </div>
            </section>
          </div>
          
          <div className="my-10 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try the Size Converter Now
            </Link>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Guide;
