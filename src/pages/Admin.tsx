
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Plus, Save, Trash } from 'lucide-react';

interface BrandFormData {
  name: string;
  usSizes: { size: string; min: string; max: string }[];
  ukSizes: { size: string; min: string; max: string }[];
  euSizes: { size: string; min: string; max: string }[];
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    usSizes: [{ size: '', min: '', max: '' }],
    ukSizes: [{ size: '', min: '', max: '' }],
    euSizes: [{ size: '', min: '', max: '' }]
  });
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password for demo purposes
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };
  
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };
  
  const handleSizeChange = (
    category: 'usSizes' | 'ukSizes' | 'euSizes',
    index: number,
    field: 'size' | 'min' | 'max',
    value: string
  ) => {
    const newSizes = [...formData[category]];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, [category]: newSizes });
  };
  
  const addSizeRow = (category: 'usSizes' | 'ukSizes' | 'euSizes') => {
    setFormData({
      ...formData,
      [category]: [...formData[category], { size: '', min: '', max: '' }]
    });
  };
  
  const removeSizeRow = (category: 'usSizes' | 'ukSizes' | 'euSizes', index: number) => {
    if (formData[category].length > 1) {
      const newSizes = [...formData[category]];
      newSizes.splice(index, 1);
      setFormData({ ...formData, [category]: newSizes });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    console.log('Saving brand data:', formData);
    alert('Brand saved successfully (demo only)');
    
    // Reset form
    setFormData({
      name: '',
      usSizes: [{ size: '', min: '', max: '' }],
      ukSizes: [{ size: '', min: '', max: '' }],
      euSizes: [{ size: '', min: '', max: '' }]
    });
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
          <h1 className="text-3xl font-display">Brand Management</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </motion.div>
        
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm text-muted-foreground mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleBrandChange}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Brand Name"
                required
              />
            </div>
            
            {/* US Sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">US Sizes</h3>
                <button 
                  type="button"
                  onClick={() => addSizeRow('usSizes')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {formData.usSizes.map((size, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('usSizes', index, 'size', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Size (XS, S, M...)"
                    required
                  />
                  <input
                    type="number"
                    value={size.min}
                    onChange={(e) => handleSizeChange('usSizes', index, 'min', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Min inches"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.max}
                    onChange={(e) => handleSizeChange('usSizes', index, 'max', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Max inches"
                    step="0.1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSizeRow('usSizes', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    disabled={formData.usSizes.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* UK Sizes - Similar structure to US sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">UK Sizes</h3>
                <button 
                  type="button"
                  onClick={() => addSizeRow('ukSizes')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {formData.ukSizes.map((size, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'size', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Size (6, 8, 10...)"
                    required
                  />
                  <input
                    type="number"
                    value={size.min}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'min', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Min inches"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.max}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'max', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Max inches"
                    step="0.1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSizeRow('ukSizes', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    disabled={formData.ukSizes.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* EU Sizes - Similar structure to US sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">EU Sizes</h3>
                <button 
                  type="button"
                  onClick={() => addSizeRow('euSizes')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {formData.euSizes.map((size, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('euSizes', index, 'size', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Size (32, 34, 36...)"
                    required
                  />
                  <input
                    type="number"
                    value={size.min}
                    onChange={(e) => handleSizeChange('euSizes', index, 'min', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Min inches"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.max}
                    onChange={(e) => handleSizeChange('euSizes', index, 'max', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Max inches"
                    step="0.1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSizeRow('euSizes', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    disabled={formData.euSizes.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              type="submit"
              className="flex items-center justify-center w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Brand
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
