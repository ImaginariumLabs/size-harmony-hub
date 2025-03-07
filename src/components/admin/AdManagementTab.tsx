
import React, { useState } from 'react';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdData } from './ad-management/types';
import AdForm from './ad-management/AdForm';
import AdsList from './ad-management/AdsList';

const AdManagementTab: React.FC = () => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [currentAd, setCurrentAd] = useState<AdData>({
    name: '',
    slot: '',
    link: '',
    image: null,
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentAd({
      ...currentAd,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentAd({
      ...currentAd,
      [name]: checked
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload an image file (JPEG, PNG, GIF, SVG)");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setCurrentAd({ ...currentAd, image: file });
    }
  };
  
  const resetForm = () => {
    setCurrentAd({
      name: '',
      slot: '',
      link: '',
      image: null,
      active: true
    });
    setIsEditing(false);
    setEditIndex(-1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAd.image) {
      toast.error("Please upload an image for the ad");
      return;
    }
    
    if (isEditing && editIndex >= 0) {
      const updatedAds = [...ads];
      updatedAds[editIndex] = currentAd;
      setAds(updatedAds);
      toast.success("Ad updated successfully");
    } else {
      setAds([...ads, currentAd]);
      toast.success("Ad created successfully");
    }
    
    resetForm();
  };
  
  const editAd = (index: number) => {
    setCurrentAd({ ...ads[index] });
    setIsEditing(true);
    setEditIndex(index);
  };
  
  const deleteAd = (index: number) => {
    const updatedAds = [...ads];
    updatedAds.splice(index, 1);
    setAds(updatedAds);
    toast.success("Ad deleted successfully");
    
    if (isEditing && index === editIndex) {
      resetForm();
    }
  };

  const handleCreateNew = () => {
    const createTabTrigger = document.querySelector('[data-value="create"]');
    if (createTabTrigger instanceof HTMLElement) {
      createTabTrigger.click();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Ad Management</h2>
      </div>
      
      <Tabs defaultValue="create">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="create">{isEditing ? 'Edit Ad' : 'Create New Ad'}</TabsTrigger>
          <TabsTrigger value="manage">Manage Ads ({ads.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <AdForm 
            currentAd={currentAd}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            onImageUpload={handleImageUpload}
            onSubmit={handleSubmit}
            onReset={resetForm}
          />
        </TabsContent>
        
        <TabsContent value="manage">
          <AdsList 
            ads={ads}
            onEdit={editAd}
            onDelete={deleteAd}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdManagementTab;
