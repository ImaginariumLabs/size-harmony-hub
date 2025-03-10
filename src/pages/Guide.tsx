import React from 'react';
import { motion } from 'framer-motion';
import { Book, Ruler, Search, ShoppingBag, MessageSquare } from 'lucide-react';
import UserGuide from '../components/UserGuide';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Guide = () => {
  const features = [
    {
      icon: <Ruler className="h-8 w-8 text-primary" />,
      title: "Accurate Measurements",
      description: "Learn how to take precise body measurements to ensure the best size matching results."
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Brand Comparisons",
      description: "Understand how brands differ in their sizing approaches and why conversions matter."
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      title: "Shop Confidently",
      description: "Reduce returns and shop with confidence by knowing your exact size in different brands."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Community Insights",
      description: "Discover how our community-sourced data improves accuracy for better fitting clothes."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-8">
        <section className="bg-gradient-to-b from-white to-purple-50 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Book className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Size Conversion Guide</h1>
              <p className="text-lg text-gray-600 mb-8">
                Learn how to get the most accurate size recommendations and understand your measurements across different brands.
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="max-w-4xl mx-auto">
              <UserGuide />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Guide;
