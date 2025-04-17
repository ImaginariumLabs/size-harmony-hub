
import React from 'react';
import FeaturedBrands from '@/components/FeaturedBrands';

const BrandsSection: React.FC = () => {
  return (
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
  );
};

export default BrandsSection;
