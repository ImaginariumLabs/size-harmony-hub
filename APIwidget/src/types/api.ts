/**
 * API Types
 * 
 * This file contains type definitions for API-related data structures.
 */

/**
 * API Cost Data
 * 
 * Represents cost and usage data for an API provider.
 */
export interface ApiCostData {
  /** Total cost or usage value */
  total: number;
  
  /** Change from previous period */
  change: number;
  
  /** Type of change (increase or decrease) */
  changeType: 'increase' | 'decrease';
  
  /** Usage percentage (0-100) relative to quota or limit */
  usagePercentage?: number;
}

/**
 * API Provider
 * 
 * Represents an API provider with its configuration and status.
 */
export interface ApiProvider {
  /** Unique identifier for the provider */
  id: string;
  
  /** Display name of the provider */
  name: string;
  
  /** Description of the provider's services */
  description: string;
  
  /** Path to the provider's icon */
  icon: string;
  
  /** Brand color for the provider */
  color: string;
  
  /** Whether the provider is configured with an API key */
  isConfigured: boolean;
  
  /** When the provider was last used */
  lastUsed?: Date;
  
  /** Usage percentage (0-100) relative to quota or limit */
  usagePercentage?: number;
}
