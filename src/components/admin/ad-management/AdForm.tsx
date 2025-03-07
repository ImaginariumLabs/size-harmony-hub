
import React, { useRef } from 'react';
import { Image, Save } from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { AdData, AD_SLOTS } from './types';

interface AdFormProps {
  currentAd: AdData;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const AdForm: React.FC<AdFormProps> = ({
  currentAd,
  isEditing,
  onInputChange,
  onCheckboxChange,
  onImageUpload,
  onSubmit,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onCheckboxChange}
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
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    onInputChange({
                      target: { name: 'image', value: null }
                    } as React.ChangeEvent<HTMLInputElement>);
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
              onChange={onImageUpload}
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
            onClick={onReset}
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
  );
};

export default AdForm;
