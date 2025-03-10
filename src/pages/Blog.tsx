import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Tag, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchBlogPosts, fetchBlogTags } from '@/services/blog/publicBlogService';
import { BlogPost, BlogTag } from '@/services/blog/types';
import { format } from 'date-fns';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [postsData, tagsData] = await Promise.all([
          fetchBlogPosts(),
          fetchBlogTags()
        ]);
        setPosts(postsData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const filteredPosts = activeTag 
    ? posts.filter(post => post.tags.includes(activeTag))
    : posts;
  
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-pink-50 -z-10" />
      
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-display font-bold mb-4">Size Harmony Blog</h1>
              <p className="text-muted-foreground">
                Discover the latest insights on sizing, fashion trends, and shopping tips.
              </p>
            </motion.div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  {activeTag ? `No posts with the tag "${activeTag}" found.` : 'Check back soon for new content!'}
                </p>
                {activeTag && (
                  <button 
                    onClick={() => setActiveTag(null)}
                    className="mt-4 text-primary hover:underline"
                  >
                    View all posts
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredPosts.map(post => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card overflow-hidden flex flex-col h-full"
                  >
                    {post.featured_image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img 
                          src={post.featured_image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex gap-3 mb-3 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(post.published_at), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.read_time} min read
                          </span>
                        </div>
                        <h2 className="font-display text-xl font-semibold mb-2 hover:text-primary transition-colors">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-sm text-primary font-medium hover:underline flex items-center"
                        >
                          Read more
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-64 lg:w-80">
            <div className="sticky top-20">
              <div className="glass-card p-6 mb-6">
                <h3 className="font-display font-semibold mb-4">Blog Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeTag === null ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Posts
                  </button>
                  
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => setActiveTag(tag.name)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center ${
                        activeTag === tag.name ? 'bg-primary text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{tag.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTag === tag.name ? 'bg-white text-primary' : 'bg-gray-100'
                      }`}>
                        {tag.post_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Get Our Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay updated with the latest sizing tips and fashion trends.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded-md border"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
