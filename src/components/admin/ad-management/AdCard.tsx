
import React from 'react';
import { AdData, AD_SLOTS } from './types';

interface AdCardProps {
  ad: AdData;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, index, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
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
            onClick={() => onEdit(index)}
            className="flex-1 py-1 text-sm bg-gray-100 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(index)}
            className="flex-1 py-1 text-sm bg-red-50 text-red-600 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
