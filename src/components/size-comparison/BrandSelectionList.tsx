
import React from 'react';
import { X } from 'lucide-react';

type Brand = {
  id: string;
  name: string;
};

interface BrandSelectionListProps {
  filteredBrands: Brand[];
  selectedBrands: string[];
  toggleBrandSelection: (brandId: string) => void;
}

const BrandSelectionList: React.FC<BrandSelectionListProps> = ({ 
  filteredBrands, 
  selectedBrands, 
  toggleBrandSelection 
}) => {
  return (
    <div className="border rounded-md h-48 overflow-y-auto p-2 mt-2">
      {filteredBrands.length > 0 ? (
        filteredBrands.map(brand => (
          <div 
            key={brand.id}
            className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
              selectedBrands.includes(brand.id) 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => toggleBrandSelection(brand.id)}
          >
            <span>{brand.name}</span>
            {selectedBrands.includes(brand.id) && (
              <X className="h-4 w-4" />
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          No brands found
        </div>
      )}
    </div>
  );
};

export default BrandSelectionList;
