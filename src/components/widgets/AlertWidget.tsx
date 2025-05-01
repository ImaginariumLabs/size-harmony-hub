import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  DragIndicator as DragIndicatorIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import useRealTimeData from '../../hooks/useRealTimeData';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  provider?: string;
  acknowledged: boolean;
}

interface AlertWidgetProps {
  title?: string;
  onRemove: () => void;
  onConfigure: () => void;
  fetchAlerts: () => Promise<Alert[]>;
  onAcknowledgeAlert: (alertId: string) => Promise<void>;
}

/**
 * AlertWidget component
 * 
 * Displays alerts and notifications with configurable thresholds.
 */
const AlertWidget: React.FC<AlertWidgetProps> = ({
  title = 'Alerts & Notifications',
  onRemove,
  onConfigure,
  fetchAlerts,
  onAcknowledgeAlert,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use real-time data hook
  const { data: alerts, loading, error, lastUpdated, refresh } = useRealTimeData(fetchAlerts, {
    interval: 30000,
    autoStart: true,
    timeout: 5000,
    maxRetries: 3,
  });

  // Handle alert acknowledgment
  const handleAcknowledge = async (alertId: string) => {
    try {
      setAcknowledging(alertId);
      await onAcknowledgeAlert(alertId);
      refresh();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setAcknowledging(null);
    }
  };

  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
      }}
    >
      <CardHeader
        title={title}
        avatar={
          <Box className="widget-drag-handle" sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', '&:active': { cursor: 'grabbing' } }}>
            <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </Box>
        }
        action={
          <IconButton
            aria-label="widget settings"
            aria-controls={open ? 'alert-widget-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
        sx={{
          pb: 0,
          '& .MuiCardHeader-title': {
            fontSize: '1rem',
            fontWeight: 500,
          },
          '& .MuiCardHeader-avatar': {
            marginRight: 1
          }
        }}
      />
      <Menu
        id="alert-widget-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onConfigure(); handleMenuClose(); }}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          Configure Alerts
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onRemove(); handleMenuClose(); }}>
          Remove Widget
        </MenuItem>
      </Menu>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1, px: 1 }}>
        {loading && !alerts && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="error">
              Error loading alerts
            </Typography>
          </Box>
        )}

        {alerts && (
          <>
            {alerts.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No alerts at this time
                </Typography>
              </Box>
            ) : (
              <List sx={{ width: '100%', p: 0 }}>
                {alerts.map((alert) => (
                  <ListItem
                    key={alert.id}
                    alignItems="flex-start"
                    secondaryAction={
                      !alert.acknowledged && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleAcknowledge(alert.id)}
                          disabled={acknowledging === alert.id}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          {acknowledging === alert.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            'Ack'
                          )}
                        </Button>
                      )
                    }
                    sx={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      py: 1,
                      opacity: alert.acknowledged ? 0.6 : 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getAlertIcon(alert.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" component="span">
                            {alert.message}
                          </Typography>
                          {alert.acknowledged && (
                            <Chip
                              label="Acknowledged"
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {alert.provider && (
                            <Typography variant="caption" component="span" color="text.secondary">
                              {alert.provider}
                            </Typography>
                          )}
                          <Typography variant="caption" component="span" color="text.secondary">
                            {formatTimestamp(alert.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'right', px: 1 }}>
                Updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertWidget;
