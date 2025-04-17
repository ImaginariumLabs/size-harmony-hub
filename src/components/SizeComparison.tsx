
import React, { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { findSizeByMeasurement } from '@/services/sizing';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import ComparisonForm from './size-comparison/ComparisonForm';
import ComparisonResults from './size-comparison/ComparisonResults';

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
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setBrands(data || []);
        setFilteredBrands(data || []);
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

  useEffect(() => {
    // Filter brands based on search query
    if (searchTerm.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchTerm, brands]);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="gradient" 
          className="w-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 text-white font-medium"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span className="animate-pulse">Compare Sizes Across Brands</span>
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
          
          <TabsContent value="input">
            <ComparisonForm
              clothingType={clothingType}
              setClothingType={setClothingType}
              measurementType={measurementType}
              setMeasurementType={setMeasurementType}
              measurementValue={measurementValue}
              setMeasurementValue={setMeasurementValue}
              measurementUnit={measurementUnit}
              setMeasurementUnit={setMeasurementUnit}
              brands={brands}
              filteredBrands={filteredBrands}
              selectedBrands={selectedBrands}
              toggleBrandSelection={toggleBrandSelection}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleCompare={handleCompare}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ComparisonResults results={results} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SizeComparison;
