
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

interface HomepageSettings {
  featuredArticles: {
    understanding: string;
    shopping: string;
    comparison: string;
  };
  logo: string;
}

const HomepageContentTab = () => {
  const [settings, setSettings] = useState<HomepageSettings>({
    featuredArticles: {
      understanding: '',
      shopping: '',
      comparison: ''
    },
    logo: ''
  });

  const { data: blogPosts } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .eq('is_published', true);
      return data || [];
    }
  });

  const handleArticleSelect = (section: keyof HomepageSettings['featuredArticles'], value: string) => {
    setSettings(prev => ({
      ...prev,
      featuredArticles: {
        ...prev.featuredArticles,
        [section]: value
      }
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Image must be less than 2MB');
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('public')
        .upload(`logos/${Date.now()}-${file.name}`, file);

      if (error) throw error;

      const logoUrl = `${supabase.storageUrl}/object/public/${data.path}`;
      setSettings(prev => ({
        ...prev,
        logo: logoUrl
      }));
      
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          id: 'homepage',
          settings: settings 
        });

      if (error) throw error;
      toast.success('Homepage settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Homepage Content</h2>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Featured Articles</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Understanding Size Differences Article</label>
              <Select 
                value={settings.featuredArticles.understanding}
                onValueChange={(value) => handleArticleSelect('understanding', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select article" />
                </SelectTrigger>
                <SelectContent>
                  {blogPosts?.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shopping Guide Article</label>
              <Select 
                value={settings.featuredArticles.shopping}
                onValueChange={(value) => handleArticleSelect('shopping', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select article" />
                </SelectTrigger>
                <SelectContent>
                  {blogPosts?.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size Comparison Article</label>
              <Select 
                value={settings.featuredArticles.comparison}
                onValueChange={(value) => handleArticleSelect('comparison', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select article" />
                </SelectTrigger>
                <SelectContent>
                  {blogPosts?.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Logo Management</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {settings.logo && (
                <img 
                  src={settings.logo} 
                  alt="Current logo" 
                  className="h-12 w-auto object-contain"
                />
              )}
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <label className="cursor-pointer">
                  Upload New Logo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size: 200x60px, Max size: 2MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageContentTab;
