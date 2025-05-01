import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  // Info as InfoIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IntegrationSettingsProps {
  // Optional props can be added here
}

interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'oauth';
  url: string;
  enabled: boolean;
  authToken?: string;
  description?: string;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newIntegration, setNewIntegration] = useState<Partial<Integration>>({
    name: '',
    type: 'webhook',
    url: '',
    enabled: true,
    authToken: '',
    description: '',
  });

  // Load integrations with timeout protection
  useEffect(() => {
    const loadIntegrations = async () => {
      setLoading(true);

      // Create a timeout promise to prevent endless loading
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Integrations load timed out after 5 seconds'));
        }, 5000); // 5 second timeout
      });

      // Default integrations as fallback
      const defaultIntegrations: Integration[] = [
        {
          id: '1',
          name: 'Slack Notifications',
          type: 'webhook',
          url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
          enabled: true,
          description: 'Sends notifications to the #api-alerts Slack channel',
        },
        {
          id: '2',
          name: 'GitHub Integration',
          type: 'oauth',
          url: 'https://api.github.com',
          enabled: false,
          authToken: 'github_pat_XXXXXXXXXXXX',
          description: 'Connects to GitHub for issue tracking',
        },
      ];

      try {
        // This would normally fetch from an API
        // For now, we'll use mock data with a timeout
        const integrationsPromise = new Promise<Integration[]>(resolve => {
          setTimeout(() => {
            resolve([
              {
                id: '1',
                name: 'Slack Notifications',
                type: 'webhook',
                url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
                enabled: true,
                description: 'Sends notifications to the #api-alerts Slack channel',
              },
              {
                id: '2',
                name: 'GitHub Integration',
                type: 'oauth',
                url: 'https://api.github.com',
                enabled: false,
                authToken: 'github_pat_XXXXXXXXXXXX',
                description: 'Connects to GitHub for issue tracking',
              },
            ]);
          }, 500);
        });

        // Race the API call against the timeout
        const result = await Promise.race([
          integrationsPromise,
          timeout
        ]);

        setIntegrations(result);
      } catch (error) {
        console.error('Error loading integrations:', error);

        // Use default integrations if loading fails
        setIntegrations(defaultIntegrations);

        // Show error message if it's a timeout
        if (error instanceof Error && error.message.includes('timed out')) {
          console.warn('Integrations load timed out, using default integrations');
        }
      } finally {
        // Always set loading to false to prevent endless loading state
        setLoading(false);
      }
    };

    loadIntegrations();
  }, [user]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== id));
  };

  const handleEditIntegration = (id: string) => {
    setEditMode(id);
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      setNewIntegration({ ...integration });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setNewIntegration({
      name: '',
      type: 'webhook',
      url: '',
      enabled: true,
      authToken: '',
      description: '',
    });
  };

  const handleSaveEdit = () => {
    if (editMode) {
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === editMode
            ? { ...integration, ...newIntegration, id: integration.id }
            : integration
        )
      );
      setEditMode(null);
      setNewIntegration({
        name: '',
        type: 'webhook',
        url: '',
        enabled: true,
        authToken: '',
        description: '',
      });
    }
  };

  const handleAddIntegration = () => {
    if (newIntegration.name && newIntegration.url) {
      const newId = `new-${Date.now()}`;
      setIntegrations(prev => [
        ...prev,
        {
          id: newId,
          name: newIntegration.name || '',
          type: newIntegration.type as 'webhook' | 'api' | 'oauth',
          url: newIntegration.url || '',
          enabled: newIntegration.enabled || true,
          authToken: newIntegration.authToken,
          description: newIntegration.description,
        },
      ]);
      setNewIntegration({
        name: '',
        type: 'webhook',
        url: '',
        enabled: true,
        authToken: '',
        description: '',
      });
    }
  };

  const handleInputChange = (field: keyof Integration, value: string | boolean) => {
    setNewIntegration(prev => ({
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
      console.log('Saving integrations:', integrations);

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
      console.error('Error saving integrations:', error);

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
        <Alert severity="success">Integration settings saved successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={saveError}
        autoHideDuration={3000}
        onClose={() => setSaveError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">Failed to save integration settings. Please try again.</Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            External Integrations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setEditMode('new')}
            disabled={loading || editMode !== null}
          >
            Add Integration
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {editMode === 'new' && (
          <Card sx={{ mb: 3, border: '1px dashed', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                New Integration
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Integration Name"
                    value={newIntegration.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    fullWidth
                    required
                    disabled={loading}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label="Integration Type"
                    value={newIntegration.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    fullWidth
                    required
                    disabled={loading}

                  >
                    <option value="webhook">Webhook</option>
                    <option value="api">API</option>
                    <option value="oauth">OAuth</option>
                  </TextField>
                </Grid>

                <Grid size={12}>
                  <TextField
                    label="URL"
                    value={newIntegration.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    fullWidth
                    required
                    disabled={loading}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    label="Auth Token (if required)"
                    value={newIntegration.authToken}
                    onChange={(e) => handleInputChange('authToken', e.target.value)}
                    fullWidth
                    disabled={loading}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    label="Description"
                    value={newIntegration.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    disabled={loading}
                  />
                </Grid>

                <Grid size={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newIntegration.enabled || false}
                        onChange={(e) => handleInputChange('enabled', e.target.checked)}
                        disabled={loading}
                      />
                    }
                    label="Enable Integration"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                disabled={loading}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddIntegration}
                disabled={loading || !newIntegration.name || !newIntegration.url}
                startIcon={<CheckIcon />}
                sx={{ ml: 1 }}
              >
                Add Integration
              </Button>
            </CardActions>
          </Card>
        )}

        {integrations.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No integrations configured. Click "Add Integration" to create one.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {integrations.map(integration => (
              <Grid size={12} key={integration.id}>
                <Card sx={{ mb: 1 }}>
                  <CardContent>
                    {editMode === integration.id ? (
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            label="Integration Name"
                            value={newIntegration.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            fullWidth
                            required
                            disabled={loading}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            select
                            label="Integration Type"
                            value={newIntegration.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            fullWidth
                            required
                            disabled={loading}
                          >
                            <option value="webhook">Webhook</option>
                            <option value="api">API</option>
                            <option value="oauth">OAuth</option>
                          </TextField>
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            label="URL"
                            value={newIntegration.url}
                            onChange={(e) => handleInputChange('url', e.target.value)}
                            fullWidth
                            required
                            disabled={loading}
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            label="Auth Token (if required)"
                            value={newIntegration.authToken}
                            onChange={(e) => handleInputChange('authToken', e.target.value)}
                            fullWidth
                            disabled={loading}
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            label="Description"
                            value={newIntegration.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            disabled={loading}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" component="div">
                              {integration.name}
                            </Typography>
                            <Chip
                              label={integration.type.toUpperCase()}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                            <Chip
                              label={integration.enabled ? 'Enabled' : 'Disabled'}
                              size="small"
                              color={integration.enabled ? 'success' : 'default'}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          <Box>
                            <Tooltip title="Edit Integration">
                              <IconButton
                                onClick={() => handleEditIntegration(integration.id)}
                                disabled={loading || editMode !== null}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Integration">
                              <IconButton
                                onClick={() => handleDeleteIntegration(integration.id)}
                                disabled={loading || editMode !== null}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {integration.url}
                          </Typography>
                        </Box>

                        {integration.description && (
                          <Typography variant="body2" color="text.secondary">
                            {integration.description}
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                  {editMode === integration.id ? (
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                        disabled={loading}
                        startIcon={<CloseIcon />}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveEdit}
                        disabled={loading || !newIntegration.name || !newIntegration.url}
                        startIcon={<CheckIcon />}
                        sx={{ ml: 1 }}
                      >
                        Save Changes
                      </Button>
                    </CardActions>
                  ) : (
                    <CardActions>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={integration.enabled}
                            onChange={() => handleToggleIntegration(integration.id)}
                            disabled={loading || editMode !== null}
                          />
                        }
                        label={integration.enabled ? 'Enabled' : 'Disabled'}
                      />
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          disabled={loading || editMode !== null}
        >
          {loading ? 'Saving...' : 'Save Integration Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default IntegrationSettings;
