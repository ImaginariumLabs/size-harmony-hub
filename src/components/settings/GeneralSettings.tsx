import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Paper,
  Divider,
  Alert,
  Snackbar,
  SelectChangeEvent,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GeneralSettingsProps {
  // Optional props can be added here
}

interface SystemSettings {
  appName: string;
  defaultTheme: 'light' | 'dark' | 'system';
  language: string;
  autoUpdate: boolean;
  telemetryEnabled: boolean;
  defaultProvider: string;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    appName: 'APIwidget',
    defaultTheme: 'system',
    language: 'en',
    autoUpdate: true,
    telemetryEnabled: true,
    defaultProvider: 'openai',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const defaultSettings: SystemSettings = {
        appName: 'APIwidget',
        defaultTheme: 'system',
        language: 'en',
        autoUpdate: true,
        telemetryEnabled: true,
        defaultProvider: 'openai',
      };

      try {
        // This would normally fetch from an API
        // For now, we'll use mock data with a timeout
        const settingsPromise = new Promise<SystemSettings>(resolve => {
          setTimeout(() => {
            resolve({
              appName: 'APIwidget',
              defaultTheme: 'system',
              language: 'en',
              autoUpdate: true,
              telemetryEnabled: true,
              defaultProvider: 'openai',
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
        console.error('Error loading settings:', error);

        // Use default settings if loading fails
        setSettings(defaultSettings);

        // Show error message if it's a timeout
        if (error instanceof Error && error.message.includes('timed out')) {
          console.warn('Settings load timed out, using default settings');
        }
      } finally {
        // Always set loading to false to prevent endless loading state
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleChange = (field: keyof SystemSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
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
      console.log('Saving general settings:', settings);

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
      console.error('Error saving settings:', error);

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
        <Alert severity="success">Settings saved successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={saveError}
        autoHideDuration={3000}
        onClose={() => setSaveError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">Failed to save settings. Please try again.</Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Application Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Application Name"
              value={settings.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              fullWidth
              variant="outlined"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" disabled={loading}>
              <InputLabel>Default Theme</InputLabel>
              <Select
                value={settings.defaultTheme}
                onChange={(e: SelectChangeEvent) =>
                  handleChange('defaultTheme', e.target.value as 'light' | 'dark' | 'system')
                }
                label="Default Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" disabled={loading}>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                onChange={(e: SelectChangeEvent) => handleChange('language', e.target.value)}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" disabled={loading}>
              <InputLabel>Default API Provider</InputLabel>
              <Select
                value={settings.defaultProvider}
                onChange={(e: SelectChangeEvent) => handleChange('defaultProvider', e.target.value)}
                label="Default API Provider"
              >
                <MenuItem value="openai">OpenAI</MenuItem>
                <MenuItem value="claude">Claude</MenuItem>
                <MenuItem value="google">Google (Gemini)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Preferences
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoUpdate}
                  onChange={(e) => handleChange('autoUpdate', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Enable automatic updates"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.telemetryEnabled}
                  onChange={(e) => handleChange('telemetryEnabled', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Send anonymous usage data to help improve the application"
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
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default GeneralSettings;
