
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_id: string;
  author_name: string;
  published_at: string;
  updated_at: string;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  is_published: boolean;
  read_time: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  post_count: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}
