import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Paper,
  Divider,
  Alert,
  Snackbar,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NotificationSettingsProps {
  // Optional props can be added here
}

interface NotificationConfig {
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  slackNotifications: boolean;
  emailAddresses: string[];
  slackWebhooks: string[];
  notifyOnApiKeyExpiration: boolean;
  notifyOnUsageThreshold: boolean;
  notifyOnErrors: boolean;
  notifyOnUpdates: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationConfig>({
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: true,
    slackNotifications: false,
    emailAddresses: [],
    slackWebhooks: [],
    notifyOnApiKeyExpiration: true,
    notifyOnUsageThreshold: true,
    notifyOnErrors: true,
    notifyOnUpdates: true,
    dailyDigest: false,
    weeklyReport: true,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newWebhook, setNewWebhook] = useState('');

  // Load settings with timeout protection
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);

      // Create a timeout promise to prevent endless loading
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Settings load timed out after 5 seconds'));
        }, 5000); // 5 second timeout
      });

      // Default settings as fallback
      const defaultSettings: NotificationConfig = {
        emailNotifications: true,
        pushNotifications: true,
        desktopNotifications: true,
        slackNotifications: false,
        emailAddresses: [user?.email || 'admin@example.com'],
        slackWebhooks: [],
        notifyOnApiKeyExpiration: true,
        notifyOnUsageThreshold: true,
        notifyOnErrors: true,
        notifyOnUpdates: true,
        dailyDigest: false,
        weeklyReport: true,
      };

      try {
        // This would normally fetch from an API
        // For now, we'll use mock data with a timeout
        const settingsPromise = new Promise<NotificationConfig>(resolve => {
          setTimeout(() => {
            resolve({
              emailNotifications: true,
              pushNotifications: true,
              desktopNotifications: true,
              slackNotifications: false,
              emailAddresses: [user?.email || 'admin@example.com'],
              slackWebhooks: [],
              notifyOnApiKeyExpiration: true,
              notifyOnUsageThreshold: true,
              notifyOnErrors: true,
              notifyOnUpdates: true,
              dailyDigest: false,
              weeklyReport: true,
            });
          }, 500);
        });

        // Race the API call against the timeout
        const result = await Promise.race([
          settingsPromise,
          timeout
        ]);

        setSettings(result);
      } catch (error) {
        console.error('Error loading notification settings:', error);

        // Use default settings if loading fails
        setSettings(defaultSettings);

        // Show error message if it's a timeout
        if (error instanceof Error && error.message.includes('timed out')) {
          console.warn('Notification settings load timed out, using default settings');
        }
      } finally {
        // Always set loading to false to prevent endless loading state
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleChange = (field: keyof NotificationConfig, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddEmail = () => {
    if (newEmail && !settings.emailAddresses.includes(newEmail)) {
      setSettings(prev => ({
        ...prev,
        emailAddresses: [...prev.emailAddresses, newEmail],
      }));
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      emailAddresses: prev.emailAddresses.filter(e => e !== email),
    }));
  };

  const handleAddWebhook = () => {
    if (newWebhook && !settings.slackWebhooks.includes(newWebhook)) {
      setSettings(prev => ({
        ...prev,
        slackWebhooks: [...prev.slackWebhooks, newWebhook],
      }));
      setNewWebhook('');
    }
  };

  const handleRemoveWebhook = (webhook: string) => {
    setSettings(prev => ({
      ...prev,
      slackWebhooks: prev.slackWebhooks.filter(w => w !== webhook),
    }));
  };

  const handleSaveSettings = async () => {
    // Create a timeout promise to prevent endless loading
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Save operation timed out after 5 seconds'));
      }, 5000); // 5 second timeout
    });

    try {
      // This would normally save to an API
      console.log('Saving notification settings:', settings);

      // Simulate API call with timeout protection
      setLoading(true);

      // Create a promise for the save operation
      const savePromise = new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      // Race the save operation against the timeout
      await Promise.race([
        savePromise,
        timeout
      ]);

      setLoading(false);
      setSaveSuccess(true);
      setSaveError(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);

      // Provide more specific error messages
      if (error instanceof Error && error.message.includes('timed out')) {
        console.warn('Save operation timed out');
      }

      setSaveError(true);
      setSaveSuccess(false);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">Notification settings saved successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={saveError}
        autoHideDuration={3000}
        onClose={() => setSaveError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">Failed to save notification settings. Please try again.</Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Channels
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Email Notifications"
            />

            {settings.emailNotifications && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Email Address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter email address"
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      onClick={handleAddEmail}
                      fullWidth
                      disabled={!newEmail || loading}
                      sx={{ height: '56px' }}
                      startIcon={<AddIcon />}
                    >
                      Add Email
                    </Button>
                  </Grid>
                </Grid>

                <List dense>
                  {settings.emailAddresses.map(email => (
                    <ListItem key={email}>
                      <ListItemText primary={email} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveEmail(email)}
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.slackNotifications}
                  onChange={(e) => handleChange('slackNotifications', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Slack Notifications"
            />

            {settings.slackNotifications && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Slack Webhook URL"
                      value={newWebhook}
                      onChange={(e) => setNewWebhook(e.target.value)}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter Slack webhook URL"
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      onClick={handleAddWebhook}
                      fullWidth
                      disabled={!newWebhook || loading}
                      sx={{ height: '56px' }}
                      startIcon={<AddIcon />}
                    >
                      Add Webhook
                    </Button>
                  </Grid>
                </Grid>

                <List dense>
                  {settings.slackWebhooks.map(webhook => (
                    <ListItem key={webhook}>
                      <ListItemText
                        primary={webhook.length > 40 ? `${webhook.substring(0, 40)}...` : webhook}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveWebhook(webhook)}
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Push Notifications"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.desktopNotifications}
                  onChange={(e) => handleChange('desktopNotifications', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Desktop Notifications"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Events
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnApiKeyExpiration}
                  onChange={(e) => handleChange('notifyOnApiKeyExpiration', e.target.checked)}
                  disabled={loading}
                />
              }
              label="API Key Expiration"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnUsageThreshold}
                  onChange={(e) => handleChange('notifyOnUsageThreshold', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Usage Threshold Alerts"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnErrors}
                  onChange={(e) => handleChange('notifyOnErrors', e.target.checked)}
                  disabled={loading}
                />
              }
              label="API Errors"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnUpdates}
                  onChange={(e) => handleChange('notifyOnUpdates', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Application Updates"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Scheduled Reports
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dailyDigest}
                  onChange={(e) => handleChange('dailyDigest', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Daily Usage Digest"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.weeklyReport}
                  onChange={(e) => handleChange('weeklyReport', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Weekly Usage Report"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Notification Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationSettings;
