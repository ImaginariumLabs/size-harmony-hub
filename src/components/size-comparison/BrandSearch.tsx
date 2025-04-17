
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BrandSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const BrandSearch: React.FC<BrandSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
      <Input 
        type="text"
        placeholder="Search brands..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default BrandSearch;
