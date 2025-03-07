
import React, { useState, useRef } from 'react';
import { FileSpreadsheet, FileDown, Plus, Save, Trash, Upload, Image, Check, X, Download } from 'lucide-react';
import { toast } from "sonner";
import { BrandFormData, SizeRange, CSVValidationResult, GARMENT_TYPES, defaultSizeTemplates } from './ad-management/types';

const initialSizeRange: SizeRange = {
  size: '',
  bust_min: '',
  bust_max: '',
  waist_min: '',
  waist_max: '',
  hip_min: '',
  hip_max: ''
};

const BrandManagementTab: React.FC = () => {
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    garmentType: 'tops',
    usSizes: [{ ...initialSizeRange }],
    ukSizes: [{ ...initialSizeRange }],
    euSizes: [{ ...initialSizeRange }],
    logo: null
  });
  
  const [csvResult, setCsvResult] = useState<CSVValidationResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };
  
  const handleGarmentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGarmentType = e.target.value as 'tops' | 'bottoms' | 'dresses';
    setFormData({ ...formData, garmentType: newGarmentType });
  };
  
  const handleSizeChange = (
    category: 'usSizes' | 'ukSizes' | 'euSizes',
    index: number,
    field: keyof SizeRange,
    value: string
  ) => {
    const newSizes = [...formData[category]];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, [category]: newSizes });
  };
  
  const addSizeRow = (category: 'usSizes' | 'ukSizes' | 'euSizes') => {
    setFormData({
      ...formData,
      [category]: [...formData[category], { ...initialSizeRange }]
    });
  };
  
  const removeSizeRow = (category: 'usSizes' | 'ukSizes' | 'euSizes', index: number) => {
    if (formData[category].length > 1) {
      const newSizes = [...formData[category]];
      newSizes.splice(index, 1);
      setFormData({ ...formData, [category]: newSizes });
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload an image file (JPEG, PNG, GIF, SVG)");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setFormData({ ...formData, logo: file });
      toast.success("Logo uploaded successfully");
    }
  };
  
  const validateCSV = (content: string): CSVValidationResult => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Check required headers
    const requiredHeaders = [
      'brand_name', 
      'garment_type', 
      'region', 
      'size_label', 
      'measurement_type', 
      'min_value', 
      'max_value', 
      'unit'
    ];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return {
        isValid: false,
        errors: [`Missing required headers: ${missingHeaders.join(', ')}`]
      };
    }
    
    const errors: string[] = [];
    const data = [];
    
    // Validate each row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch. Expected ${headers.length}, got ${values.length}`);
        continue;
      }
      
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      // Check for empty required fields
      for (const reqHeader of requiredHeaders) {
        if (!row[reqHeader]) {
          errors.push(`Row ${i + 1}: Missing required value for "${reqHeader}"`);
        }
      }
      
      // Validate numeric fields
      if (isNaN(parseFloat(row['min_value'])) || isNaN(parseFloat(row['max_value']))) {
        errors.push(`Row ${i + 1}: "min_value" and "max_value" must be numeric values`);
      }
      
      // Validate region (should be US, UK, or EU)
      if (!['us', 'uk', 'eu'].includes(row['region'].toLowerCase())) {
        errors.push(`Row ${i + 1}: "region" must be one of: US, UK, EU`);
      }
      
      // Validate garment_type
      if (!['tops', 'bottoms', 'dresses'].includes(row['garment_type'].toLowerCase())) {
        errors.push(`Row ${i + 1}: "garment_type" must be one of: tops, bottoms, dresses`);
      }
      
      // Validate measurement_type
      if (!['bust', 'waist', 'hip'].includes(row['measurement_type'].toLowerCase())) {
        errors.push(`Row ${i + 1}: "measurement_type" must be one of: bust, waist, hip`);
      }
      
      // Validate unit
      if (!['cm', 'in'].includes(row['unit'].toLowerCase())) {
        errors.push(`Row ${i + 1}: "unit" must be one of: cm, in`);
      }
      
      data.push(row);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      data: errors.length === 0 ? data : undefined
    };
  };
  
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const validationResult = validateCSV(content);
        setCsvResult(validationResult);
        
        if (validationResult.isValid && validationResult.data) {
          toast.success("CSV validation successful. Ready to import.");
        } else {
          toast.error("CSV validation failed. Please check the errors and try again.");
        }
      } catch (error) {
        setCsvResult({
          isValid: false,
          errors: ["Failed to parse CSV file. Please check the format."]
        });
        toast.error("Failed to parse CSV file");
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setCsvResult({
        isValid: false,
        errors: ["Failed to read the file. Please try again."]
      });
      setIsUploading(false);
      toast.error("Failed to read the file");
    };
    
    reader.readAsText(file);
  };
  
  const createCSVTemplate = () => {
    const headers = [
      'brand_name',
      'garment_type',
      'region',
      'size_label',
      'measurement_type',
      'min_value',
      'max_value',
      'unit'
    ].join(',');
    
    // Sample data rows
    const sampleRows = [
      'H&M,tops,US,XS,bust,76,80,cm',
      'H&M,tops,US,XS,waist,60,64,cm',
      'H&M,tops,UK,8,bust,84,88,cm',
      'H&M,tops,UK,8,waist,68,72,cm',
      'H&M,tops,EU,36,bust,92,96,cm',
      'H&M,tops,EU,36,waist,76,80,cm',
      'H&M,bottoms,US,M,waist,74,79,cm',
      'H&M,bottoms,US,M,hip,100,104,cm',
      'H&M,dresses,US,L,bust,100,104,cm',
      'H&M,dresses,US,L,waist,84,88,cm',
      'H&M,dresses,US,L,hip,108,112,cm',
    ].join('\n');
    
    const csvContent = `${headers}\n${sampleRows}`;
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'size_chart_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const importCSVData = () => {
    if (!csvResult?.isValid || !csvResult.data) return;
    
    // Group data by brand_name and garment_type
    interface GroupedData {
      [brandName: string]: {
        [garmentType: string]: {
          [region: string]: {
            [sizeLabel: string]: {
              [measurementType: string]: {
                min: string;
                max: string;
                unit: string;
              }
            }
          }
        }
      }
    }
    
    const groupedData: GroupedData = {};
    
    csvResult.data.forEach(row => {
      const { brand_name, garment_type, region, size_label, measurement_type, min_value, max_value, unit } = row;
      
      if (!groupedData[brand_name]) {
        groupedData[brand_name] = {};
      }
      
      if (!groupedData[brand_name][garment_type]) {
        groupedData[brand_name][garment_type] = {};
      }
      
      if (!groupedData[brand_name][garment_type][region]) {
        groupedData[brand_name][garment_type][region] = {};
      }
      
      if (!groupedData[brand_name][garment_type][region][size_label]) {
        groupedData[brand_name][garment_type][region][size_label] = {};
      }
      
      groupedData[brand_name][garment_type][region][size_label][measurement_type] = {
        min: min_value,
        max: max_value,
        unit
      };
    });
    
    // Process first brand and garment type (in a real app, you'd process all)
    const firstBrand = Object.keys(groupedData)[0];
    const firstGarmentType = Object.keys(groupedData[firstBrand])[0] as 'tops' | 'bottoms' | 'dresses';
    const brandData = groupedData[firstBrand][firstGarmentType];
    
    const newFormData: BrandFormData = {
      name: firstBrand,
      garmentType: firstGarmentType,
      usSizes: [],
      ukSizes: [],
      euSizes: []
    };
    
    // Process US sizes
    if (brandData['us']) {
      Object.keys(brandData['us']).forEach(sizeLabel => {
        const measurements = brandData['us'][sizeLabel];
        const sizeRange: SizeRange = {
          size: sizeLabel,
          bust_min: measurements.bust?.min || '',
          bust_max: measurements.bust?.max || '',
          waist_min: measurements.waist?.min || '',
          waist_max: measurements.waist?.max || '',
          hip_min: measurements.hip?.min || '',
          hip_max: measurements.hip?.max || ''
        };
        newFormData.usSizes.push(sizeRange);
      });
    }
    
    // Process UK sizes
    if (brandData['uk']) {
      Object.keys(brandData['uk']).forEach(sizeLabel => {
        const measurements = brandData['uk'][sizeLabel];
        const sizeRange: SizeRange = {
          size: sizeLabel,
          bust_min: measurements.bust?.min || '',
          bust_max: measurements.bust?.max || '',
          waist_min: measurements.waist?.min || '',
          waist_max: measurements.waist?.max || '',
          hip_min: measurements.hip?.min || '',
          hip_max: measurements.hip?.max || ''
        };
        newFormData.ukSizes.push(sizeRange);
      });
    }
    
    // Process EU sizes
    if (brandData['eu']) {
      Object.keys(brandData['eu']).forEach(sizeLabel => {
        const measurements = brandData['eu'][sizeLabel];
        const sizeRange: SizeRange = {
          size: sizeLabel,
          bust_min: measurements.bust?.min || '',
          bust_max: measurements.bust?.max || '',
          waist_min: measurements.waist?.min || '',
          waist_max: measurements.waist?.max || '',
          hip_min: measurements.hip?.min || '',
          hip_max: measurements.hip?.max || ''
        };
        newFormData.euSizes.push(sizeRange);
      });
    }
    
    // Ensure at least one entry for each size type
    if (newFormData.usSizes.length === 0) newFormData.usSizes = [{ ...initialSizeRange }];
    if (newFormData.ukSizes.length === 0) newFormData.ukSizes = [{ ...initialSizeRange }];
    if (newFormData.euSizes.length === 0) newFormData.euSizes = [{ ...initialSizeRange }];
    
    setFormData(newFormData);
    toast.success(`Imported brand: ${firstBrand} (${firstGarmentType})`);
    setCsvResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const applyDefaultTemplate = (template: 'xs' | 's' | 'm' | 'l' | 'xl') => {
    const garmentType = formData.garmentType;
    const tmpl = defaultSizeTemplates[garmentType][template];
    
    setFormData({
      ...formData,
      usSizes: [{
        size: tmpl.us,
        bust_min: tmpl.bust_min,
        bust_max: tmpl.bust_max,
        waist_min: tmpl.waist_min,
        waist_max: tmpl.waist_max,
        hip_min: tmpl.hip_min,
        hip_max: tmpl.hip_max
      }],
      ukSizes: [{
        size: tmpl.uk,
        bust_min: tmpl.bust_min,
        bust_max: tmpl.bust_max,
        waist_min: tmpl.waist_min,
        waist_max: tmpl.waist_max,
        hip_min: tmpl.hip_min,
        hip_max: tmpl.hip_max
      }],
      euSizes: [{
        size: tmpl.eu,
        bust_min: tmpl.bust_min,
        bust_max: tmpl.bust_max,
        waist_min: tmpl.waist_min,
        waist_max: tmpl.waist_max,
        hip_min: tmpl.hip_min,
        hip_max: tmpl.hip_max
      }]
    });
    
    toast.success(`Applied ${template.toUpperCase()} size template for ${garmentType}`);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save to a database
    console.log('Saving brand data:', formData);
    toast.success('Brand saved successfully (demo only)');
    
    // Reset form
    setFormData({
      name: '',
      garmentType: 'tops',
      usSizes: [{ ...initialSizeRange }],
      ukSizes: [{ ...initialSizeRange }],
      euSizes: [{ ...initialSizeRange }],
      logo: null
    });
    
    if (logoInputRef.current) logoInputRef.current.value = '';
  };
  
  // Helper function to determine if a field should be hidden based on garment type
  const shouldShowField = (field: 'bust' | 'waist' | 'hip') => {
    const { garmentType } = formData;
    
    if (field === 'bust') {
      return garmentType === 'tops' || garmentType === 'dresses';
    }
    
    if (field === 'waist') {
      return true; // Show for all garment types
    }
    
    if (field === 'hip') {
      return garmentType === 'bottoms' || garmentType === 'dresses';
    }
    
    return true;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Brand Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={createCSVTemplate}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download CSV Template
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-3 py-2 bg-primary text-white rounded-lg text-sm"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCSVUpload}
            accept=".csv"
            className="hidden"
          />
        </div>
      </div>
      
      {csvResult && (
        <div className={`p-4 mb-6 rounded-lg border ${csvResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center mb-2">
            {csvResult.isValid ? (
              <>
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-medium text-green-800">CSV Validation Successful</h3>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-medium text-red-800">CSV Validation Failed</h3>
              </>
            )}
          </div>
          
          {!csvResult.isValid && (
            <div className="mt-2 space-y-1">
              <h4 className="font-medium">Errors:</h4>
              <ul className="text-sm list-disc pl-5 text-red-700">
                {csvResult.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {csvResult.isValid && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={importCSVData}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                <Upload className="h-4 w-4 mr-1" />
                Import Data
              </button>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="mb-6">
              <label className="block text-sm text-muted-foreground mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleBrandChange}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Brand Name"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-muted-foreground mb-2">
                Garment Type
              </label>
              <select
                value={formData.garmentType}
                onChange={handleGarmentTypeChange}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                required
              >
                {GARMENT_TYPES.map(garment => (
                  <option key={garment.id} value={garment.id}>
                    {garment.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <button 
                type="button" 
                onClick={() => applyDefaultTemplate('xs')}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                XS Template
              </button>
              <button 
                type="button" 
                onClick={() => applyDefaultTemplate('s')}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                S Template
              </button>
              <button 
                type="button" 
                onClick={() => applyDefaultTemplate('m')}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                M Template
              </button>
              <button 
                type="button" 
                onClick={() => applyDefaultTemplate('l')}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                L Template
              </button>
              <button 
                type="button" 
                onClick={() => applyDefaultTemplate('xl')}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                XL Template
              </button>
            </div>
            
            {/* US Sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">US Sizes</h3>
                <button 
                  type="button"
                  onClick={() => addSizeRow('usSizes')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-3 mb-2 text-sm font-medium text-muted-foreground">
                <div>Size</div>
                {shouldShowField('bust') && (
                  <>
                    <div>Bust Min</div>
                    <div>Bust Max</div>
                  </>
                )}
                <div>Waist Min</div>
                <div>Waist Max</div>
                {shouldShowField('hip') && (
                  <>
                    <div>Hip Min</div>
                    <div>Hip Max</div>
                  </>
                )}
                <div></div> {/* Delete button column */}
              </div>
              
              {formData.usSizes.map((size, index) => (
                <div key={index} className="grid grid-cols-8 gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('usSizes', index, 'size', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Size (XS, S, M...)"
                    required
                  />
                  
                  {shouldShowField('bust') && (
                    <>
                      <input
                        type="number"
                        value={size.bust_min}
                        onChange={(e) => handleSizeChange('usSizes', index, 'bust_min', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Min"
                        step="0.1"
                        required={formData.garmentType === 'tops' || formData.garmentType === 'dresses'}
                      />
                      <input
                        type="number"
                        value={size.bust_max}
                        onChange={(e) => handleSizeChange('usSizes', index, 'bust_max', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Max"
                        step="0.1"
                        required={formData.garmentType === 'tops' || formData.garmentType === 'dresses'}
                      />
                    </>
                  )}
                  
                  <input
                    type="number"
                    value={size.waist_min}
                    onChange={(e) => handleSizeChange('usSizes', index, 'waist_min', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Min"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.waist_max}
                    onChange={(e) => handleSizeChange('usSizes', index, 'waist_max', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Max"
                    step="0.1"
                    required
                  />
                  
                  {shouldShowField('hip') && (
                    <>
                      <input
                        type="number"
                        value={size.hip_min}
                        onChange={(e) => handleSizeChange('usSizes', index, 'hip_min', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Min"
                        step="0.1"
                        required={formData.garmentType === 'bottoms' || formData.garmentType === 'dresses'}
                      />
                      <input
                        type="number"
                        value={size.hip_max}
                        onChange={(e) => handleSizeChange('usSizes', index, 'hip_max', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Max"
                        step="0.1"
                        required={formData.garmentType === 'bottoms' || formData.garmentType === 'dresses'}
                      />
                    </>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeSizeRow('usSizes', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    disabled={formData.usSizes.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* UK Sizes - Similar structure to US sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">UK Sizes</h3>
                <button 
                  type="button"
                  onClick={() => addSizeRow('ukSizes')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-3 mb-2 text-sm font-medium text-muted-foreground">
                <div>Size</div>
                {shouldShowField('bust') && (
                  <>
                    <div>Bust Min</div>
                    <div>Bust Max</div>
                  </>
                )}
                <div>Waist Min</div>
                <div>Waist Max</div>
                {shouldShowField('hip') && (
                  <>
                    <div>Hip Min</div>
                    <div>Hip Max</div>
                  </>
                )}
                <div></div> {/* Delete button column */}
              </div>
              
              {formData.ukSizes.map((size, index) => (
                <div key={index} className="grid grid-cols-8 gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'size', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Size (6, 8, 10...)"
                    required
                  />
                  
                  {shouldShowField('bust') && (
                    <>
                      <input
                        type="number"
                        value={size.bust_min}
                        onChange={(e) => handleSizeChange('ukSizes', index, 'bust_min', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Min"
                        step="0.1"
                        required={formData.garmentType === 'tops' || formData.garmentType === 'dresses'}
                      />
                      <input
                        type="number"
                        value={size.bust_max}
                        onChange={(e) => handleSizeChange('ukSizes', index, 'bust_max', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Max"
                        step="0.1"
                        required={formData.garmentType === 'tops' || formData.garmentType === 'dresses'}
                      />
                    </>
                  )}
                  
                  <input
                    type="number"
                    value={size.waist_min}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'waist_min', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Min"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.waist_max}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'waist_max', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Max"
                    step="0.1"
                    required
                  />
                  
                  {shouldShowField('hip') && (
                    <>
                      <input
                        type="number"
                        value={size.hip_min}
                        onChange={(e) => handleSizeChange('ukSizes', index, 'hip_min', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Min"
                        step="0.1"
                        required={formData.garmentType === 'bottoms' || formData.garmentType === 'dresses'}
                      />
                      <input
                        type="number"
                        value={size.hip_max}
                        onChange={(e) => handleSizeChange('ukSizes', index, 'hip_max', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Max"
                        step="0.1"
                        required={formData.garmentType === 'bottoms' || formData.garmentType === 'dresses'}
                      />
                    </>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeSizeRow('ukSizes', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    disabled={formData.ukSizes.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* EU Sizes - Similar structure to US sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">EU Sizes</h3>
                <button 
                  type="button"
                  onClick={() => addSizeRow('euSizes')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-3 mb-2 text-sm font-medium text-muted-foreground">
                <div>Size</div>
                {shouldShowField('bust') && (
                  <>
                    <div>Bust Min</div>
                    <div>Bust Max</div>
                  </>
                )}
                <div>Waist Min</div>
                <div>Waist Max</div>
                {shouldShowField('hip') && (
                  <>
                    <div>Hip Min</div>
                    <div>Hip Max</div>
                  </>
                )}
                <div></div> {/* Delete button column */}
              </div>
              
              {formData.euSizes.map((size, index) => (
                <div key={index} className="grid grid-cols-8 gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('euSizes', index, 'size', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Size (32, 34, 36...)"
                    required
                  />
                  
                  {shouldShowField('bust') && (
                    <>
                      <input
                        type="number"
                        value={size.bust_min}
                        onChange={(e) => handleSizeChange('euSizes', index, 'bust_min', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Min"
                        step="0.1"
                        required={formData.garmentType === 'tops' || formData.garmentType === 'dresses'}
                      />
                      <input
                        type="number"
                        value={size.bust_max}
                        onChange={(e) => handleSizeChange('euSizes', index, 'bust_max', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Max"
                        step="0.1"
                        required={formData.garmentType === 'tops' || formData.garmentType === 'dresses'}
                      />
                    </>
                  )}
                  
                  <input
                    type="number"
                    value={size.waist_min}
                    onChange={(e) => handleSizeChange('euSizes', index, 'waist_min', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Min"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.waist_max}
                    onChange={(e) => handleSizeChange('euSizes', index, 'waist_max', e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Max"
                    step="0.1"
                    required
                  />
                  
                  {shouldShowField('hip') && (
                    <>
                      <input
                        type="number"
                        value={size.hip_min}
                        onChange={(e) => handleSizeChange('euSizes', index, 'hip_min', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Min"
                        step="0.1"
                        required={formData.garmentType === 'bottoms' || formData.garmentType === 'dresses'}
                      />
                      <input
                        type="number"
                        value={size.hip_max}
                        onChange={(e) => handleSizeChange('euSizes', index, 'hip_max', e.target.value)}
                        className="p-2 border rounded"
                        placeholder="Max"
                        step="0.1"
                        required={formData.garmentType === 'bottoms' || formData.garmentType === 'dresses'}
                      />
                    </>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeSizeRow('euSizes', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    disabled={formData.euSizes.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <label className="block text-sm text-muted-foreground mb-2">
                Brand Logo
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {formData.logo ? (
                  <div className="space-y-2">
                    <div className="h-40 flex items-center justify-center bg-gray-50 rounded">
                      <img 
                        src={URL.createObjectURL(formData.logo)} 
                        alt="Brand logo preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {formData.logo.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({...formData, logo: null});
                        if (logoInputRef.current) logoInputRef.current.value = '';
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="h-40 flex flex-col items-center justify-center">
                      <Image className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload brand logo
                      </p>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-3 py-1 bg-primary text-white text-sm rounded"
                      >
                        Choose File
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF, SVG up to 5MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-amber-800 mb-2">Size Chart Reference</h4>
              <p className="text-xs text-amber-700 mb-2">
                All measurements are in centimeters (cm). For advanced customization, use the CSV import functionality.
              </p>
              <div className="text-xs text-amber-800">
                <strong>Measuring tips:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Bust: Measure around the fullest part</li>
                  <li>Waist: Measure at the narrowest point</li>
                  <li>Hip: Measure at the widest point</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="flex items-center justify-center w-full py-3 px-4 bg-primary text-white rounded-lg font-medium mt-6"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Brand
        </button>
      </form>
    </div>
  );
};

export default BrandManagementTab;
