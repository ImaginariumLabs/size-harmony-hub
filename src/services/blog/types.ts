
// Re-export all blog-related types from the models directory
export * from '@/models/blog';

// Add any service-specific types that aren't in the models
export interface BlogServiceOptions {
  limit?: number;
  offset?: number;
  filterByTag?: string;
  searchTerm?: string;
}
