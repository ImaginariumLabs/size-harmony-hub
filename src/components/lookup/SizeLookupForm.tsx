
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';

interface SizeLookupFormProps {
  onLookupSize: (region: 'EU' | 'US' | 'UK', sizeInput: string) => void;
}

const SizeLookupForm: React.FC<SizeLookupFormProps> = ({ onLookupSize }) => {
  const [region, setRegion] = useState<'EU' | 'US' | 'UK'>('EU');
  const [sizeInput, setSizeInput] = useState('');

  const handleSubmit = () => {
    onLookupSize(region, sizeInput);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <Select value={region} onValueChange={value => setRegion(value as 'EU' | 'US' | 'UK')}>
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
            onChange={(e) => setSizeInput(e.target.value)} 
            placeholder={`Enter ${region} size`}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        className="w-full flex items-center gap-2"
      >
        <ArrowLeftRight className="h-4 w-4" />
        Find Size Information
      </Button>
    </div>
  );
};

export default SizeLookupForm;
