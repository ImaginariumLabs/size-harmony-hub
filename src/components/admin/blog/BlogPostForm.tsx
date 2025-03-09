
import React, { useState } from 'react';
import { BlogPost } from '@/models/blog';
import { saveBlogPost } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface BlogPostFormProps {
  post: BlogPost | null;
  onSaved: (post: BlogPost) => void;
  onCancel: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onSaved, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [authorName, setAuthorName] = useState(post?.author_name || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(post?.seo_description || '');
  const [seoKeywords, setSeoKeywords] = useState(post?.seo_keywords || '');
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);
  const [readTime, setReadTime] = useState(post?.read_time?.toString() || '5');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if this is a new post or slug was not manually edited
    if (!post || post.slug === slug) {
      setSlug(generateSlug(newTitle));
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    
    if (!authorName.trim()) {
      toast.error('Author name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const postData: Partial<BlogPost> = {
        id: post?.id,
        title,
        slug,
        excerpt,
        content,
        author_id: post?.author_id || 'author1', // Default author ID for new posts
        author_name: authorName,
        featured_image: featuredImage || undefined,
        tags,
        seo_title: seoTitle || undefined,
        seo_description: seoDescription || undefined,
        seo_keywords: seoKeywords || undefined,
        is_published: isPublished,
        read_time: parseInt(readTime) || 5,
        published_at: post?.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const savedPost = await saveBlogPost(postData);
      
      if (savedPost) {
        onSaved(savedPost);
      } else {
        toast.error('Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter blog post title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="url-friendly-title"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            URL-friendly version of the title. Will be used in the URL.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={2}
            placeholder="Brief summary of the blog post"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md font-mono text-sm"
            rows={10}
            placeholder="HTML content of the blog post"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use HTML tags for formatting.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Author's name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL
            </label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 border rounded-l-md"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <div 
                  key={tag} 
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="SEO-optimized title (if different from post title)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Read Time (minutes)
            </label>
            <input
              type="number"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              min="1"
              max="60"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Description
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={2}
            placeholder="Meta description for search engines"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Keywords
          </label>
          <input
            type="text"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Comma-separated keywords"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is-published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label htmlFor="is-published" className="ml-2 block text-sm text-gray-900">
            Publish immediately
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            post ? 'Update Post' : 'Create Post'
          )}
        </Button>
      </div>
    </form>
  );
};

export default BlogPostForm;
