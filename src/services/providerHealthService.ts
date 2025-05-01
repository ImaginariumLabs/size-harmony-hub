/**
 * Provider Health Service
 *
 * This service handles monitoring the health status of API providers,
 * including status checks, rate limit detection, and health history.
 */

import { ApiProvider, ApiProviderHealth } from '../types/api';
import { getApiKey } from './keyManager';
import { updateProviderHealth, getAllProviderHealth } from './customProviderService';
import { cacheService } from './cacheService';
import { saveHealthHistory } from './providerHealthHistoryService';

/**
 * Check the health of a provider by making a test request
 */
export const checkProviderHealth = async (provider: ApiProvider): Promise<ApiProviderHealth> => {
  try {
    const startTime = Date.now();
    const apiKey = await getApiKey(provider.id);

    if (!apiKey) {
      return {
        providerId: provider.id,
        status: 'unknown',
        lastChecked: new Date().toISOString(),
        errorMessage: 'No API key configured'
      };
    }

    // Determine the endpoint to use for health check
    let url = '';
    const headers: Record<string, string> = {};

    // Set up headers based on auth type
    if (provider.authType === 'bearer') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (provider.authType === 'key') {
      headers['X-API-Key'] = apiKey;
    } else if (provider.authType === 'basic') {
      headers['Authorization'] = `Basic ${btoa(apiKey)}`;
    }

    // Use provider-specific health check logic
    switch (provider.id) {
      case 'openai':
        url = 'https://api.openai.com/v1/models';
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'claude':
        url = 'https://api.anthropic.com/v1/models';
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        break;
      case 'google':
        url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        break;
      default:
        // For custom providers, use their base URL and a simple endpoint
        if (provider.baseUrl) {
          url = `${provider.baseUrl}/models`;
        } else {
          throw new Error('No base URL configured for custom provider');
        }
    }

    // Make the request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Check for rate limiting
    const rateLimited = response.status === 429;
    const isSuccess = response.ok;

    // Determine status based on response
    let status: 'operational' | 'degraded' | 'outage' | 'unknown' = 'unknown';
    let errorMessage: string | undefined;

    if (isSuccess) {
      status = 'operational';
    } else if (rateLimited) {
      status = 'degraded';
      errorMessage = 'Rate limited';
    } else {
      status = 'outage';
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    // Create health status object
    const health: ApiProviderHealth = {
      providerId: provider.id,
      status,
      lastChecked: new Date().toISOString(),
      responseTime,
      errorMessage,
      successRate: isSuccess ? 100 : 0
    };

    // Save health status to database and history
    await updateProviderHealth(provider.id, health);

    // Save to health history
    await saveHealthHistory({
      providerId: provider.id,
      status: health.status,
      lastChecked: health.lastChecked,
      responseTime: health.responseTime,
      errorMessage: health.errorMessage,
      successRate: health.successRate
    });

    return health;
  } catch (error) {
    console.error(`Error checking health for provider ${provider.id}:`, error);

    // Create error health status
    const health: ApiProviderHealth = {
      providerId: provider.id,
      status: 'outage',
      lastChecked: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : String(error),
      successRate: 0
    };

    // Save health status to database and history
    await updateProviderHealth(provider.id, health);

    // Save to health history
    await saveHealthHistory({
      providerId: provider.id,
      status: health.status,
      lastChecked: health.lastChecked,
      errorMessage: health.errorMessage,
      successRate: health.successRate
    });

    return health;
  }
};

/**
 * Check health for all providers
 */
export const checkAllProvidersHealth = async (providers: ApiProvider[]): Promise<Record<string, ApiProviderHealth>> => {
  const results: Record<string, ApiProviderHealth> = {};

  // Check each provider in parallel
  const healthChecks = providers.map(provider => checkProviderHealth(provider));
  const healthResults = await Promise.allSettled(healthChecks);

  // Process results
  healthResults.forEach((result, index) => {
    const provider = providers[index];
    if (result.status === 'fulfilled') {
      results[provider.id] = result.value;
    } else {
      // If the health check itself failed
      results[provider.id] = {
        providerId: provider.id,
        status: 'unknown',
        lastChecked: new Date().toISOString(),
        errorMessage: `Failed to check health: ${result.reason}`
      };
    }
  });

  return results;
};

/**
 * Get cached health status for all providers
 */
export const getProvidersHealth = async (): Promise<Record<string, ApiProviderHealth>> => {
  return cacheService.getOrSet('providers_health', async () => {
    try {
      return await getAllProviderHealth();
    } catch (error) {
      console.error('Error getting providers health:', error);
      return {};
    }
  }, 60); // Cache for 1 minute
};

/**
 * Detect rate limiting for a provider
 */
export const detectRateLimiting = async (provider: ApiProvider): Promise<boolean> => {
  try {
    const health = await checkProviderHealth(provider);
    return health.status === 'degraded' && health.errorMessage?.includes('Rate limited');
  } catch (error) {
    console.error(`Error detecting rate limiting for provider ${provider.id}:`, error);
    return false;
  }
};

/**
 * Get rate limit warnings for all providers
 */
export const getRateLimitWarnings = async (providers: ApiProvider[]): Promise<ApiProvider[]> => {
  const health = await getProvidersHealth();

  return providers.filter(provider => {
    const providerHealth = health[provider.id];
    return providerHealth?.status === 'degraded' &&
           providerHealth.errorMessage?.includes('Rate limited');
  });
};
