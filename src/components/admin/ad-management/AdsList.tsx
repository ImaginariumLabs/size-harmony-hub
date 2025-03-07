
import React from 'react';
import { AdData } from './types';
import AdCard from './AdCard';
import EmptyAdsList from './EmptyAdsList';

interface AdsListProps {
  ads: AdData[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onCreateNew: () => void;
}

const AdsList: React.FC<AdsListProps> = ({ ads, onEdit, onDelete, onCreateNew }) => {
  if (ads.length === 0) {
    return <EmptyAdsList onCreateNew={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ads.map((ad, index) => (
        <AdCard 
          key={index} 
          ad={ad} 
          index={index} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default AdsList;
