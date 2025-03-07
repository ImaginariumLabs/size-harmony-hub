
import React from 'react';
import { Layout, Plus } from 'lucide-react';

interface EmptyAdsListProps {
  onCreateNew: () => void;
}

const EmptyAdsList: React.FC<EmptyAdsListProps> = ({ onCreateNew }) => {
  return (
    <div className="text-center py-12">
      <Layout className="h-12 w-12 mx-auto text-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-gray-500">No ads created yet</h3>
      <p className="text-muted-foreground mb-4">Create your first ad to get started</p>
      <button
        onClick={onCreateNew}
        className="px-4 py-2 bg-primary text-white rounded-lg inline-flex items-center"
      >
        <Plus className="h-4 w-4 mr-1" />
        Create New Ad
      </button>
    </div>
  );
};

export default EmptyAdsList;
