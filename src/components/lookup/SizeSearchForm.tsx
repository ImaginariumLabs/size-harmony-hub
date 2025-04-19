
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface SizeSearchFormProps {
  region: 'EU' | 'US' | 'UK';
  sizeInput: string;
  onRegionChange: (value: 'EU' | 'US' | 'UK') => void;
  onSizeInputChange: (value: string) => void;
}

const SizeSearchForm: React.FC<SizeSearchFormProps> = ({
  region,
  sizeInput,
  onRegionChange,
  onSizeInputChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Region</label>
        <Select value={region} onValueChange={value => onRegionChange(value as 'EU' | 'US' | 'UK')}>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EU">European (EU)</SelectItem>
            <SelectItem value="US">US</SelectItem>
            <SelectItem value="UK">UK</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Size</label>
        <Input 
          value={sizeInput} 
          onChange={(e) => onSizeInputChange(e.target.value)} 
          placeholder={`Enter ${region} size`}
        />
      </div>
    </div>
  );
};

export default SizeSearchForm;
