/**
 * Alert Service
 *
 * This service handles usage alerts and notifications for API providers,
 * including threshold alerts, rate limit warnings, and cost forecasts.
 */


import supabase from './supabaseClient';
import { cacheService } from './cacheService';

/**
 * Alert types
 */
export enum AlertType {
  RATE_LIMIT = 'rate_limit',
  USAGE_THRESHOLD = 'usage_threshold',
  COST_THRESHOLD = 'cost_threshold',
  PROVIDER_HEALTH = 'provider_health',
  SYSTEM = 'system'
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Alert interface
 */
export interface Alert {
  id?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  providerId?: string;
  userId?: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Alert threshold configuration
 */
export interface AlertThreshold {
  id?: string;
  userId: string;
  providerId?: string;
  type: AlertType;
  threshold: number; // Percentage or absolute value
  enabled: boolean;
  notifyEmail: boolean;
  notifyInApp: boolean;
  severity?: AlertSeverity; // Optional severity level
  timeFrame?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'; // Optional time frame
  comparisonType?: 'absolute' | 'percentage' | 'forecast'; // How to compare the threshold
  quietHoursStart?: string; // Time in 24h format (HH:MM)
  quietHoursEnd?: string; // Time in 24h format (HH:MM)
  description?: string; // Optional description
}

/**
 * Create a new alert
 */
export const createAlert = async (alert: Omit<Alert, 'id' | 'timestamp' | 'read' | 'dismissed'>): Promise<Alert | null> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        provider_id: alert.providerId,
        user_id: alert.userId,
        timestamp: new Date().toISOString(),
        read: false,
        dismissed: false,
        action_url: alert.actionUrl,
        metadata: alert.metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      throw error;
    }

    // Clear the alerts cache
    cacheService.remove('user_alerts');

    // Convert from database format to interface format
    return {
      id: data.id,
      type: data.type,
      severity: data.severity,
      title: data.title,
      message: data.message,
      providerId: data.provider_id,
      userId: data.user_id,
      timestamp: data.timestamp,
      read: data.read,
      dismissed: data.dismissed,
      actionUrl: data.action_url,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error in createAlert:', error);
    return null;
  }
};

/**
 * Get alerts for a user
 */
export const getUserAlerts = async (userId: string, includeRead: boolean = false): Promise<Alert[]> => {
  return cacheService.getOrSet(`user_alerts:${userId}:${includeRead}`, async () => {
    try {
      let query = supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (!includeRead) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user alerts:', error);
        throw error;
      }

      // Convert from database format to interface format
      return data.map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        providerId: alert.provider_id,
        userId: alert.user_id,
        timestamp: alert.timestamp,
        read: alert.read,
        dismissed: alert.dismissed,
        actionUrl: alert.action_url,
        metadata: alert.metadata
      }));
    } catch (error) {
      console.error('Error in getUserAlerts:', error);
      return [];
    }
  }, 60); // Cache for 1 minute
};

/**
 * Get all alerts (admin only)
 */
export const getAllAlerts = async (): Promise<Alert[]> => {
  return cacheService.getOrSet('all_alerts', async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching all alerts:', error);
        throw error;
      }

      // Convert from database format to interface format
      return data.map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        providerId: alert.provider_id,
        userId: alert.user_id,
        timestamp: alert.timestamp,
        read: alert.read,
        dismissed: alert.dismissed,
        actionUrl: alert.action_url,
        metadata: alert.metadata
      }));
    } catch (error) {
      console.error('Error in getAllAlerts:', error);
      return [];
    }
  }, 60); // Cache for 1 minute
};

/**
 * Mark an alert as read
 */
export const markAlertAsRead = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('id', alertId);

    if (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }

    // Clear the alerts cache
    cacheService.remove('user_alerts');

    return true;
  } catch (error) {
    console.error('Error in markAlertAsRead:', error);
    return false;
  }
};

/**
 * Dismiss an alert
 */
export const dismissAlert = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ dismissed: true })
      .eq('id', alertId);

    if (error) {
      console.error('Error dismissing alert:', error);
      throw error;
    }

    // Clear the alerts cache
    cacheService.remove('user_alerts');
    cacheService.remove('all_alerts');

    return true;
  } catch (error) {
    console.error('Error in dismissAlert:', error);
    return false;
  }
};

/**
 * Mark all alerts as read
 */
export const markAllAlertsAsRead = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('read', false);

    if (error) {
      console.error('Error marking all alerts as read:', error);
      throw error;
    }

    // Clear the alerts cache
    cacheService.remove('user_alerts');
    cacheService.remove('all_alerts');

    return true;
  } catch (error) {
    console.error('Error in markAllAlertsAsRead:', error);
    return false;
  }
};

/**
 * Dismiss all alerts
 */
export const dismissAllAlerts = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ dismissed: true })
      .eq('dismissed', false);

    if (error) {
      console.error('Error dismissing all alerts:', error);
      throw error;
    }

    // Clear the alerts cache
    cacheService.remove('user_alerts');
    cacheService.remove('all_alerts');

    return true;
  } catch (error) {
    console.error('Error in dismissAllAlerts:', error);
    return false;
  }
};

/**
 * Get alert thresholds for a user
 */
export const getUserAlertThresholds = async (userId: string): Promise<AlertThreshold[]> => {
  try {
    const { data, error } = await supabase
      .from('alert_thresholds')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user alert thresholds:', error);
      throw error;
    }

    // Convert from database format to interface format
    return data.map(threshold => ({
      id: threshold.id,
      userId: threshold.user_id,
      providerId: threshold.provider_id,
      type: threshold.type,
      threshold: threshold.threshold,
      enabled: threshold.enabled,
      notifyEmail: threshold.notify_email,
      notifyInApp: threshold.notify_in_app,
      severity: threshold.severity,
      timeFrame: threshold.time_frame,
      comparisonType: threshold.comparison_type,
      quietHoursStart: threshold.quiet_hours_start,
      quietHoursEnd: threshold.quiet_hours_end,
      description: threshold.description
    }));
  } catch (error) {
    console.error('Error in getUserAlertThresholds:', error);
    return [];
  }
};

/**
 * Create or update an alert threshold
 */
export const saveAlertThreshold = async (threshold: AlertThreshold): Promise<AlertThreshold | null> => {
  try {
    const thresholdData = {
      user_id: threshold.userId,
      provider_id: threshold.providerId,
      type: threshold.type,
      threshold: threshold.threshold,
      enabled: threshold.enabled,
      notify_email: threshold.notifyEmail,
      notify_in_app: threshold.notifyInApp,
      severity: threshold.severity,
      time_frame: threshold.timeFrame,
      comparison_type: threshold.comparisonType,
      quiet_hours_start: threshold.quietHoursStart,
      quiet_hours_end: threshold.quietHoursEnd,
      description: threshold.description
    };

    let result;

    if (threshold.id) {
      // Update existing threshold
      const { data, error } = await supabase
        .from('alert_thresholds')
        .update(thresholdData)
        .eq('id', threshold.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating alert threshold:', error);
        throw error;
      }

      result = data;
    } else {
      // Create new threshold
      const { data, error } = await supabase
        .from('alert_thresholds')
        .insert(thresholdData)
        .select()
        .single();

      if (error) {
        console.error('Error creating alert threshold:', error);
        throw error;
      }

      result = data;
    }

    // Convert from database format to interface format
    return {
      id: result.id,
      userId: result.user_id,
      providerId: result.provider_id,
      type: result.type,
      threshold: result.threshold,
      enabled: result.enabled,
      notifyEmail: result.notify_email,
      notifyInApp: result.notify_in_app,
      severity: result.severity,
      timeFrame: result.time_frame,
      comparisonType: result.comparison_type,
      quietHoursStart: result.quiet_hours_start,
      quietHoursEnd: result.quiet_hours_end,
      description: result.description
    };
  } catch (error) {
    console.error('Error in saveAlertThreshold:', error);
    return null;
  }
};

/**
 * Delete an alert threshold
 */
export const deleteAlertThreshold = async (thresholdId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alert_thresholds')
      .delete()
      .eq('id', thresholdId);

    if (error) {
      console.error('Error deleting alert threshold:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAlertThreshold:', error);
    return false;
  }
};

/**
 * Check for usage threshold alerts
 */
export const checkUsageThresholds = async (userId: string, providerId: string, usagePercentage: number): Promise<void> => {
  try {
    // Get thresholds for this user and provider
    const thresholds = await getUserAlertThresholds(userId);
    const usageThresholds = thresholds.filter(t =>
      t.enabled &&
      t.type === AlertType.USAGE_THRESHOLD &&
      (t.providerId === providerId || !t.providerId) &&
      t.threshold <= usagePercentage
    );

    // Create alerts for each threshold exceeded
    for (const threshold of usageThresholds) {
      const provider = await getProviderName(providerId);

      await createAlert({
        type: AlertType.USAGE_THRESHOLD,
        severity: usagePercentage >= 90 ? AlertSeverity.ERROR : AlertSeverity.WARNING,
        title: `Usage Threshold Alert: ${provider}`,
        message: `Your usage for ${provider} has reached ${usagePercentage}%, which exceeds your threshold of ${threshold.threshold}%.`,
        providerId,
        userId,
        actionUrl: `/provider/${providerId}`,
        metadata: {
          usagePercentage,
          threshold: threshold.threshold
        }
      });
    }
  } catch (error) {
    console.error('Error in checkUsageThresholds:', error);
  }
};

/**
 * Check for cost threshold alerts
 */
export const checkCostThresholds = async (userId: string, providerId: string, currentCost: number): Promise<void> => {
  try {
    // Get thresholds for this user and provider
    const thresholds = await getUserAlertThresholds(userId);
    const costThresholds = thresholds.filter(t =>
      t.enabled &&
      t.type === AlertType.COST_THRESHOLD &&
      (t.providerId === providerId || !t.providerId) &&
      t.threshold <= currentCost
    );

    // Create alerts for each threshold exceeded
    for (const threshold of costThresholds) {
      const provider = await getProviderName(providerId);

      await createAlert({
        type: AlertType.COST_THRESHOLD,
        severity: AlertSeverity.WARNING,
        title: `Cost Threshold Alert: ${provider}`,
        message: `Your cost for ${provider} has reached $${currentCost.toFixed(2)}, which exceeds your threshold of $${threshold.threshold.toFixed(2)}.`,
        providerId,
        userId,
        actionUrl: `/admin/provider-analytics/${providerId}`,
        metadata: {
          currentCost,
          threshold: threshold.threshold
        }
      });
    }
  } catch (error) {
    console.error('Error in checkCostThresholds:', error);
  }
};

/**
 * Create a rate limit alert
 */
export const createRateLimitAlert = async (userId: string, providerId: string): Promise<void> => {
  try {
    const provider = await getProviderName(providerId);

    await createAlert({
      type: AlertType.RATE_LIMIT,
      severity: AlertSeverity.ERROR,
      title: `Rate Limit Alert: ${provider}`,
      message: `Your API requests to ${provider} are being rate limited. Consider reducing your request frequency or upgrading your plan.`,
      providerId,
      userId,
      actionUrl: `/admin/provider-analytics/${providerId}`,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in createRateLimitAlert:', error);
  }
};

/**
 * Create a provider health alert
 */
export const createProviderHealthAlert = async (userId: string, providerId: string, status: string, errorMessage?: string): Promise<void> => {
  try {
    const provider = await getProviderName(providerId);

    await createAlert({
      type: AlertType.PROVIDER_HEALTH,
      severity: status === 'degraded' ? AlertSeverity.WARNING : AlertSeverity.ERROR,
      title: `Provider Health Alert: ${provider}`,
      message: `${provider} is experiencing issues: ${status}${errorMessage ? ' - ' + errorMessage : ''}`,
      providerId,
      userId,
      actionUrl: `/admin/api-providers?tab=2`,
      metadata: {
        status,
        errorMessage
      }
    });
  } catch (error) {
    console.error('Error in createProviderHealthAlert:', error);
  }
};

/**
 * Create a system alert
 */
export const createSystemAlert = async (userId: string, title: string, message: string, severity: AlertSeverity = AlertSeverity.INFO): Promise<void> => {
  try {
    await createAlert({
      type: AlertType.SYSTEM,
      severity,
      title,
      message,
      userId
    });
  } catch (error) {
    console.error('Error in createSystemAlert:', error);
  }
};

/**
 * Helper function to get provider name
 */
const getProviderName = async (providerId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('api_providers')
      .select('name')
      .eq('id', providerId)
      .single();

    if (error) {
      console.error('Error fetching provider name:', error);
      return providerId;
    }

    return data.name;
  } catch (error) {
    console.error('Error in getProviderName:', error);
    return providerId;
  }
};
