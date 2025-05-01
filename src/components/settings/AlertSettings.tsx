import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Slider,
  Grid,
  Alert,
  Stack,
  Typography,
  Paper,
  Chip,
  Divider,
  Button
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';

interface AlertThreshold {
  providerId: string;
  threshold: number;
  enabled: boolean;
}

const AlertSettings: React.FC = () => {
  // Auth context will be used in future implementations
  useAuth();
  const { providers } = useApiProviders();
  const [alertThresholds, setAlertThresholds] = useState<AlertThreshold[]>([]);
  const [globalNotifications, setGlobalNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Load alert settings
  useEffect(() => {
    // This would normally fetch from an API
    const loadedThresholds = providers.map(provider => ({
      providerId: provider.id,
      threshold: 75, // Default threshold
      enabled: true,
    }));

    setAlertThresholds(loadedThresholds);
  }, [providers]);

  const handleThresholdChange = (providerId: string, newValue: number) => {
    setAlertThresholds(prevThresholds =>
      prevThresholds.map(threshold =>
        threshold.providerId === providerId
          ? { ...threshold, threshold: newValue }
          : threshold
      )
    );
  };

  const handleToggleEnabled = (providerId: string) => {
    setAlertThresholds(prevThresholds =>
      prevThresholds.map(threshold =>
        threshold.providerId === providerId
          ? { ...threshold, enabled: !threshold.enabled }
          : threshold
      )
    );
  };

  const handleSaveSettings = () => {
    // This would normally save to an API
    try {
      console.log('Saving alert settings:', {
        alertThresholds,
        globalNotifications,
        emailNotifications,
      });

      setSaveSuccess(true);
      setSaveError(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving alert settings:', error);
      setSaveError(true);
      setSaveSuccess(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Alert Settings
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Alert settings saved successfully!
        </Alert>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error saving alert settings. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Global Alert Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={globalNotifications}
                  onChange={() => setGlobalNotifications(!globalNotifications)}
                />
              }
              label="Enable all alert notifications"
            />
          </Grid>

          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  disabled={!globalNotifications}
                />
              }
              label="Send email notifications"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Provider-Specific Thresholds
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set usage thresholds for each API provider. You'll receive alerts when usage exceeds these thresholds.
        </Typography>

        {alertThresholds.map((threshold) => {
          const provider = providers.find(p => p.id === threshold.providerId);

          return (
            <Box key={threshold.providerId} sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{provider?.name || threshold.providerId}</Typography>
                    <Chip
                      label={threshold.enabled ? 'Enabled' : 'Disabled'}
                      color={threshold.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Slider
                    value={threshold.threshold}
                    onChange={(_, newValue) =>
                      handleThresholdChange(threshold.providerId, newValue as number)
                    }
                    disabled={!threshold.enabled || !globalNotifications}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={threshold.enabled}
                        onChange={() => handleToggleEnabled(threshold.providerId)}
                        disabled={!globalNotifications}
                      />
                    }
                    label=""
                  />
                </Grid>
              </Grid>

              {threshold !== alertThresholds[alertThresholds.length - 1] && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          );
        })}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AlertSettings;
