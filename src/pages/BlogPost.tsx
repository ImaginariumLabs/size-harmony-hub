
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchBlogPostBySlug, fetchRelatedPosts } from '@/services/blog/publicBlogService';
import { BlogPost as BlogPostType } from '@/services/blog/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        if (!slug) return;
        
        const postData = await fetchBlogPostBySlug(slug);
        setPost(postData);
        
        if (postData) {
          const related = await fetchRelatedPosts(postData.id, postData.tags);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [slug]);
  
  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Size Harmony Blog Post',
        text: post?.excerpt || 'Check out this interesting post!',
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-pink-50 -z-10" />
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-pink-50 -z-10" />
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or might have been removed.
            </p>
            <Link to="/blog" className="text-primary font-medium hover:underline">
              ← Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen overflow-hidden">
      <Helmet>
        <title>{post.seo_title || post.title} | Size Harmony Blog</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
        <meta name="keywords" content={post.seo_keywords || post.tags.join(', ') + ', size conversion, fashion, clothing sizing'} />
        <link rel="canonical" href={`https://sizeharmony.com/blog/${post.slug}`} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://sizeharmony.com/blog/${post.slug}`} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        
        {/* Twitter card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.featured_image && <meta name="twitter:image" content={post.featured_image} />}
        
        {/* Structured data for the blog post */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://sizeharmony.com/blog/${post.slug}`
            },
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featured_image || "https://sizeharmony.com/logo.png",
            "author": {
              "@type": "Person",
              "name": post.author_name
            },
            "publisher": {
              "@type": "Organization",
              "name": "Size Harmony",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sizeharmony.com/logo.png"
              }
            },
            "datePublished": post.published_at,
            "dateModified": post.updated_at
          })}
        </script>
      </Helmet>
      
      <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-pink-50 -z-10" />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all posts
            </Link>
            
            {post.featured_image && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full object-cover h-64 md:h-96"
                />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author_name}
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.read_time} min read
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto" 
                onClick={sharePost}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className="flex items-center text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            
            <div 
              className="prose prose-purple max-w-none mb-10 blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="border-t border-b py-6 my-10">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {post.author_name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Written by {post.author_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Fashion sizing expert and content creator at Size Harmony Hub
                  </p>
                </div>
              </div>
            </div>
            
            {relatedPosts.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-display font-semibold mb-6">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map(related => (
                    <Link 
                      key={related.id}
                      to={`/blog/${related.slug}`}
                      className="glass-card p-5 transition-transform hover:scale-[1.01]"
                    >
                      <h4 className="font-medium mb-2">{related.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.excerpt}
                      </p>
                      <div className="mt-3 text-primary text-sm font-medium flex items-center group">
                        Read more
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
