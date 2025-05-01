/**
 * Custom Provider Service
 *
 * This service handles the management of custom API providers, including
 * CRUD operations, validation, and integration with the Supabase database.
 */

import supabase from './supabaseClient';
import { ApiProvider, ApiProviderConfig, ApiProviderHealth } from '../types/api';

/**
 * Fetch all custom API providers from the database
 */
export const fetchCustomProviders = async (): Promise<ApiProvider[]> => {
  try {
    const { data, error } = await supabase
      .from('api_providers')
      .select('*')
      .eq('is_custom', true);

    if (error) {
      console.error('Error fetching custom providers:', error);
      throw error;
    }

    return data.map(provider => ({
      id: provider.id,
      slug: provider.slug,
      name: provider.name,
      description: provider.description || '',
      icon: provider.icon || 'default-api-icon.svg',
      color: provider.color || '#808080',
      isConfigured: false, // This will be updated by the ApiProviderContext
      isCustom: true,
      baseUrl: provider.base_url,
      authType: provider.auth_type as 'bearer' | 'key' | 'basic',
      healthStatus: 'unknown'
    }));
  } catch (error) {
    console.error('Error in fetchCustomProviders:', error);
    return [];
  }
};

/**
 * Create a new custom API provider
 */
export const createCustomProvider = async (provider: Partial<ApiProviderConfig>): Promise<ApiProvider | null> => {
  try {
    // Validate required fields
    if (!provider.slug || !provider.name || !provider.baseUrl || !provider.authType) {
      throw new Error('Missing required fields for custom provider');
    }

    // Check if provider slug already exists
    const { data: existingProvider } = await supabase
      .from('api_providers')
      .select('slug')
      .eq('slug', provider.slug)
      .single();

    if (existingProvider) {
      throw new Error(`Provider with slug ${provider.slug} already exists`);
    }

    // Insert the new provider
    const { data, error } = await supabase
      .from('api_providers')
      .insert({
        id: provider.id,
        name: provider.name,
        description: provider.description || '',
        is_custom: true,
        base_url: provider.baseUrl,
        auth_type: provider.authType,
        usage_endpoint: provider.usageEndpoint,
        cost_endpoint: provider.costEndpoint,
        response_mapping: provider.responseMapping,
        rate_limits: provider.rateLimits,
        icon: 'custom-api-icon.svg',
        color: '#808080'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating custom provider:', error);
      throw error;
    }

    // Return the created provider
    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description || '',
      icon: data.icon || 'default-api-icon.svg',
      color: data.color || '#808080',
      isConfigured: false,
      isCustom: true,
      baseUrl: data.base_url,
      authType: data.auth_type as 'bearer' | 'key' | 'basic',
      healthStatus: 'unknown'
    };
  } catch (error) {
    console.error('Error in createCustomProvider:', error);
    return null;
  }
};

/**
 * Update an existing custom API provider
 */
export const updateCustomProvider = async (
  providerId: string,
  updates: Partial<ApiProviderConfig>
): Promise<ApiProvider | null> => {
  try {
    // Validate that this is a custom provider
    const { data: existingProvider } = await supabase
      .from('api_providers')
      .select('*')
      .eq('id', providerId)
      .eq('is_custom', true)
      .single();

    if (!existingProvider) {
      throw new Error(`Custom provider with ID ${providerId} not found or is not a custom provider`);
    }

    // Prepare update object
    const updateData: Record<string, string | unknown> = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.baseUrl) updateData.base_url = updates.baseUrl;
    if (updates.authType) updateData.auth_type = updates.authType;
    if (updates.usageEndpoint) updateData.usage_endpoint = updates.usageEndpoint;
    if (updates.costEndpoint) updateData.cost_endpoint = updates.costEndpoint;
    if (updates.responseMapping) updateData.response_mapping = updates.responseMapping;
    if (updates.rateLimits) updateData.rate_limits = updates.rateLimits;

    // Update the provider
    const { data, error } = await supabase
      .from('api_providers')
      .update(updateData)
      .eq('id', providerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating custom provider:', error);
      throw error;
    }

    // Return the updated provider
    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description || '',
      icon: data.icon || 'default-api-icon.svg',
      color: data.color || '#808080',
      isConfigured: false, // This will be updated by the ApiProviderContext
      isCustom: true,
      baseUrl: data.base_url,
      authType: data.auth_type as 'bearer' | 'key' | 'basic',
      healthStatus: 'unknown'
    };
  } catch (error) {
    console.error('Error in updateCustomProvider:', error);
    return null;
  }
};

/**
 * Delete a custom API provider
 */
export const deleteCustomProvider = async (providerId: string): Promise<boolean> => {
  try {
    // Validate that this is a custom provider
    const { data: existingProvider } = await supabase
      .from('api_providers')
      .select('is_custom')
      .eq('id', providerId)
      .single();

    if (!existingProvider || !existingProvider.is_custom) {
      throw new Error(`Provider with ID ${providerId} not found or is not a custom provider`);
    }

    // Delete the provider
    const { error } = await supabase
      .from('api_providers')
      .delete()
      .eq('id', providerId);

    if (error) {
      console.error('Error deleting custom provider:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCustomProvider:', error);
    return false;
  }
};

/**
 * Get detailed configuration for a provider
 */
export const getProviderConfig = async (providerId: string): Promise<ApiProviderConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('api_providers')
      .select('*')
      .eq('id', providerId)
      .single();

    if (error) {
      console.error('Error fetching provider config:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      baseUrl: data.base_url,
      authType: data.auth_type as 'bearer' | 'key' | 'basic',
      usageEndpoint: data.usage_endpoint || '',
      costEndpoint: data.cost_endpoint,
      healthEndpoint: data.health_endpoint,
      responseMapping: data.response_mapping || { usage: [] },
      rateLimits: data.rate_limits
    };
  } catch (error) {
    console.error('Error in getProviderConfig:', error);
    return null;
  }
};

/**
 * Test a custom provider configuration
 * This makes a test request to validate the configuration
 */
export const testProviderConfig = async (
  config: ApiProviderConfig,
  apiKey: string
): Promise<{ success: boolean; message: string; data?: unknown }> => {
  try {
    // Validate required fields
    if (!config.baseUrl || !config.usageEndpoint || !config.authType) {
      return {
        success: false,
        message: 'Missing required configuration fields'
      };
    }

    // Construct the request URL
    const url = `${config.baseUrl}${config.usageEndpoint}`;

    // Set up headers based on auth type
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (config.authType === 'bearer') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (config.authType === 'key') {
      headers['X-API-Key'] = apiKey;
    } else if (config.authType === 'basic') {
      headers['Authorization'] = `Basic ${btoa(apiKey)}`;
    }

    // Make the test request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      return {
        success: false,
        message: `API request failed with status ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Provider configuration test successful',
      data
    };
  } catch (error) {
    console.error('Error testing provider config:', error);
    return {
      success: false,
      message: `Error testing provider: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Update provider health status
 */
export const updateProviderHealth = async (
  providerId: string,
  health: Partial<ApiProviderHealth>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('provider_health')
      .upsert({
        provider_id: providerId,
        status: health.status || 'unknown',
        last_checked: new Date().toISOString(),
        response_time: health.responseTime,
        error_message: health.errorMessage,
        success_rate: health.successRate
      });

    if (error) {
      console.error('Error updating provider health:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProviderHealth:', error);
    return false;
  }
};

/**
 * Get health status for all providers
 */
export const getAllProviderHealth = async (): Promise<Record<string, ApiProviderHealth>> => {
  try {
    const { data, error } = await supabase
      .from('provider_health')
      .select('*');

    if (error) {
      console.error('Error fetching provider health:', error);
      throw error;
    }

    const result: Record<string, ApiProviderHealth> = {};

    data.forEach(item => {
      result[item.provider_id] = {
        providerId: item.provider_id,
        status: item.status as 'operational' | 'degraded' | 'outage' | 'unknown',
        lastChecked: item.last_checked,
        responseTime: item.response_time,
        errorMessage: item.error_message,
        successRate: item.success_rate
      };
    });

    return result;
  } catch (error) {
    console.error('Error in getAllProviderHealth:', error);
    return {};
  }
};
