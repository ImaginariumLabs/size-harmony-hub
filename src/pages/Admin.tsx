
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, ArrowLeft, MessageSquare, FileText, Database, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandManagementTab from '../components/admin/BrandManagementTab';
import AdManagementTab from '../components/admin/AdManagementTab';
import ContentManagementTab from '../components/admin/ContentManagementTab';
import FeedbackStatsTab from '../components/admin/FeedbackStatsTab';
import ImportExportTab from '../components/admin/ImportExportTab';
import BlogManagementTab from '../components/admin/BlogManagementTab';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password for demo purposes
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50/80 to-pink-50/80 -z-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <LockKeyhole className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-display">Admin Access</h1>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm text-muted-foreground mb-2">
                Enter Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50/80 to-pink-50/80 -z-10" />
      
      <div className="container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-display">Admin Dashboard</h1>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </motion.div>
        
        <div className="glass-card p-6 mb-6">
          <Tabs defaultValue="brands">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="brands">Brand Management</TabsTrigger>
              <TabsTrigger value="ads">Ad Management</TabsTrigger>
              <TabsTrigger value="content">Content Control</TabsTrigger>
              <TabsTrigger value="blog">
                <div className="flex items-center">
                  <PenTool className="h-4 w-4 mr-2" />
                  Blog
                </div>
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </div>
              </TabsTrigger>
              <TabsTrigger value="import-export">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Import/Export
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="brands">
              <BrandManagementTab />
            </TabsContent>
            
            <TabsContent value="ads">
              <AdManagementTab />
            </TabsContent>
            
            <TabsContent value="content">
              <ContentManagementTab />
            </TabsContent>
            
            <TabsContent value="blog">
              <BlogManagementTab />
            </TabsContent>
            
            <TabsContent value="feedback">
              <FeedbackStatsTab />
            </TabsContent>
            
            <TabsContent value="import-export">
              <ImportExportTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
