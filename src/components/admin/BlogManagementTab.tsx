
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fetchAllBlogPostsAdmin, deleteBlogPost } from '@/services/blog/adminBlogService';
import { BlogPost } from '@/services/blog/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import BlogPostForm from './blog/BlogPostForm';

const BlogManagementTab: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  
  useEffect(() => {
    loadPosts();
  }, []);
  
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const allPosts = await fetchAllBlogPostsAdmin();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };
  
  const openEditDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setSelectedPost(null);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPost(null);
  };
  
  const confirmDelete = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!postToDelete) return;
    
    try {
      const success = await deleteBlogPost(postToDelete);
      if (success) {
        setPosts(posts.filter(post => post.id !== postToDelete));
        toast.success('Blog post deleted successfully');
      } else {
        toast.error('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete blog post');
    } finally {
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };
  
  const onPostSaved = (savedPost: BlogPost) => {
    // If editing an existing post, update it in the list
    if (selectedPost) {
      setPosts(posts.map(post => post.id === savedPost.id ? savedPost : post));
    } else {
      // If creating a new post, add it to the list
      setPosts([savedPost, ...posts]);
    }
    
    closeDialog();
    toast.success(`Blog post ${selectedPost ? 'updated' : 'created'} successfully`);
  };
  
  const filteredPosts = posts.filter(post => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'published') return post.is_published;
    if (filterStatus === 'draft') return !post.is_published;
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Blog Management</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span className="font-medium">Filter:</span>
            <div className="ml-2 flex space-x-1">
              <Button 
                variant={filterStatus === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'published' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('published')}
              >
                <Eye className="h-3 w-3 mr-1" />
                Published
              </Button>
              <Button 
                variant={filterStatus === 'draft' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('draft')}
              >
                <EyeOff className="h-3 w-3 mr-1" />
                Drafts
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Total: {filteredPosts.length} posts
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No blog posts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{post.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {format(new Date(post.published_at), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last updated: {format(new Date(post.updated_at), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {post.author_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.is_published ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openEditDialog(post)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => confirmDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create/Edit Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          </DialogHeader>
          <BlogPostForm post={selectedPost} onSaved={onPostSaved} onCancel={closeDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagementTab;
