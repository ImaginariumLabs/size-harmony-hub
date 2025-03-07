
import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Plus, Save, Trash, Upload, Image, Check, X } from 'lucide-react';
import { toast } from "sonner";

interface BrandFormData {
  name: string;
  usSizes: { size: string; min: string; max: string }[];
  ukSizes: { size: string; min: string; max: string }[];
  euSizes: { size: string; min: string; max: string }[];
  logo?: File | null;
}

interface CSVValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any[];
}

const defaultSizeTemplates = {
  xs: { us: "XS", uk: "6", eu: "32", min: "30", max: "32" },
  s: { us: "S", uk: "8", eu: "34", min: "32", max: "34" },
  m: { us: "M", uk: "10", eu: "36", min: "34", max: "37" },
  l: { us: "L", uk: "12", eu: "38", min: "37", max: "40" },
  xl: { us: "XL", uk: "14", eu: "40", min: "40", max: "43" }
};

const BrandManagementTab: React.FC = () => {
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    usSizes: [{ size: '', min: '', max: '' }],
    ukSizes: [{ size: '', min: '', max: '' }],
    euSizes: [{ size: '', min: '', max: '' }],
    logo: null
  });
  
  const [csvResult, setCsvResult] = useState<CSVValidationResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };
  
  const handleSizeChange = (
    category: 'usSizes' | 'ukSizes' | 'euSizes',
    index: number,
    field: 'size' | 'min' | 'max',
    value: string
  ) => {
    const newSizes = [...formData[category]];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, [category]: newSizes });
  };
  
  const addSizeRow = (category: 'usSizes' | 'ukSizes' | 'euSizes') => {
    setFormData({
      ...formData,
      [category]: [...formData[category], { size: '', min: '', max: '' }]
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
    const requiredHeaders = ['brand_name', 'size_type', 'size', 'min_inches', 'max_inches'];
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
      if (isNaN(parseFloat(row['min_inches'])) || isNaN(parseFloat(row['max_inches']))) {
        errors.push(`Row ${i + 1}: "min_inches" and "max_inches" must be numeric values`);
      }
      
      // Validate size_type (should be US, UK, or EU)
      if (!['us', 'uk', 'eu'].includes(row['size_type'].toLowerCase())) {
        errors.push(`Row ${i + 1}: "size_type" must be one of: US, UK, EU`);
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
  
  const importCSVData = () => {
    if (!csvResult?.isValid || !csvResult.data) return;
    
    // Group data by brand_name
    const brandGroups: Record<string, any[]> = {};
    csvResult.data.forEach(row => {
      if (!brandGroups[row.brand_name]) {
        brandGroups[row.brand_name] = [];
      }
      brandGroups[row.brand_name].push(row);
    });
    
    // Process first brand (in a real app, you'd process all)
    const firstBrand = Object.keys(brandGroups)[0];
    const brandData = brandGroups[firstBrand];
    
    const newFormData: BrandFormData = {
      name: firstBrand,
      usSizes: [],
      ukSizes: [],
      euSizes: [],
      logo: null
    };
    
    // Organize sizes by type
    brandData.forEach(row => {
      const sizeEntry = {
        size: row.size,
        min: row.min_inches,
        max: row.max_inches
      };
      
      const sizeType = row.size_type.toLowerCase();
      if (sizeType === 'us') {
        newFormData.usSizes.push(sizeEntry);
      } else if (sizeType === 'uk') {
        newFormData.ukSizes.push(sizeEntry);
      } else if (sizeType === 'eu') {
        newFormData.euSizes.push(sizeEntry);
      }
    });
    
    // Ensure at least one entry for each size type
    if (newFormData.usSizes.length === 0) newFormData.usSizes = [{ size: '', min: '', max: '' }];
    if (newFormData.ukSizes.length === 0) newFormData.ukSizes = [{ size: '', min: '', max: '' }];
    if (newFormData.euSizes.length === 0) newFormData.euSizes = [{ size: '', min: '', max: '' }];
    
    setFormData(newFormData);
    toast.success(`Imported brand: ${firstBrand}`);
    setCsvResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const applyDefaultTemplate = (template: 'xs' | 's' | 'm' | 'l' | 'xl') => {
    const tmpl = defaultSizeTemplates[template];
    setFormData({
      ...formData,
      usSizes: [{ size: tmpl.us, min: tmpl.min, max: tmpl.max }],
      ukSizes: [{ size: tmpl.uk, min: tmpl.min, max: tmpl.max }],
      euSizes: [{ size: tmpl.eu, min: tmpl.min, max: tmpl.max }]
    });
    toast.success(`Applied ${template.toUpperCase()} size template`);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save to a database
    console.log('Saving brand data:', formData);
    toast.success('Brand saved successfully (demo only)');
    
    // Reset form
    setFormData({
      name: '',
      usSizes: [{ size: '', min: '', max: '' }],
      ukSizes: [{ size: '', min: '', max: '' }],
      euSizes: [{ size: '', min: '', max: '' }],
      logo: null
    });
    
    if (logoInputRef.current) logoInputRef.current.value = '';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Brand Management</h2>
        <div className="flex space-x-2">
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              
              {formData.usSizes.map((size, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('usSizes', index, 'size', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Size (XS, S, M...)"
                    required
                  />
                  <input
                    type="number"
                    value={size.min}
                    onChange={(e) => handleSizeChange('usSizes', index, 'min', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Min inches"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.max}
                    onChange={(e) => handleSizeChange('usSizes', index, 'max', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Max inches"
                    step="0.1"
                    required
                  />
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
              
              {formData.ukSizes.map((size, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'size', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Size (6, 8, 10...)"
                    required
                  />
                  <input
                    type="number"
                    value={size.min}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'min', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Min inches"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.max}
                    onChange={(e) => handleSizeChange('ukSizes', index, 'max', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Max inches"
                    step="0.1"
                    required
                  />
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
              
              {formData.euSizes.map((size, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange('euSizes', index, 'size', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Size (32, 34, 36...)"
                    required
                  />
                  <input
                    type="number"
                    value={size.min}
                    onChange={(e) => handleSizeChange('euSizes', index, 'min', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Min inches"
                    step="0.1"
                    required
                  />
                  <input
                    type="number"
                    value={size.max}
                    onChange={(e) => handleSizeChange('euSizes', index, 'max', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Max inches"
                    step="0.1"
                    required
                  />
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
