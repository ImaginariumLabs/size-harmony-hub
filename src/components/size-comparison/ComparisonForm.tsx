
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BrandSearch from './BrandSearch';
import BrandSelectionList from './BrandSelectionList';

type Brand = {
  id: string;
  name: string;
};

interface ComparisonFormProps {
  clothingType: string;
  setClothingType: (type: string) => void;
  measurementType: string;
  setMeasurementType: (type: string) => void;
  measurementValue: string;
  setMeasurementValue: (value: string) => void;
  measurementUnit: string;
  setMeasurementUnit: (unit: string) => void;
  brands: Brand[];
  filteredBrands: Brand[];
  selectedBrands: string[];
  toggleBrandSelection: (brandId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleCompare: () => void;
  loading: boolean;
}

const ComparisonForm: React.FC<ComparisonFormProps> = ({
  clothingType,
  setClothingType,
  measurementType,
  setMeasurementType,
  measurementValue,
  setMeasurementValue,
  measurementUnit,
  setMeasurementUnit,
  filteredBrands,
  selectedBrands,
  toggleBrandSelection,
  searchTerm,
  setSearchTerm,
  handleCompare,
  loading
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clothing-type">Clothing Type</Label>
          <select 
            id="clothing-type"
            value={clothingType}
            onChange={(e) => setClothingType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="dresses">Dresses</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="measurement-type">Measurement</Label>
          <select 
            id="measurement-type"
            value={measurementType}
            onChange={(e) => setMeasurementType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            {clothingType === 'tops' || clothingType === 'dresses' ? (
              <option value="bust">Bust</option>
            ) : null}
            <option value="waist">Waist</option>
            {clothingType === 'bottoms' || clothingType === 'dresses' ? (
              <option value="hips">Hips</option>
            ) : null}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="measurement-value">Value</Label>
          <Input 
            id="measurement-value"
            type="number"
            value={measurementValue}
            onChange={(e) => setMeasurementValue(e.target.value)}
            placeholder="Enter measurement"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="measurement-unit">Unit</Label>
          <select 
            id="measurement-unit"
            value={measurementUnit}
            onChange={(e) => setMeasurementUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="inches">Inches</option>
            <option value="cm">Centimeters</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex justify-between">
          <span>Select Brands (up to 4)</span>
          <span className="text-sm text-muted-foreground">
            {selectedBrands.length}/4 selected
          </span>
        </Label>
        
        <BrandSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <BrandSelectionList
          filteredBrands={filteredBrands}
          selectedBrands={selectedBrands}
          toggleBrandSelection={toggleBrandSelection}
        />
      </div>
      
      <Button 
        onClick={handleCompare} 
        disabled={loading || !measurementValue || selectedBrands.length === 0}
        className="w-full bg-gradient-to-r from-primary to-purple-600 text-white"
      >
        {loading ? 'Comparing...' : 'Compare Sizes'}
      </Button>
    </div>
  );
};

export default ComparisonForm;
