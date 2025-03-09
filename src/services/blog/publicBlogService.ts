
import { BlogPost, BlogTag, BlogComment } from './types';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConnected } from '@/lib/supabase';
import { mockBlogPosts, mockBlogTags } from './mockData';
import { handleDbQuery } from './utils';

/**
 * Fetch all published blog posts
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  return handleDbQuery(
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        return mockBlogPosts;
      }
      
      return data as BlogPost[] || mockBlogPosts;
    },
    mockBlogPosts,
    'fetching blog posts'
  );
};

/**
 * Fetch a single blog post by slug
 */
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  return handleDbQuery(
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching blog post:', error);
        // Fall back to mock data
        const mockPost = mockBlogPosts.find(p => p.slug === slug);
        return mockPost || null;
      }
      
      return data as BlogPost || null;
    },
    mockBlogPosts.find(p => p.slug === slug) || null,
    `fetching blog post with slug: ${slug}`
  );
};

/**
 * Fetch related posts based on tags
 */
export const fetchRelatedPosts = async (currentPostId: string, tags: string[]): Promise<BlogPost[]> => {
  return handleDbQuery(
    async () => {
      // In a real implementation, you would use Postgres's array operations to match tags
      // This is a simplified implementation
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .neq('id', currentPostId)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('Error fetching related posts:', error);
        return mockBlogPosts
          .filter(post => post.id !== currentPostId && post.tags.some(tag => tags.includes(tag)))
          .slice(0, 2);
      }
      
      // Filter for posts that share tags with the current post
      // In a real implementation, this would be done at the database level
      const relatedPosts = (data as BlogPost[])
        .filter((post: BlogPost) => post.tags.some(tag => tags.includes(tag)))
        .slice(0, 2);
      
      return relatedPosts.length > 0 ? relatedPosts : mockBlogPosts
        .filter(post => post.id !== currentPostId)
        .slice(0, 2);
    },
    mockBlogPosts
      .filter(post => post.id !== currentPostId && post.tags.some(tag => tags.includes(tag)))
      .slice(0, 2),
    `fetching related posts for post: ${currentPostId}`
  );
};

/**
 * Fetch all blog tags
 */
export const fetchBlogTags = async (): Promise<BlogTag[]> => {
  return handleDbQuery(
    async () => {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching blog tags:', error);
        return mockBlogTags;
      }
      
      return data as BlogTag[] || mockBlogTags;
    },
    mockBlogTags,
    'fetching blog tags'
  );
};

/**
 * Submit a blog comment
 */
export const submitBlogComment = async (comment: Omit<BlogComment, 'id' | 'created_at' | 'is_approved'>): Promise<BlogComment | null> => {
  try {
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Comment stored locally (Supabase not connected)');
      return {
        id: `mock-${Date.now()}`,
        ...comment,
        created_at: new Date().toISOString(),
        is_approved: false
      };
    }
    
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({ 
        ...comment, 
        is_approved: false // New comments require approval
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }
    
    return data as BlogComment;
  } catch (e) {
    console.error('Error submitting comment:', e);
    return null;
  }
};
