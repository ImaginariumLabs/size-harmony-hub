
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight, Ruler } from 'lucide-react';

// Size conversion charts for European to other regions
const sizeConversions = {
  women: {
    tops: {
      EU: ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
      US: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
      UK: ['4', '6', '8', '10', '12', '14', '16', '18', '20', '22'],
      bust: ['78-81', '82-85', '86-89', '90-93', '94-97', '98-102', '103-107', '108-113', '114-119', '120-125'],
      waist: ['58-61', '62-65', '66-69', '70-73', '74-77', '78-81', '82-86', '87-92', '93-98', '99-104']
    },
    bottoms: {
      EU: ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
      US: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
      UK: ['4', '6', '8', '10', '12', '14', '16', '18', '20', '22'],
      waist: ['58-61', '62-65', '66-69', '70-73', '74-77', '78-81', '82-86', '87-92', '93-98', '99-104'],
      hip: ['84-87', '88-91', '92-95', '96-99', '100-103', '104-107', '108-112', '113-118', '119-124', '125-130']
    },
    dresses: {
      EU: ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
      US: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
      UK: ['4', '6', '8', '10', '12', '14', '16', '18', '20', '22'],
      bust: ['78-81', '82-85', '86-89', '90-93', '94-97', '98-102', '103-107', '108-113', '114-119', '120-125'],
      waist: ['58-61', '62-65', '66-69', '70-73', '74-77', '78-81', '82-86', '87-92', '93-98', '99-104'],
      hip: ['84-87', '88-91', '92-95', '96-99', '100-103', '104-107', '108-112', '113-118', '119-124', '125-130']
    }
  },
  men: {
    tops: {
      EU: ['44', '46', '48', '50', '52', '54', '56', '58', '60'],
      US: ['34', '36', '38', '40', '42', '44', '46', '48', '50'],
      UK: ['34', '36', '38', '40', '42', '44', '46', '48', '50'],
      chest: ['86-89', '90-93', '94-97', '98-101', '102-105', '106-109', '110-113', '114-117', '118-121']
    },
    bottoms: {
      EU: ['44', '46', '48', '50', '52', '54', '56', '58', '60'],
      US: ['28', '30', '32', '34', '36', '38', '40', '42', '44'],
      UK: ['28', '30', '32', '34', '36', '38', '40', '42', '44'],
      waist: ['72-75', '76-79', '80-83', '84-87', '88-91', '92-95', '96-99', '100-103', '104-107']
    }
  }
};

interface SizeInfo {
  region: string;
  size: string;
  measurements: Record<string, string>;
}

const ReverseSizeLookup: React.FC = () => {
  const [gender, setGender] = useState<'women' | 'men'>('women');
  const [garmentType, setGarmentType] = useState<'tops' | 'bottoms' | 'dresses'>('tops');
  const [region, setRegion] = useState<'EU' | 'US' | 'UK'>('EU');
  const [sizeInput, setSizeInput] = useState('');
  const [sizeInfo, setSizeInfo] = useState<SizeInfo | null>(null);
  const [error, setError] = useState('');

  // Reset size info when selections change
  useEffect(() => {
    setSizeInfo(null);
    setError('');
  }, [gender, garmentType, region]);

  // Only show dresses for women
  const availableGarmentTypes = gender === 'women' 
    ? ['tops', 'bottoms', 'dresses'] 
    : ['tops', 'bottoms'];

  const lookupSize = () => {
    setError('');
    setSizeInfo(null);
    
    if (!sizeInput) {
      setError('Please enter a size');
      return;
    }
    
    // Find the index of the size in the selected region
    const sizeChart = sizeConversions[gender][garmentType as keyof typeof sizeConversions[typeof gender]];
    const sizeIndex = sizeChart[region].findIndex(size => 
      size.toLowerCase() === sizeInput.toLowerCase());
    
    if (sizeIndex === -1) {
      setError(`Size ${sizeInput} not found for ${region} in ${garmentType}`);
      return;
    }
    
    // Collect measurements and equivalent sizes
    const measurements: Record<string, string> = {};
    const regions = ['EU', 'US', 'UK'];
    
    // Add measurement info
    Object.keys(sizeChart).forEach(key => {
      if (!regions.includes(key)) {
        measurements[key] = sizeChart[key as keyof typeof sizeChart][sizeIndex];
      }
    });
    
    setSizeInfo({
      region,
      size: sizeInput,
      measurements
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Reverse Size Lookup
          </CardTitle>
          <CardDescription>
            Enter a clothing size to find approximate measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select 
                  value={gender} 
                  onValueChange={(value) => setGender(value as 'women' | 'men')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Garment Type</label>
                <Select 
                  value={garmentType} 
                  onValueChange={(value) => setGarmentType(value as 'tops' | 'bottoms' | 'dresses')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGarmentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select value={region} onValueChange={(value) => setRegion(value as 'EU' | 'US' | 'UK')}>
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
              onClick={lookupSize} 
              className="w-full flex items-center gap-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Find Measurements
            </Button>
            
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            
            {sizeInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-primary/5 rounded-lg"
              >
                <h3 className="text-lg font-medium mb-2">Size Information</h3>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className="font-medium">Region:</p>
                  <p>{sizeInfo.region}</p>
                  
                  <p className="font-medium">Size:</p>
                  <p>{sizeInfo.size}</p>
                  
                  {Object.entries(sizeInfo.measurements).map(([type, value]) => (
                    <React.Fragment key={type}>
                      <p className="font-medium capitalize">{type}:</p>
                      <p>{value} cm</p>
                    </React.Fragment>
                  ))}
                  
                  {/* Show equivalent sizes */}
                  <p className="font-medium col-span-2 mt-2">Equivalent sizes:</p>
                  
                  {['EU', 'US', 'UK'].filter(r => r !== sizeInfo.region).map(r => {
                    const chart = sizeConversions[gender][garmentType as keyof typeof sizeConversions[typeof gender]];
                    const idx = chart[sizeInfo.region as keyof typeof chart].findIndex(
                      size => size.toLowerCase() === sizeInfo.size.toLowerCase()
                    );
                    return (
                      <React.Fragment key={r}>
                        <p className="font-medium">{r}:</p>
                        <p>{idx !== -1 ? chart[r as keyof typeof chart][idx] : 'N/A'}</p>
                      </React.Fragment>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReverseSizeLookup;
