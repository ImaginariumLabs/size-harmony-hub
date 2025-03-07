
export interface AdData {
  name: string;
  slot: string;
  link: string;
  image: File | null;
  active: boolean;
}

export const AD_SLOTS = [
  { id: 'featured-premium', name: 'Featured - Premium Selection' },
  { id: 'featured-trending', name: 'Featured - Trending Now' },
  { id: 'featured-rated', name: 'Featured - Best Rated' },
  { id: 'sidebar', name: 'Sidebar Ads' },
  { id: 'banner', name: 'Banner Ads' },
  { id: 'footer', name: 'Footer Ads' }
];
