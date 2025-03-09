
import { BlogPost, BlogTag } from './types';

// Sample blog posts for offline mode
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Size Differences Across Popular Clothing Brands',
    slug: 'understanding-size-differences-across-popular-clothing-brands',
    excerpt: 'Explore why sizes vary so much between brands and how to find your perfect fit regardless of the label.',
    content: `
      <p>If you've ever found yourself puzzled by how you can be a small in one store and a large in another, you're not alone. Size inconsistency across brands is one of the most frustrating aspects of clothing shopping, especially online.</p>
      
      <h2>Why Do Sizes Vary So Much?</h2>
      
      <p>There are several reasons why clothing sizes are inconsistent across brands:</p>
      
      <ul>
        <li><strong>Vanity Sizing</strong>: Many brands deliberately label their clothes with smaller sizes to make customers feel better about themselves.</li>
        <li><strong>Target Demographics</strong>: Brands design for different body types based on their target customers.</li>
        <li><strong>International Differences</strong>: A US medium is different from a UK medium or an EU medium.</li>
        <li><strong>No Standardization</strong>: Unlike many industries, there's no universal standard that clothing manufacturers must follow.</li>
      </ul>
      
      <h2>How to Find Your Size Across Different Brands</h2>
      
      <p>The most reliable way to navigate size discrepancies is to know your measurements and how they correspond to each brand's size chart. Here are some tips:</p>
      
      <ol>
        <li>Measure yourself accurately with a soft measuring tape.</li>
        <li>Always check the size chart for each brand before purchasing.</li>
        <li>Remember that your size can vary not just between brands but between different styles from the same brand.</li>
        <li>Use Size Harmony Hub to convert your measurements to the right size for each brand!</li>
      </ol>
      
      <p>By focusing on measurements rather than size labels, you can shop more confidently and reduce the likelihood of returns due to sizing issues.</p>
    `,
    author_id: 'author1',
    author_name: 'Emily Johnson',
    published_at: '2023-09-15T08:00:00Z',
    updated_at: '2023-09-15T08:00:00Z',
    tags: ['Size Guide', 'Shopping Tips', 'Fashion Brands'],
    seo_title: 'Understanding Brand Size Differences | Size Harmony Hub',
    seo_description: 'Learn why clothing sizes vary between brands and how to find your perfect fit regardless of the size label. Expert sizing advice from Size Harmony Hub.',
    seo_keywords: 'clothing size differences, brand size inconsistency, vanity sizing, how to find your size',
    is_published: true,
    read_time: 6,
    featured_image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'
  },
  {
    id: '2',
    title: 'The Complete Guide to Taking Body Measurements Correctly',
    slug: 'complete-guide-to-taking-body-measurements-correctly',
    excerpt: 'Learn how to take accurate body measurements at home with this step-by-step guide for finding your perfect fit.',
    content: `
      <p>Accurate body measurements are the foundation of finding clothes that fit well. Whether you're shopping online or using our size converter, knowing exactly how to measure yourself is essential.</p>
      
      <h2>Essential Tools</h2>
      
      <p>Before you start, make sure you have:</p>
      <ul>
        <li>A soft measuring tape</li>
        <li>A mirror (or a friend to help)</li>
        <li>Fitted clothing or underwear to measure over</li>
      </ul>
      
      <h2>Bust/Chest Measurement</h2>
      
      <p>The bust or chest measurement is one of the most important for tops, dresses, and outerwear:</p>
      
      <ol>
        <li>Stand straight with your arms relaxed at your sides</li>
        <li>Wrap the measuring tape around the fullest part of your bust/chest</li>
        <li>Make sure the tape is parallel to the floor and not too tight</li>
        <li>Take a normal breath before reading the measurement</li>
      </ol>
      
      <h2>Waist Measurement</h2>
      
      <p>For bottoms and dresses, your natural waist measurement is key:</p>
      
      <ol>
        <li>Find your natural waist - it's the narrowest part of your torso, usually above your belly button</li>
        <li>Wrap the measuring tape around, keeping it parallel to the floor</li>
        <li>Don't suck in or push out - maintain a natural posture</li>
      </ol>
      
      <p>Remember, taking measurements correctly is the first step to finding clothes that fit perfectly every time!</p>
    `,
    author_id: 'author2',
    author_name: 'Michael Chen',
    published_at: '2023-10-03T10:30:00Z',
    updated_at: '2023-10-04T14:15:00Z',
    tags: ['Measurement Guide', 'Shopping Tips', 'Fit Advice'],
    seo_title: 'How to Take Body Measurements Correctly | Size Harmony Hub',
    seo_description: 'Learn how to take accurate body measurements at home with our step-by-step guide. Get the perfect fit every time with Size Harmony Hub.',
    seo_keywords: 'how to measure body, accurate measurements, bust measurement, waist measurement, hip measurement',
    is_published: true,
    read_time: 8,
    featured_image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86'
  },
  {
    id: '3',
    title: 'How to Shop for Clothes Online Without Returns',
    slug: 'how-to-shop-for-clothes-online-without-returns',
    excerpt: 'Minimize the hassle of returns with these expert tips for successful online clothing shopping.',
    content: `
      <p>Online shopping has revolutionized the way we buy clothes, but it's also introduced the frustration of returns due to poor fit. Here's how to minimize returns and shop more confidently.</p>
      
      <h2>Know Your Measurements</h2>
      
      <p>This is the foundation of successful online shopping:</p>
      <ul>
        <li>Update your measurements regularly - bodies change!</li>
        <li>Keep a record of your measurements in both inches and centimeters</li>
        <li>Measure wearing similar undergarments to what you'd wear with the new clothes</li>
      </ul>
      
      <h2>Research Brand Sizing</h2>
      
      <p>Different brands have different sizing standards:</p>
      <ul>
        <li>Check customer reviews for sizing feedback</li>
        <li>Look for phrases like "runs small" or "true to size"</li>
        <li>Use Size Harmony Hub to convert your measurements to the right size for each brand</li>
      </ul>
      
      <h2>Understand Fabric and Cut</h2>
      
      <p>Material and design impact how a garment fits:</p>
      <ul>
        <li>Stretchy fabrics (like jersey or those with elastane) offer more flexibility in sizing</li>
        <li>Structured garments (like tailored blazers) need to be closer to your exact measurements</li>
        <li>Pay attention to "relaxed," "slim," or "regular" fit descriptions</li>
      </ul>
      
      <p>By approaching online shopping methodically, you can dramatically reduce the need for returns and enjoy a wardrobe that fits perfectly!</p>
    `,
    author_id: 'author1',
    author_name: 'Emily Johnson',
    published_at: '2023-10-20T09:45:00Z',
    updated_at: '2023-10-21T11:30:00Z',
    tags: ['Shopping Tips', 'Online Shopping', 'Fit Advice'],
    seo_title: 'How to Shop Online Without Returns | Size Harmony Hub',
    seo_description: 'Learn expert tips for shopping clothes online without the hassle of returns. Find the perfect fit every time with Size Harmony Hub.',
    seo_keywords: 'online shopping tips, avoid clothing returns, find right size online, size guide',
    is_published: true,
    read_time: 7,
    featured_image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd'
  }
];

// Sample blog tags for offline mode
export const mockBlogTags: BlogTag[] = [
  { id: '1', name: 'Size Guide', slug: 'size-guide', post_count: 1 },
  { id: '2', name: 'Shopping Tips', slug: 'shopping-tips', post_count: 3 },
  { id: '3', name: 'Fashion Brands', slug: 'fashion-brands', post_count: 1 },
  { id: '4', name: 'Measurement Guide', slug: 'measurement-guide', post_count: 1 },
  { id: '5', name: 'Fit Advice', slug: 'fit-advice', post_count: 2 },
  { id: '6', name: 'Online Shopping', slug: 'online-shopping', post_count: 1 }
];
