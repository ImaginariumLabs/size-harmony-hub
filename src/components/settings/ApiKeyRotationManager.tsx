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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  // Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  // Info as InfoIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ApiKeyRotationManagerProps {
  // Optional props can be added here
}

interface ApiKey {
  id: string;
  provider: string;
  name: string;
  key: string;
  createdAt: string;
  expiresAt: string;
  lastRotated: string;
  autoRotate: boolean;
  rotationPeriodDays: number;
  status: 'active' | 'expired' | 'revoked';
}

const ApiKeyRotationManager: React.FC<ApiKeyRotationManagerProps> = () => {
  const { user } = useAuth();
  const { providers } = useApiProviders();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [keyToRotate, setKeyToRotate] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [rotationInProgress, setRotationInProgress] = useState<Record<string, boolean>>({});
  const [editKey, setEditKey] = useState<Partial<ApiKey>>({});
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Load API keys
  useEffect(() => {
    const loadApiKeys = async () => {
      setLoading(true);
      try {
        // This would normally fetch from an API
        // For now, we'll use mock data
        setTimeout(() => {
          const now = new Date();
          const thirtyDaysFromNow = new Date(now);
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

          const ninetyDaysFromNow = new Date(now);
          ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

          const tenDaysAgo = new Date(now);
          tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

          setApiKeys([
            {
              id: 'key-1',
              provider: 'openai',
              name: 'OpenAI Production Key',
              key: 'sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
              createdAt: tenDaysAgo.toISOString(),
              expiresAt: thirtyDaysFromNow.toISOString(),
              lastRotated: tenDaysAgo.toISOString(),
              autoRotate: true,
              rotationPeriodDays: 30,
              status: 'active',
            },
            {
              id: 'key-2',
              provider: 'claude',
              name: 'Claude API Key',
              key: 'sk-ant-XXXXXXXXXXXXXXXXXXXXXXXX',
              createdAt: tenDaysAgo.toISOString(),
              expiresAt: ninetyDaysFromNow.toISOString(),
              lastRotated: tenDaysAgo.toISOString(),
              autoRotate: false,
              rotationPeriodDays: 90,
              status: 'active',
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading API keys:', error);
        setLoading(false);
      }
    };

    loadApiKeys();
  }, [user]);

  const handleToggleAutoRotate = (id: string) => {
    setApiKeys(prev =>
      prev.map(key =>
        key.id === id
          ? { ...key, autoRotate: !key.autoRotate }
          : key
      )
    );
  };

  const handleRotateKey = (id: string) => {
    setKeyToRotate(id);
    setRotateDialogOpen(true);
  };

  const confirmRotateKey = async () => {
    if (keyToRotate) {
      setRotateDialogOpen(false);
      setRotationInProgress(prev => ({ ...prev, [keyToRotate]: true }));

      try {
        // Simulate API call to rotate key
        await new Promise(resolve => setTimeout(resolve, 2000));

        const now = new Date();
        const thirtyDaysFromNow = new Date(now);
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        setApiKeys(prev =>
          prev.map(key =>
            key.id === keyToRotate
              ? {
                  ...key,
                  key: `${key.key.substring(0, 6)}-${Math.random().toString(36).substring(2, 10)}`,
                  lastRotated: now.toISOString(),
                  expiresAt: thirtyDaysFromNow.toISOString(),
                }
              : key
          )
        );

        setSaveSuccess(true);
      } catch (error) {
        console.error('Error rotating API key:', error);
        setSaveError(true);
      } finally {
        setRotationInProgress(prev => ({ ...prev, [keyToRotate]: false }));
        setKeyToRotate(null);
      }
    }
  };

  const handleToggleShowKey = (id: string) => {
    setShowKey(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
      .then(() => {
        setCopySuccess('API key copied to clipboard!');
        setTimeout(() => setCopySuccess(null), 3000);
      })
      .catch(err => {
        console.error('Failed to copy API key:', err);
      });
  };

  const handleEditKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (key) {
      setEditKey({
        ...key,
      });
      setEditMode(id);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditKey({});
  };

  const handleSaveEdit = () => {
    if (editMode && editKey.name && editKey.rotationPeriodDays) {
      setApiKeys(prev =>
        prev.map(key =>
          key.id === editMode
            ? {
                ...key,
                name: editKey.name || key.name,
                rotationPeriodDays: editKey.rotationPeriodDays || key.rotationPeriodDays,
                autoRotate: editKey.autoRotate !== undefined ? editKey.autoRotate : key.autoRotate,
              }
            : key
        )
      );
      setEditMode(null);
      setEditKey({});
      setSaveSuccess(true);
    }
  };

  const handleInputChange = (field: keyof ApiKey, value: string | number | boolean) => {
    setEditKey(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // This would normally save to an API
      console.log('Saving API key rotation settings:', apiKeys);

      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);

      setSaveSuccess(true);
      setSaveError(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving API key rotation settings:', error);
      setSaveError(true);
      setSaveSuccess(false);
      setLoading(false);
    }
  };

  const calculateDaysRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiresAt: string) => {
    const daysRemaining = calculateDaysRemaining(expiresAt);

    if (daysRemaining <= 0) {
      return { color: 'error', text: 'Expired' };
    } else if (daysRemaining <= 7) {
      return { color: 'error', text: `Expires in ${daysRemaining} days` };
    } else if (daysRemaining <= 14) {
      return { color: 'warning', text: `Expires in ${daysRemaining} days` };
    } else {
      return { color: 'success', text: `Expires in ${daysRemaining} days` };
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
        <Alert severity="success">API key settings saved successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={saveError}
        autoHideDuration={3000}
        onClose={() => setSaveError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">Failed to save API key settings. Please try again.</Alert>
      </Snackbar>

      <Snackbar
        open={!!copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">{copySuccess}</Alert>
      </Snackbar>

      <Dialog
        open={rotateDialogOpen}
        onClose={() => setRotateDialogOpen(false)}
      >
        <DialogTitle>Confirm Key Rotation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to rotate this API key? The current key will be invalidated and a new key will be generated.
            Make sure to update any systems using this key immediately after rotation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRotateDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRotateKey} color="primary" autoFocus>
            Rotate Key
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          API Key Rotation Management
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Alert severity="info" sx={{ mb: 3 }}>
          Regularly rotating API keys is a security best practice. You can set up automatic rotation or manually rotate keys as needed.
        </Alert>

        {apiKeys.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            No API keys found. Add API keys in the provider settings.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {apiKeys.map(key => (
              <Grid item xs={12} key={key.id}>
                <Card sx={{ mb: 1 }}>
                  {rotationInProgress[key.id] && (
                    <LinearProgress color="primary" />
                  )}
                  <CardContent>
                    {editMode === key.id ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Key Name"
                            value={editKey.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            fullWidth
                            required
                            disabled={loading}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Rotation Period (Days)</InputLabel>
                            <Select
                              value={editKey.rotationPeriodDays?.toString() || '30'}
                              onChange={(e: SelectChangeEvent) =>
                                handleInputChange('rotationPeriodDays', parseInt(e.target.value))
                              }
                              label="Rotation Period (Days)"
                              disabled={loading}
                            >
                              <MenuItem value="30">30 days</MenuItem>
                              <MenuItem value="60">60 days</MenuItem>
                              <MenuItem value="90">90 days</MenuItem>
                              <MenuItem value="180">180 days</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={editKey.autoRotate || false}
                                onChange={(e) => handleInputChange('autoRotate', e.target.checked)}
                                disabled={loading}
                              />
                            }
                            label="Enable Automatic Rotation"
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" component="div">
                              {key.name}
                            </Typography>
                            <Chip
                              label={key.provider.toUpperCase()}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                            <Chip
                              label={getExpiryStatus(key.expiresAt).text}
                              size="small"
                              color={getExpiryStatus(key.expiresAt).color as 'success' | 'warning' | 'error'}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          <Box>
                            <Tooltip title="Edit Key Settings">
                              <IconButton
                                onClick={() => handleEditKey(key.id)}
                                disabled={loading || editMode !== null || rotationInProgress[key.id]}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Rotate API Key">
                              <IconButton
                                onClick={() => handleRotateKey(key.id)}
                                disabled={loading || editMode !== null || rotationInProgress[key.id]}
                                color="primary"
                              >
                                {rotationInProgress[key.id] ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  <RefreshIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                <strong>API Key:</strong>
                              </Typography>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={showKey[key.id] ? key.key : '••••••••••••••••••••••••••••••'}
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <Box sx={{ display: 'flex' }}>
                                      <Tooltip title={showKey[key.id] ? "Hide API Key" : "Show API Key"}>
                                        <IconButton
                                          onClick={() => handleToggleShowKey(key.id)}
                                          edge="end"
                                          size="small"
                                        >
                                          {showKey[key.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                      </Tooltip>
                                      {showKey[key.id] && (
                                        <Tooltip title="Copy API Key">
                                          <IconButton
                                            onClick={() => handleCopyKey(key.key)}
                                            edge="end"
                                            size="small"
                                          >
                                            <ContentCopyIcon />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Box>
                                  ),
                                }}
                                sx={{ flexGrow: 1 }}
                              />
                            </Box>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2">
                              <strong>Created:</strong> {new Date(key.createdAt).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2">
                              <strong>Last Rotated:</strong> {new Date(key.lastRotated).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2">
                              <strong>Rotation Period:</strong> {key.rotationPeriodDays} days
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </CardContent>
                  {editMode === key.id ? (
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
                        disabled={loading || !editKey.name}
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
                            checked={key.autoRotate}
                            onChange={() => handleToggleAutoRotate(key.id)}
                            disabled={loading || editMode !== null || rotationInProgress[key.id]}
                          />
                        }
                        label="Auto-Rotate"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <ScheduleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Next rotation: {key.autoRotate
                            ? new Date(new Date(key.lastRotated).getTime() + key.rotationPeriodDays * 24 * 60 * 60 * 1000).toLocaleDateString()
                            : 'Manual only'}
                        </Typography>
                      </Box>
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
          disabled={loading || editMode !== null || Object.values(rotationInProgress).some(v => v)}
        >
          {loading ? 'Saving...' : 'Save Rotation Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default ApiKeyRotationManager;
