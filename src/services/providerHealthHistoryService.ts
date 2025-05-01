/**
 * Provider Health History Service
 * 
 * This service handles fetching and managing historical health data for API providers,
 * including data aggregation, metrics calculation, and trend analysis.
 */

import { ApiProviderHealthHistory } from '../types/api';
import supabase from './supabaseClient';
import { cacheService } from './cacheService';

/**
 * Get health history for a provider
 * @param providerId The ID of the provider
 * @param timeRange The time range to fetch data for ('day', 'week', 'month')
 * @returns Array of health history records
 */
export const getProviderHealthHistory = async (
  providerId: string,
  timeRange: 'day' | 'week' | 'month' = 'week'
): Promise<ApiProviderHealthHistory[]> => {
  const cacheKey = `provider_health_history:${providerId}:${timeRange}`;
  
  return cacheService.getOrSet(cacheKey, async () => {
    try {
      // Calculate the start date based on the time range
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      
      // Fetch health history from the database
      const { data, error } = await supabase
        .from('provider_health_history')
        .select('*')
        .eq('provider_id', providerId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching provider health history:', error);
        throw error;
      }
      
      // Convert from database format to interface format
      return data.map(item => ({
        id: item.id,
        providerId: item.provider_id,
        status: item.status,
        lastChecked: item.last_checked,
        responseTime: item.response_time,
        errorMessage: item.error_message,
        successRate: item.success_rate,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error in getProviderHealthHistory:', error);
      return [];
    }
  }, 300); // Cache for 5 minutes
};

/**
 * Save health check result to history
 * @param healthData The health data to save
 * @returns True if successful, false otherwise
 */
export const saveHealthHistory = async (
  healthData: Omit<ApiProviderHealthHistory, 'id' | 'createdAt'>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('provider_health_history')
      .insert({
        provider_id: healthData.providerId,
        status: healthData.status,
        last_checked: healthData.lastChecked,
        response_time: healthData.responseTime,
        error_message: healthData.errorMessage,
        success_rate: healthData.successRate
      });
    
    if (error) {
      console.error('Error saving health history:', error);
      throw error;
    }
    
    // Clear the cache for this provider
    cacheService.delete(`provider_health_history:${healthData.providerId}:day`);
    cacheService.delete(`provider_health_history:${healthData.providerId}:week`);
    cacheService.delete(`provider_health_history:${healthData.providerId}:month`);
    
    return true;
  } catch (error) {
    console.error('Error in saveHealthHistory:', error);
    return false;
  }
};

/**
 * Calculate uptime percentage for a provider
 * @param providerId The ID of the provider
 * @param timeRange The time range to calculate for ('day', 'week', 'month')
 * @returns Uptime percentage (0-100)
 */
export const calculateUptimePercentage = async (
  providerId: string,
  timeRange: 'day' | 'week' | 'month' = 'week'
): Promise<number> => {
  try {
    const history = await getProviderHealthHistory(providerId, timeRange);
    
    if (history.length === 0) {
      return 0;
    }
    
    const operationalChecks = history.filter(h => h.status === 'operational').length;
    return (operationalChecks / history.length) * 100;
  } catch (error) {
    console.error('Error in calculateUptimePercentage:', error);
    return 0;
  }
};

/**
 * Calculate average response time for a provider
 * @param providerId The ID of the provider
 * @param timeRange The time range to calculate for ('day', 'week', 'month')
 * @returns Average response time in milliseconds
 */
export const calculateAverageResponseTime = async (
  providerId: string,
  timeRange: 'day' | 'week' | 'month' = 'week'
): Promise<number> => {
  try {
    const history = await getProviderHealthHistory(providerId, timeRange);
    
    if (history.length === 0) {
      return 0;
    }
    
    const totalResponseTime = history.reduce((sum, h) => sum + (h.responseTime || 0), 0);
    return totalResponseTime / history.length;
  } catch (error) {
    console.error('Error in calculateAverageResponseTime:', error);
    return 0;
  }
};

/**
 * Get incident count for a provider
 * @param providerId The ID of the provider
 * @param timeRange The time range to calculate for ('day', 'week', 'month')
 * @returns Number of incidents
 */
export const getIncidentCount = async (
  providerId: string,
  timeRange: 'day' | 'week' | 'month' = 'week'
): Promise<number> => {
  try {
    const history = await getProviderHealthHistory(providerId, timeRange);
    return history.filter(h => h.status !== 'operational').length;
  } catch (error) {
    console.error('Error in getIncidentCount:', error);
    return 0;
  }
};

/**
 * Get error distribution for a provider
 * @param providerId The ID of the provider
 * @param timeRange The time range to calculate for ('day', 'week', 'month')
 * @returns Object with error types as keys and counts as values
 */
export const getErrorDistribution = async (
  providerId: string,
  timeRange: 'day' | 'week' | 'month' = 'week'
): Promise<Record<string, number>> => {
  try {
    const history = await getProviderHealthHistory(providerId, timeRange);
    
    const errorCounts: Record<string, number> = {};
    
    history.forEach(h => {
      if (h.errorMessage) {
        const errorType = h.errorMessage.includes('Rate limited') 
          ? 'Rate Limited' 
          : h.errorMessage.includes('HTTP 5') 
            ? 'Server Error' 
            : h.errorMessage.includes('HTTP 4') 
              ? 'Client Error' 
              : 'Other Error';
        
        errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
      }
    });
    
    return errorCounts;
  } catch (error) {
    console.error('Error in getErrorDistribution:', error);
    return {};
  }
};

/**
 * Get health metrics for all providers
 * @param timeRange The time range to calculate for ('day', 'week', 'month')
 * @returns Object with provider IDs as keys and metrics as values
 */
export const getAllProvidersHealthMetrics = async (
  timeRange: 'day' | 'week' | 'month' = 'week'
): Promise<Record<string, {
  uptime: number;
  avgResponseTime: number;
  incidentCount: number;
  currentStatus: string;
}>> => {
  const cacheKey = `all_providers_health_metrics:${timeRange}`;
  
  return cacheService.getOrSet(cacheKey, async () => {
    try {
      // Get all provider IDs
      const { data: providers, error: providersError } = await supabase
        .from('api_providers')
        .select('id');
      
      if (providersError) {
        console.error('Error fetching providers:', providersError);
        throw providersError;
      }
      
      const result: Record<string, {
        uptime: number;
        avgResponseTime: number;
        incidentCount: number;
        currentStatus: string;
      }> = {};
      
      // Calculate metrics for each provider
      for (const provider of providers) {
        const history = await getProviderHealthHistory(provider.id, timeRange);
        
        if (history.length === 0) {
          result[provider.id] = {
            uptime: 0,
            avgResponseTime: 0,
            incidentCount: 0,
            currentStatus: 'unknown'
          };
          continue;
        }
        
        const operationalChecks = history.filter(h => h.status === 'operational').length;
        const uptime = (operationalChecks / history.length) * 100;
        
        const totalResponseTime = history.reduce((sum, h) => sum + (h.responseTime || 0), 0);
        const avgResponseTime = totalResponseTime / history.length;
        
        const incidentCount = history.filter(h => h.status !== 'operational').length;
        
        result[provider.id] = {
          uptime,
          avgResponseTime,
          incidentCount,
          currentStatus: history[0].status
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error in getAllProvidersHealthMetrics:', error);
      return {};
    }
  }, 300); // Cache for 5 minutes
};
