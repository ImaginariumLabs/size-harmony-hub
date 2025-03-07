import React, { useState, useRef } from 'react';
import { Image, LinkIcon, Plus, Save, Trash, Eye, Layout } from 'lucide-react';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AdData {
  name: string;
  slot: string;
  link: string;
  image: File | null;
  active: boolean;
}

const AD_SLOTS = [
  { id: 'featured-premium', name: 'Featured - Premium Selection' },
  { id: 'featured-trending', name: 'Featured - Trending Now' },
  { id: 'featured-rated', name: 'Featured - Best Rated' },
  { id: 'sidebar', name: 'Sidebar Ads' },
  { id: 'banner', name: 'Banner Ads' },
  { id: 'footer', name: 'Footer Ads' }
];

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
  const [previewAd, setPreviewAd] = useState<AdData | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Ad Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentAd.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter ad name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Ad Slot
                  </label>
                  <select
                    name="slot"
                    value={currentAd.slot}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select ad slot</option>
                    {AD_SLOTS.map(slot => (
                      <option key={slot.id} value={slot.id}>{slot.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    External Link
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={currentAd.link}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="https://"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={currentAd.active}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  <label htmlFor="active" className="text-sm">
                    Active (ad will be displayed)
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Ad Image
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {currentAd.image ? (
                    <div className="space-y-2">
                      <div className="h-40 flex items-center justify-center bg-gray-50 rounded">
                        <img 
                          src={URL.createObjectURL(currentAd.image)} 
                          alt="Ad preview" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {currentAd.image.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentAd({...currentAd, image: null});
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-40 flex flex-col items-center justify-center">
                        <Image className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload ad image
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-primary text-white text-sm rounded"
                        >
                          Choose File
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF, SVG up to 5MB
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recommended sizes: Banner (728x90), Sidebar (300x250), Featured (300x250)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {currentAd.image && (
                  <div className="mt-4 flex justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          onClick={() => setPreviewAd(currentAd)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview Ad
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Ad Preview</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="rounded-lg border overflow-hidden">
                            {currentAd.image && (
                              <img 
                                src={URL.createObjectURL(currentAd.image)} 
                                alt="Ad preview" 
                                className="w-full object-contain"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Name:</p>
                              <p>{currentAd.name}</p>
                            </div>
                            <div>
                              <p className="font-medium">Slot:</p>
                              <p>{AD_SLOTS.find(s => s.id === currentAd.slot)?.name || currentAd.slot}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="font-medium">Link:</p>
                              <p className="truncate text-primary">{currentAd.link}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="font-medium">Status:</p>
                              <p>{currentAd.active ? 'Active' : 'Inactive'}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 justify-end mt-6">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
              >
                <Save className="h-5 w-5 mr-2" />
                {isEditing ? 'Update Ad' : 'Save Ad'}
              </button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="manage">
          {ads.length === 0 ? (
            <div className="text-center py-12">
              <Layout className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-500">No ads created yet</h3>
              <p className="text-muted-foreground mb-4">Create your first ad to get started</p>
              <button
                onClick={() => {
                  const createTabTrigger = document.querySelector('[data-value="create"]');
                  if (createTabTrigger instanceof HTMLElement) {
                    createTabTrigger.click();
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New Ad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad, index) => (
                <div key={index} className="border rounded-lg overflow-hidden bg-white">
                  {ad.image && (
                    <div className="h-40 bg-gray-50 flex items-center justify-center">
                      <img 
                        src={URL.createObjectURL(ad.image)} 
                        alt={ad.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{ad.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Slot: {AD_SLOTS.find(s => s.id === ad.slot)?.name || ad.slot}
                    </p>
                    <p className="text-sm text-primary truncate mb-3">
                      {ad.link}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editAd(index)}
                        className="flex-1 py-1 text-sm bg-gray-100 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAd(index)}
                        className="flex-1 py-1 text-sm bg-red-50 text-red-600 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdManagementTab;
