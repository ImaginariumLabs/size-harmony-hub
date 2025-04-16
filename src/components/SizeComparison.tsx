
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeftRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { findSizeByMeasurement } from '@/services/sizing';
import { supabase } from '@/lib/supabase';

type Brand = {
  id: string;
  name: string;
};

type SizeComparisonResult = {
  brandId: string;
  brandName: string;
  sizes: {
    usSize: string;
    ukSize: string;
    euSize: string;
  };
};

const SizeComparison: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clothingType, setClothingType] = useState('tops');
  const [measurementType, setMeasurementType] = useState('bust');
  const [measurementValue, setMeasurementValue] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('inches');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [results, setResults] = useState<SizeComparisonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setBrands(data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (clothingType === 'tops' || clothingType === 'dresses') {
      setMeasurementType('bust');
    } else if (clothingType === 'bottoms') {
      setMeasurementType('waist');
    }
  }, [clothingType]);

  const handleCompare = async () => {
    if (!measurementValue || isNaN(parseFloat(measurementValue)) || selectedBrands.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const comparisonResults: SizeComparisonResult[] = [];
      
      for (const brandId of selectedBrands) {
        const brand = brands.find(b => b.id === brandId);
        if (!brand) continue;
        
        const sizeResult = await findSizeByMeasurement(
          brand.name,
          clothingType,
          measurementType,
          parseFloat(measurementValue),
          measurementUnit
        );
        
        comparisonResults.push({
          brandId,
          brandName: brand.name,
          sizes: sizeResult
        });
      }
      
      setResults(comparisonResults);
    } catch (error) {
      console.error('Error comparing sizes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBrandSelection = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    } else {
      if (selectedBrands.length < 4) {
        setSelectedBrands([...selectedBrands, brandId]);
      }
    }
  };

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Compare Sizes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Compare Sizes Across Brands
          </DialogTitle>
          <DialogDescription>
            See how your size varies across different brands
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="input">Input Measurements</TabsTrigger>
            <TabsTrigger value="results" disabled={results.length === 0}>
              Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
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
            </div>
            
            <Button 
              onClick={handleCompare} 
              disabled={loading || !measurementValue || selectedBrands.length === 0}
              className="w-full"
            >
              {loading ? 'Comparing...' : 'Compare Sizes'}
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 bg-gray-100 p-3 rounded-md">
                <div className="font-medium">Brand</div>
                <div className="font-medium text-center">US Size</div>
                <div className="font-medium text-center">UK Size</div>
                <div className="font-medium text-center">EU Size</div>
              </div>
              
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-4 gap-2 p-3 rounded-md border"
                >
                  <div className="font-medium">{result.brandName}</div>
                  <div className="text-center font-bold">{result.sizes.usSize}</div>
                  <div className="text-center font-bold">{result.sizes.ukSize}</div>
                  <div className="text-center font-bold">{result.sizes.euSize}</div>
                </div>
              ))}
              
              <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800">
                <p>
                  <strong>Note:</strong> Sizes may vary slightly even within brands depending on the specific style and cut of the garment.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SizeComparison;
