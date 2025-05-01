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
  Slider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SecuritySettingsProps {
  // Optional props can be added here
}

interface SecurityConfig {
  passwordExpiryDays: number;
  mfaEnabled: boolean;
  mfaMethod: 'app' | 'email' | 'sms';
  sessionTimeout: number; // in minutes
  apiKeyExpiration: number; // in days
  ipRestrictions: boolean;
  allowedIpAddresses: string[];
  encryptionLevel: 'standard' | 'high';
}

const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecurityConfig>({
    passwordExpiryDays: 90,
    mfaEnabled: false,
    mfaMethod: 'app',
    sessionTimeout: 60,
    apiKeyExpiration: 30,
    ipRestrictions: false,
    allowedIpAddresses: [],
    encryptionLevel: 'standard',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');

  // Load settings with timeout protection
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);

      // Create a timeout promise to prevent endless loading
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Security settings load timed out after 5 seconds'));
        }, 5000); // 5 second timeout
      });

      // Default settings as fallback
      const defaultSettings: SecurityConfig = {
        passwordExpiryDays: 90,
        mfaEnabled: false,
        mfaMethod: 'app',
        sessionTimeout: 60,
        apiKeyExpiration: 30,
        ipRestrictions: false,
        allowedIpAddresses: [],
        encryptionLevel: 'standard',
      };

      try {
        // This would normally fetch from an API
        // For now, we'll use mock data with a timeout
        const settingsPromise = new Promise<SecurityConfig>(resolve => {
          setTimeout(() => {
            resolve({
              passwordExpiryDays: 90,
              mfaEnabled: false,
              mfaMethod: 'app',
              sessionTimeout: 60,
              apiKeyExpiration: 30,
              ipRestrictions: false,
              allowedIpAddresses: [],
              encryptionLevel: 'standard',
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
        console.error('Error loading security settings:', error);

        // Use default settings if loading fails
        setSettings(defaultSettings);

        // Show error message if it's a timeout
        if (error instanceof Error && error.message.includes('timed out')) {
          console.warn('Security settings load timed out, using default settings');
        }
      } finally {
        // Always set loading to false to prevent endless loading state
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleChange = (field: keyof SecurityConfig, value: string | number | boolean | string[]) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddIpAddress = () => {
    if (newIpAddress && !settings.allowedIpAddresses.includes(newIpAddress)) {
      setSettings(prev => ({
        ...prev,
        allowedIpAddresses: [...prev.allowedIpAddresses, newIpAddress],
      }));
      setNewIpAddress('');
    }
  };

  const handleRemoveIpAddress = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      allowedIpAddresses: prev.allowedIpAddresses.filter(address => address !== ip),
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
      console.log('Saving security settings:', settings);

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
      console.error('Error saving security settings:', error);

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
        <Alert severity="success">Security settings saved successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={saveError}
        autoHideDuration={3000}
        onClose={() => setSaveError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">Failed to save security settings. Please try again.</Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Authentication Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Password Expiry (Days)</Typography>
            <Slider
              value={settings.passwordExpiryDays}
              onChange={(_, value) => handleChange('passwordExpiryDays', value)}
              min={30}
              max={365}
              step={30}
              marks={[
                { value: 30, label: '30' },
                { value: 90, label: '90' },
                { value: 180, label: '180' },
                { value: 365, label: '365' },
              ]}
              valueLabelDisplay="auto"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.mfaEnabled}
                  onChange={(e) => handleChange('mfaEnabled', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Enable Multi-Factor Authentication (MFA)"
            />

            {settings.mfaEnabled && (
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }} disabled={loading}>
                <InputLabel>MFA Method</InputLabel>
                <Select
                  value={settings.mfaMethod}
                  onChange={(e: SelectChangeEvent) =>
                    handleChange('mfaMethod', e.target.value as 'app' | 'email' | 'sms')
                  }
                  label="MFA Method"
                >
                  <MenuItem value="app">Authenticator App</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Session & API Security
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Session Timeout (Minutes)</Typography>
            <Slider
              value={settings.sessionTimeout}
              onChange={(_, value) => handleChange('sessionTimeout', value)}
              min={15}
              max={240}
              step={15}
              marks={[
                { value: 15, label: '15' },
                { value: 60, label: '60' },
                { value: 120, label: '120' },
                { value: 240, label: '240' },
              ]}
              valueLabelDisplay="auto"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>API Key Expiration (Days)</Typography>
            <Slider
              value={settings.apiKeyExpiration}
              onChange={(_, value) => handleChange('apiKeyExpiration', value)}
              min={7}
              max={365}
              step={7}
              marks={[
                { value: 7, label: '7' },
                { value: 30, label: '30' },
                { value: 90, label: '90' },
                { value: 365, label: '365' },
              ]}
              valueLabelDisplay="auto"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" disabled={loading}>
              <InputLabel>Encryption Level</InputLabel>
              <Select
                value={settings.encryptionLevel}
                onChange={(e: SelectChangeEvent) =>
                  handleChange('encryptionLevel', e.target.value as 'standard' | 'high')
                }
                label="Encryption Level"
              >
                <MenuItem value="standard">Standard (AES-256)</MenuItem>
                <MenuItem value="high">High (Double Encryption)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          IP Restrictions
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.ipRestrictions}
                  onChange={(e) => handleChange('ipRestrictions', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Enable IP Restrictions"
            />
          </Grid>

          {settings.ipRestrictions && (
            <>
              <Grid item xs={12} md={8}>
                <TextField
                  label="IP Address"
                  value={newIpAddress}
                  onChange={(e) => setNewIpAddress(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter IP address (e.g., 192.168.1.1 or 10.0.0.0/24)"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  onClick={handleAddIpAddress}
                  fullWidth
                  disabled={!newIpAddress || loading}
                  sx={{ height: '56px' }}
                >
                  Add IP Address
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Allowed IP Addresses:
                </Typography>

                {settings.allowedIpAddresses.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No IP addresses added. All IP addresses will be allowed.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {settings.allowedIpAddresses.map(ip => (
                      <Chip
                        key={ip}
                        label={ip}
                        onDelete={() => handleRemoveIpAddress(ip)}
                        disabled={loading}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Security Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default SecuritySettings;
