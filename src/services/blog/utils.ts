
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConnected } from '@/lib/supabase';

/**
 * Helper function to handle database query errors consistently
 */
export async function handleDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T,
  errorMessage: string
): Promise<T> {
  try {
    const connected = await isSupabaseConnected();
    
    if (!connected) {
      console.log(`Using mock data (Supabase not connected): ${errorMessage}`);
      return fallbackValue;
    }
    
    return await queryFn();
  } catch (e) {
    console.error(`Unexpected error: ${errorMessage}`, e);
    return fallbackValue;
  }
}

/**
 * Format a slug from a title string
 */
export function formatSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Calculate estimated read time for blog content
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
