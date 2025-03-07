
import React, { useState } from 'react';
import { Text, Save, Eye, Toggle } from 'lucide-react';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ContentSection {
  id: string;
  name: string;
  content: string;
  visible: boolean;
}

const initialSections: ContentSection[] = [
  {
    id: 'hero-title',
    name: 'Hero Title',
    content: 'Find Your Perfect Fit',
    visible: true
  },
  {
    id: 'hero-description',
    name: 'Hero Description',
    content: 'Select your clothing type and measurements to discover your perfect size across different brands.',
    visible: true
  },
  {
    id: 'featured-title',
    name: 'Featured Brands Title',
    content: 'Popular Fashion Brands',
    visible: true
  },
  {
    id: 'featured-description',
    name: 'Featured Brands Description',
    content: 'Discover these popular brands with excellent size consistency and customer satisfaction.',
    visible: true
  },
  {
    id: 'premium-title',
    name: 'Premium Selection Title',
    content: 'Premium Selection',
    visible: true
  },
  {
    id: 'premium-description',
    name: 'Premium Selection Description',
    content: 'Brands known for their quality and consistency in sizing',
    visible: true
  },
  {
    id: 'trending-title',
    name: 'Trending Now Title',
    content: 'Trending Now',
    visible: true
  },
  {
    id: 'trending-description',
    name: 'Trending Now Description',
    content: 'The most searched brands by our users this month',
    visible: true
  },
  {
    id: 'rated-title',
    name: 'Best Rated Title',
    content: 'Best Rated',
    visible: true
  },
  {
    id: 'rated-description',
    name: 'Best Rated Description',
    content: 'Top-rated brands based on user satisfaction and feedback',
    visible: true
  },
  {
    id: 'footer-about',
    name: 'Footer About Text',
    content: 'Our mission is to make online clothing shopping easier by providing accurate size conversions across different brands and international standards.',
    visible: true
  }
];

const ContentManagementTab: React.FC = () => {
  const [sections, setSections] = useState<ContentSection[]>(initialSections);
  const [editContent, setEditContent] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null);
  
  const handleEditSection = (section: ContentSection) => {
    setCurrentSection(section);
    setEditContent(section.content);
  };
  
  const handleSave = () => {
    if (!currentSection) return;
    
    const updatedSections = sections.map(section => 
      section.id === currentSection.id ? { ...section, content: editContent } : section
    );
    
    setSections(updatedSections);
    setCurrentSection(null);
    setEditContent('');
    toast.success(`"${currentSection.name}" updated successfully`);
  };
  
  const handleToggleVisibility = (id: string, newValue: boolean) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, visible: newValue } : section
    );
    
    setSections(updatedSections);
    toast.success(`Section visibility updated`);
  };
  
  const handleCancel = () => {
    setCurrentSection(null);
    setEditContent('');
  };
  
  const handleSaveAll = () => {
    // In a real app, this would save to a database
    console.log('Saving all content sections:', sections);
    toast.success('All content sections saved successfully');
  };
  
  // Group sections by category
  const sectionGroups = [
    { title: 'Hero Section', sections: sections.filter(s => s.id.startsWith('hero')) },
    { title: 'Featured Brands', sections: sections.filter(s => s.id.startsWith('featured')) },
    { title: 'Premium Selection', sections: sections.filter(s => s.id.startsWith('premium')) },
    { title: 'Trending Now', sections: sections.filter(s => s.id.startsWith('trending')) },
    { title: 'Best Rated', sections: sections.filter(s => s.id.startsWith('rated')) },
    { title: 'Footer', sections: sections.filter(s => s.id.startsWith('footer')) }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Content Management</h2>
        <button
          onClick={handleSaveAll}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm"
        >
          <Save className="h-4 w-4 mr-1" />
          Save All Changes
        </button>
      </div>
      
      {currentSection ? (
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{currentSection.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-primary text-white rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border rounded-md p-3 min-h-[120px]"
            placeholder="Enter content"
          />
        </div>
      ) : (
        <div className="space-y-8">
          {sectionGroups.map(group => (
            <div key={group.title}>
              <h3 className="text-lg font-medium mb-3">{group.title}</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                {group.sections.map((section, index) => (
                  <div key={section.id} className={`p-4 flex flex-col md:flex-row md:items-center justify-between ${index !== 0 ? 'border-t' : ''}`}>
                    <div className="flex-1 mb-3 md:mb-0">
                      <h4 className="font-medium text-sm mb-1">{section.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{section.content}</p>
                    </div>
                    <div className="flex items-center space-x-3 md:ml-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`visibility-${section.id}`}
                          checked={section.visible}
                          onCheckedChange={(checked) => handleToggleVisibility(section.id, checked)}
                        />
                        <Label htmlFor={`visibility-${section.id}`} className="text-xs">
                          {section.visible ? 'Visible' : 'Hidden'}
                        </Label>
                      </div>
                      <button
                        onClick={() => handleEditSection(section)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full"
                      >
                        <Text className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManagementTab;
