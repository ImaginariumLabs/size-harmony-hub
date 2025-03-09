
import { BlogPost } from './types';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConnected } from '@/lib/supabase';
import { mockBlogPosts } from './mockData';
import { handleDbQuery } from './utils';

/**
 * Fetch all blog posts for admin (including unpublished)
 */
export const fetchAllBlogPostsAdmin = async (): Promise<BlogPost[]> => {
  return handleDbQuery(
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts for admin:', error);
        return mockBlogPosts;
      }
      
      return data as BlogPost[] || mockBlogPosts;
    },
    [...mockBlogPosts, {
      ...mockBlogPosts[0],
      id: '4',
      title: '[Draft] Upcoming Fashion Trends for 2024',
      slug: 'upcoming-fashion-trends-2024',
      is_published: false,
      published_at: new Date().toISOString()
    }],
    'fetching blog posts for admin'
  );
};

/**
 * Save or update a blog post
 */
export const saveBlogPost = async (post: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Post saved locally (Supabase not connected)');
      return {
        ...mockBlogPosts[0],
        ...post,
        id: post.id || `mock-${Date.now()}`,
        updated_at: new Date().toISOString()
      } as BlogPost;
    }
    
    // Ensure required fields have values
    const postData: any = {
      ...post
    };
    
    // If id exists, update existing post, otherwise insert new one
    let operation;
    if (post.id) {
      operation = supabase
        .from('blog_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);
    } else {
      // For new posts, ensure required fields are present
      const requiredFields = {
        title: post.title || 'Untitled Post',
        slug: post.slug || `post-${Date.now()}`,
        excerpt: post.excerpt || '',
        content: post.content || '',
        author_id: post.author_id || 'author1',
        author_name: post.author_name || 'Anonymous',
        published_at: post.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      operation = supabase
        .from('blog_posts')
        .insert({
          ...postData,
          ...requiredFields
        });
    }
    
    const { data, error } = await operation.select().single();
    
    if (error) {
      console.error('Error saving blog post:', error);
      throw error;
    }
    
    return data as BlogPost;
  } catch (e) {
    console.error('Error saving blog post:', e);
    return null;
  }
};

/**
 * Delete a blog post
 */
export const deleteBlogPost = async (postId: string): Promise<boolean> => {
  try {
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log('Simulating post deletion (Supabase not connected)');
      return true;
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Error deleting blog post:', e);
    return false;
  }
};
