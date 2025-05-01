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

  /** Slug identifier for the provider */
  slug: string;

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

  /** Whether this is a custom provider */
  isCustom?: boolean;

  /** Base URL for custom providers */
  baseUrl?: string;

  /** Authentication type for the provider */
  authType?: 'bearer' | 'key' | 'basic';

  /** Health status of the provider */
  healthStatus?: 'operational' | 'degraded' | 'outage' | 'unknown';
}

/**
 * API Provider Configuration
 *
 * Detailed configuration for an API provider.
 */
export interface ApiProviderConfig {
  /** Unique identifier for the provider */
  id: string;

  /** Slug identifier for the provider */
  slug: string;

  /** Display name of the provider */
  name: string;

  /** Description of the provider's services */
  description?: string;

  /** Base URL for API requests */
  baseUrl: string;

  /** Authentication type for the provider */
  authType: 'bearer' | 'key' | 'basic';

  /** Endpoint for usage data */
  usageEndpoint?: string;

  /** Endpoint for cost data */
  costEndpoint?: string;

  /** Endpoint for health checks */
  healthEndpoint?: string;

  /** Mapping for API responses */
  responseMapping?: unknown;

  /** Rate limits for the provider */
  rateLimits?: unknown;
}

/**
 * API Provider Health
 *
 * Health status information for an API provider.
 */
export interface ApiProviderHealth {
  /** Provider ID */
  providerId: string;

  /** Operational status */
  status: 'operational' | 'degraded' | 'outage' | 'unknown';

  /** When the health was last checked */
  lastChecked: string;

  /** Response time in milliseconds */
  responseTime?: number;

  /** Error message if any */
  errorMessage?: string;

  /** Success rate percentage */
  successRate?: number;
}

/**
 * API Usage Data
 *
 * Usage data for an API provider.
 */
export interface ApiUsageData {
  /** Provider ID */
  providerId: string;

  /** User ID */
  userId: string;

  /** Number of requests made */
  requestCount: number;

  /** Number of tokens used (for LLM APIs) */
  tokenCount?: number;

  /** Cost incurred */
  cost: number;

  /** Date of usage */
  date: string;
}

/**
 * API Key Metadata
 *
 * Metadata about an API key (the actual key is never stored in the database).
 */
export interface ApiKeyMetadata {
  /** Provider ID */
  providerId: string;

  /** User ID */
  userId: string;

  /** When the key was last used */
  lastUsed?: string;

  /** Whether the key is configured */
  isConfigured: boolean;

  /** When the key was created */
  createdAt: string;

  /** When the key was last updated */
  updatedAt: string;
}
