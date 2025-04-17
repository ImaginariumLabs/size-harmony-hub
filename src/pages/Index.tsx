
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WelcomePopup from '@/components/WelcomePopup';
import { Helmet } from 'react-helmet-async';
import BackgroundEffects from '@/components/home/BackgroundEffects';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import BlogTeaserSection from '@/components/home/BlogTeaserSection';
import BrandsSection from '@/components/home/BrandsSection';

const Index = () => {
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
      <BackgroundEffects />
      
      <Navbar />
      
      {/* Welcome Popup */}
      <WelcomePopup />
      
      <main className="flex-grow">
        {/* Hero Section with Size Converter */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />
        
        {/* Blog Teaser Section */}
        <BlogTeaserSection />
        
        {/* Featured Brands Section */}
        <BrandsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
