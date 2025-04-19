
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReverseSizeLookup from '@/components/ReverseSizeLookup';
import { ArrowLeftRight, Ruler } from 'lucide-react';

const ReverseLookup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Reverse Size Lookup | Size Harmony</title>
        <meta name="description" content="Enter the size you see in a store and get measurements and equivalent sizes in different regions." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Ruler className="h-6 w-6" />
              <span>Reverse Size Lookup</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shopping in store? Enter the size you see on the tag to get equivalent sizes and 
              approximate measurements. Perfect for when you're in a fitting room and need quick information.
            </p>
          </div>
          
          <ReverseSizeLookup />
          
          <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              How to Use This Tool
            </h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select the gender category (Women's or Men's clothing)</li>
              <li>Choose the garment type (tops, bottoms, or dresses)</li>
              <li>Select the region of the size you have (EU, US, or UK)</li>
              <li>Enter the size number you see on the tag</li>
              <li>Click "Find Measurements" to see equivalent sizes and approximate measurements</li>
            </ol>
            <p className="mt-4 text-sm text-gray-500 italic">
              Note: These measurements are approximate and may vary by brand. For exact sizing, 
              use our main Size Converter tool with specific brand selection.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReverseLookup;
