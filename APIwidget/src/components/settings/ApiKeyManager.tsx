import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getApiKey, saveApiKey, deleteApiKey } from '../../services/electronService';
import { getProviderConfigs } from '../../services/apiIntegrationService';

const ApiKeyManager: React.FC = () => {
  // State for API keys
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [newApiKey, setNewApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Get provider configurations
  const providerConfigs = getProviderConfigs();
  const providers = Object.values(providerConfigs);

  // Load API keys
  useEffect(() => {
    const loadApiKeys = async () => {
      setLoading(true);
      const keys: Record<string, string> = {};
      const showState: Record<string, boolean> = {};

      for (const provider of providers) {
        try {
          const key = await getApiKey(provider.id);
          if (key) {
            keys[provider.id] = key;
            showState[provider.id] = false;
          }
        } catch (error) {
          console.error(`Error loading API key for ${provider.id}:`, error);
        }
      }

      setApiKeys(keys);
      setShowApiKey(showState);
      setLoading(false);
    };

    loadApiKeys();
  }, [providers]);

  // Handle editing API key
  const handleEditApiKey = (providerId: string) => {
    setEditingProvider(providerId);
    setNewApiKey(apiKeys[providerId] || '');
  };

  // Handle saving API key
  const handleSaveApiKey = async (providerId: string) => {
    try {
      const result = await saveApiKey(providerId, newApiKey);

      // Check if the operation was successful
      if (typeof result === 'object' && result !== null) {
        // New format with detailed response
        if (result.success) {
          setApiKeys(prev => ({
            ...prev,
            [providerId]: newApiKey
          }));

          setEditingProvider(null);
          setNewApiKey('');

          // Show success message with possible warning
          if (result.warning) {
            setSnackbarMessage(`API key saved with warning: ${result.warning}`);
            setSnackbarSeverity('warning');
          } else {
            setSnackbarMessage(result.message ?? `API key for ${providerConfigs[providerId].name} saved successfully`);
            setSnackbarSeverity('success');
          }
        } else {
          // Operation failed
          setSnackbarMessage(result.error ?? `Error saving API key for ${providerConfigs[providerId].name}`);
          setSnackbarSeverity('error');
        }
      } else if (result === true) {
        // Old format for backward compatibility
        setApiKeys(prev => ({
          ...prev,
          [providerId]: newApiKey
        }));

        setEditingProvider(null);
        setNewApiKey('');

        // Show success message
        setSnackbarMessage(`API key for ${providerConfigs[providerId].name} saved successfully`);
        setSnackbarSeverity('success');
      } else {
        // Operation failed
        throw new Error('Unknown response format');
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error(`Error saving API key for ${providerId}:`, error);

      // Show error message
      setSnackbarMessage(`Error saving API key for ${providerConfigs[providerId].name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingProvider(null);
    setNewApiKey('');
  };

  // Handle toggling API key visibility
  const handleToggleVisibility = (providerId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  // Handle opening delete dialog
  const handleOpenDeleteDialog = (providerId: string) => {
    setProviderToDelete(providerId);
    setDeleteDialogOpen(true);
  };

  // Handle closing delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProviderToDelete(null);
  };

  // Handle deleting API key
  const handleDeleteApiKey = async () => {
    if (!providerToDelete) return;

    try {
      const result = await deleteApiKey(providerToDelete);

      // Check if the operation was successful
      if (typeof result === 'object' && result !== null) {
        // New format with detailed response
        if (result.success) {
          setApiKeys(prev => {
            const newKeys = { ...prev };
            delete newKeys[providerToDelete];
            return newKeys;
          });

          // Show success message
          setSnackbarMessage(result.message ?? `API key for ${providerConfigs[providerToDelete].name} deleted successfully`);
          setSnackbarSeverity('success');
        } else {
          // Operation failed
          setSnackbarMessage(result.error ?? `Error deleting API key for ${providerConfigs[providerToDelete].name}`);
          setSnackbarSeverity('error');
        }
      } else if (result === true) {
        // Old format for backward compatibility
        setApiKeys(prev => {
          const newKeys = { ...prev };
          delete newKeys[providerToDelete];
          return newKeys;
        });

        // Show success message
        setSnackbarMessage(`API key for ${providerConfigs[providerToDelete].name} deleted successfully`);
        setSnackbarSeverity('success');
      } else {
        // Operation failed
        throw new Error('Unknown response format');
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error(`Error deleting API key for ${providerToDelete}:`, error);

      // Show error message
      setSnackbarMessage(`Error deleting API key for ${providerConfigs[providerToDelete].name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    handleCloseDeleteDialog();
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Mask API key for display
  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
  };

  // Get gradient colors for provider
  const getProviderGradient = (providerId: string): string => {
    switch (providerId) {
      case 'openai':
        return '#10a37f, #0d8a6f';
      case 'github':
        return '#24292e, #1a1e22';
      case 'aws':
        return '#ff9900, #e88b00';
      case 'azure':
        return '#0078d4, #0063b1';
      case 'google':
        return '#4285f4, #3367d6';
      default:
        return '#64b5f6, #2196f3';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        API Key Management
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Manage your API keys for different providers. These keys are stored securely and used to fetch usage and cost data.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {providers.map(provider => (
            <Grid item xs={12} key={provider.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(30, 30, 30, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${getProviderGradient(provider.id)})`,
                      mr: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {provider.name.charAt(0)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="h3">
                    {provider.name}
                  </Typography>
                  <Tooltip title="API Information" arrow>
                    <IconButton
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        setSnackbarMessage(`${provider.name} uses ${provider.authType} authentication. Base URL: ${provider.baseUrl}`);
                        setSnackbarSeverity('info');
                        setSnackbarOpen(true);
                      }}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {editingProvider === provider.id ? (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label={`${provider.name} API Key`}
                      variant="outlined"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      type={showApiKey[provider.id] ? 'text' : 'password'}
                      // Using sx for styling
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                          paddingRight: 0
                        }
                      }}
                      // Note: InputProps is deprecated but still needed for now
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => handleToggleVisibility(provider.id)}
                            edge="end"
                          >
                            {showApiKey[provider.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        )
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                        startIcon={<CloseIcon />}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveApiKey(provider.id)}
                        disabled={!newApiKey}
                        startIcon={<CheckIcon />}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    {apiKeys[provider.id] ? (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body1" sx={{ flexGrow: 1 }}>
                            API Key: {showApiKey[provider.id] ? apiKeys[provider.id] : maskApiKey(apiKeys[provider.id])}
                          </Typography>
                          <Tooltip title={showApiKey[provider.id] ? "Hide API Key" : "Show API Key"}>
                            <IconButton onClick={() => handleToggleVisibility(provider.id)} size="small">
                              {showApiKey[provider.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(provider.id)}
                            startIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleEditApiKey(provider.id)}
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditApiKey(provider.id)}
                          startIcon={<AddIcon />}
                        >
                          Add API Key
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        // Using slotProps instead of deprecated PaperProps
        slotProps={{
          paper: {
            sx: {
              background: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }
          }
        }}
      >
        <DialogTitle>Delete API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the API key for {providerToDelete && providerConfigs[providerToDelete]?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteApiKey} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiKeyManager;
