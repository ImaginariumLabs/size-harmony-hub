import React, { useState, useEffect, useCallback } from 'react';
import { Box, Menu, List, ListItem, ListItemText, ListItemIcon, CircularProgress, useTheme, Typography, IconButton, Divider, Badge, Tooltip, Chip, Button } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, AlertType, AlertSeverity, getUserAlerts, markAlertAsRead, dismissAlert } from '../../services/alertService';

const AlertCenter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = Boolean(anchorEl);

  // Define loadAlerts function before it's used
  const loadAlerts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userAlerts = await getUserAlerts(user.id);
      setAlerts(userAlerts);
    } catch (err) {
      console.error('Error loading alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load alerts when the component mounts or when the menu is opened
  useEffect(() => {
    if (open && user) {
      loadAlerts();
    }
  }, [open, user, loadAlerts]);

  // Load alerts periodically
  useEffect(() => {
    if (user) {
      loadAlerts();

      // Refresh alerts every 5 minutes
      const interval = setInterval(() => {
        loadAlerts();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user, loadAlerts]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAlertClick = (alert: Alert) => {
    // Mark as read
    if (!alert.read) {
      markAlertAsRead(alert.id!);

      // Update local state
      setAlerts(prev => prev.map(a =>
        a.id === alert.id ? { ...a, read: true } : a
      ));
    }

    // Navigate to action URL if provided
    if (alert.actionUrl) {
      navigate(alert.actionUrl);
      handleClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);

    try {
      // Mark all alerts as read
      for (const alert of alerts.filter(a => !a.read)) {
        await markAlertAsRead(alert.id!);
      }

      // Update local state
      setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    } catch (err) {
      console.error('Error marking alerts as read:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAlert = async (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      await dismissAlert(alertId);

      // Update local state
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  const getAlertIcon = (alert: Alert) => {
    switch (alert.severity) {
      case AlertSeverity.ERROR:
        return <ErrorIcon color="error" />;
      case AlertSeverity.WARNING:
        return <WarningIcon color="warning" />;
      case AlertSeverity.INFO:
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getAlertTypeLabel = (type: AlertType) => {
    switch (type) {
      case AlertType.RATE_LIMIT:
        return 'Rate Limit';
      case AlertType.USAGE_THRESHOLD:
        return 'Usage Threshold';
      case AlertType.COST_THRESHOLD:
        return 'Cost Threshold';
      case AlertType.PROVIDER_HEALTH:
        return 'Provider Health';
      case AlertType.SYSTEM:
        return 'System';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          size="large"
          aria-controls={open ? 'alerts-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          color="inherit"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id="alerts-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'alerts-button',
        }}
        PaperProps={{
          style: {
            width: 400,
            maxHeight: 500,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <Tooltip title="Mark all as read">
              <IconButton
                size="small"
                onClick={handleMarkAllAsRead}
                disabled={loading || unreadCount === 0}
              >
                <MarkReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Alert settings">
              <IconButton
                size="small"
                onClick={() => {
                  navigate('/settings/alerts');
                  handleClose();
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {!loading && !error && alerts.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        )}

        {!loading && !error && alerts.length > 0 && (
          <List sx={{ p: 0 }}>
            {alerts.map((alert) => (
              <React.Fragment key={alert.id}>
                <ListItem
                  button
                  onClick={() => handleAlertClick(alert)}
                  sx={{
                    backgroundColor: alert.read ? 'transparent' : theme.palette.action.hover,
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="dismiss"
                      onClick={(e) => handleDismissAlert(alert.id!, e)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {getAlertIcon(alert)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={alert.read ? 'normal' : 'bold'}>
                          {alert.title}
                        </Typography>
                        <Chip
                          label={getAlertTypeLabel(alert.type)}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(alert.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            size="small"
            onClick={() => {
              navigate('/notifications');
              handleClose();
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default AlertCenter;
