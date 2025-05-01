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
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';

interface CustomProviderManagerProps {
  // Optional props can be added here
}

interface CustomProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  authType: 'bearer' | 'key' | 'basic' | 'oauth';
  headerName?: string;
  enabled: boolean;
  usageEndpoint: string;
  costEndpoint?: string;
  responseMapping: {
    usage: string[];
    cost?: string[];
    timestamp?: string[];
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`provider-tabpanel-${index}`}
      aria-labelledby={`provider-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `provider-tab-${index}`,
    'aria-controls': `provider-tabpanel-${index}`,
  };
}

const CustomProviderManager: React.FC<CustomProviderManagerProps> = () => {
  const { user } = useAuth();
  const { providers } = useApiProviders();
  const [customProviders, setCustomProviders] = useState<CustomProvider[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [newProvider, setNewProvider] = useState<CustomProvider>({
    id: '',
    name: '',
    description: '',
    baseUrl: '',
    authType: 'bearer',
    headerName: '',
    enabled: true,
    usageEndpoint: '',
    costEndpoint: '',
    responseMapping: {
      usage: [],
      cost: [],
      timestamp: [],
    },
  });

  // Load custom providers
  useEffect(() => {
    const loadCustomProviders = async () => {
      setLoading(true);
      try {
        // This would normally fetch from an API
        // For now, we'll use mock data
        setTimeout(() => {
          setCustomProviders([
            {
              id: 'custom-1',
              name: 'Custom API Provider',
              description: 'A custom API provider for demonstration',
              baseUrl: 'https://api.custom-provider.com',
              authType: 'bearer',
              enabled: true,
              usageEndpoint: '/usage',
              costEndpoint: '/cost',
              responseMapping: {
                usage: ['data', 'usage'],
                cost: ['data', 'cost'],
                timestamp: ['data', 'timestamp'],
              },
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading custom providers:', error);
        setLoading(false);
      }
    };

    loadCustomProviders();
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleProvider = (id: string) => {
    setCustomProviders(prev =>
      prev.map(provider =>
        provider.id === id
          ? { ...provider, enabled: !provider.enabled }
          : provider
      )
    );
  };

  const handleDeleteProvider = (id: string) => {
    setProviderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProvider = () => {
    if (providerToDelete) {
      setCustomProviders(prev => prev.filter(provider => provider.id !== providerToDelete));
      setDeleteDialogOpen(false);
      setProviderToDelete(null);
    }
  };

  const handleEditProvider = (id: string) => {
    setEditMode(id);
    const provider = customProviders.find(p => p.id === id);
    if (provider) {
      setNewProvider({ ...provider });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setNewProvider({
      id: '',
      name: '',
      description: '',
      baseUrl: '',
      authType: 'bearer',
      headerName: '',
      enabled: true,
      usageEndpoint: '',
      costEndpoint: '',
      responseMapping: {
        usage: [],
        cost: [],
        timestamp: [],
      },
    });
    setTabValue(0);
  };

  const handleSaveEdit = () => {
    if (editMode === 'new') {
      // Add new provider
      const newId = `custom-${Date.now()}`;
      setCustomProviders(prev => [
        ...prev,
        {
          ...newProvider,
          id: newId,
        },
      ]);
    } else if (editMode) {
      // Update existing provider
      setCustomProviders(prev =>
        prev.map(provider =>
          provider.id === editMode
            ? { ...newProvider, id: provider.id }
            : provider
        )
      );
    }
    
    setEditMode(null);
    setNewProvider({
      id: '',
      name: '',
      description: '',
      baseUrl: '',
      authType: 'bearer',
      headerName: '',
      enabled: true,
      usageEndpoint: '',
      costEndpoint: '',
      responseMapping: {
        usage: [],
        cost: [],
        timestamp: [],
      },
    });
    setTabValue(0);
  };

  const handleInputChange = (field: keyof CustomProvider, value: any) => {
    setNewProvider(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResponseMappingChange = (field: keyof typeof newProvider.responseMapping, value: string) => {
    setNewProvider(prev => ({
      ...prev,
      responseMapping: {
        ...prev.responseMapping,
        [field]: value.split('.'),
      },
    }));
  };

  const handleAddNewProvider = () => {
    setEditMode('new');
    setNewProvider({
      id: '',
      name: '',
      description: '',
      baseUrl: '',
      authType: 'bearer',
      headerName: '',
      enabled: true,
      usageEndpoint: '',
      costEndpoint: '',
      responseMapping: {
        usage: [],
        cost: [],
        timestamp: [],
      },
    });
  };

  const handleSaveSettings = async () => {
    try {
      // This would normally save to an API
      console.log('Saving custom providers:', customProviders);
      
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
      console.error('Error saving custom providers:', error);
      setSaveError(true);
      setSaveSuccess(false);
      setLoading(false);
    }
  };

  const isValidProvider = () => {
    return (
      newProvider.name &&
      newProvider.baseUrl &&
      newProvider.usageEndpoint &&
      newProvider.responseMapping.usage.length > 0
    );
  };

  return (
    <Box>
      <Snackbar 
        open={saveSuccess} 
        autoHideDuration={3000} 
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">Custom providers saved successfully!</Alert>
      </Snackbar>
      
      <Snackbar 
        open={saveError} 
        autoHideDuration={3000} 
        onClose={() => setSaveError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">Failed to save custom providers. Please try again.</Alert>
      </Snackbar>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this custom provider? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteProvider} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Custom API Providers
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNewProvider}
            disabled={loading || editMode !== null}
          >
            Add Provider
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {editMode && (
          <Card sx={{ mb: 3, border: '1px dashed', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editMode === 'new' ? 'New Custom Provider' : 'Edit Custom Provider'}
              </Typography>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="provider configuration tabs">
                  <Tab label="Basic Info" icon={<InfoIcon />} iconPosition="start" {...a11yProps(0)} />
                  <Tab label="API Configuration" icon={<SettingsIcon />} iconPosition="start" {...a11yProps(1)} />
                  <Tab label="Response Mapping" icon={<CodeIcon />} iconPosition="start" {...a11yProps(2)} />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Provider Name"
                      value={newProvider.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      fullWidth
                      required
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      value={newProvider.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newProvider.enabled}
                          onChange={(e) => handleInputChange('enabled', e.target.checked)}
                          disabled={loading}
                        />
                      }
                      label="Enable Provider"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Base URL"
                      value={newProvider.baseUrl}
                      onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                      fullWidth
                      required
                      placeholder="https://api.example.com"
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Authentication Type"
                      value={newProvider.authType}
                      onChange={(e) => handleInputChange('authType', e.target.value)}
                      fullWidth
                      required
                      disabled={loading}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="bearer">Bearer Token</option>
                      <option value="key">API Key</option>
                      <option value="basic">Basic Auth</option>
                      <option value="oauth">OAuth</option>
                    </TextField>
                  </Grid>
                  
                  {(newProvider.authType === 'key') && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Header Name"
                        value={newProvider.headerName}
                        onChange={(e) => handleInputChange('headerName', e.target.value)}
                        fullWidth
                        placeholder="X-API-Key"
                        disabled={loading}
                      />
                    </Grid>
                  )}
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Usage Endpoint"
                      value={newProvider.usageEndpoint}
                      onChange={(e) => handleInputChange('usageEndpoint', e.target.value)}
                      fullWidth
                      required
                      placeholder="/v1/usage"
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Cost Endpoint (Optional)"
                      value={newProvider.costEndpoint}
                      onChange={(e) => handleInputChange('costEndpoint', e.target.value)}
                      fullWidth
                      placeholder="/v1/cost"
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Specify the path to extract data from the API response using dot notation (e.g., "data.usage").
                </Alert>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Usage Data Path"
                      value={newProvider.responseMapping.usage.join('.')}
                      onChange={(e) => handleResponseMappingChange('usage', e.target.value)}
                      fullWidth
                      required
                      placeholder="data.usage"
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Cost Data Path (Optional)"
                      value={newProvider.responseMapping.cost?.join('.') || ''}
                      onChange={(e) => handleResponseMappingChange('cost', e.target.value)}
                      fullWidth
                      placeholder="data.cost"
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Timestamp Path (Optional)"
                      value={newProvider.responseMapping.timestamp?.join('.') || ''}
                      onChange={(e) => handleResponseMappingChange('timestamp', e.target.value)}
                      fullWidth
                      placeholder="data.timestamp"
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
              <Box>
                {tabValue > 0 && (
                  <Button
                    onClick={() => setTabValue(tabValue - 1)}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                )}
                {tabValue < 2 && (
                  <Button
                    onClick={() => setTabValue(tabValue + 1)}
                    disabled={loading}
                    sx={{ ml: 1 }}
                  >
                    Next
                  </Button>
                )}
              </Box>
              <Box>
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
                  disabled={loading || !isValidProvider()}
                  startIcon={<CheckIcon />}
                  sx={{ ml: 1 }}
                >
                  {editMode === 'new' ? 'Add Provider' : 'Save Changes'}
                </Button>
              </Box>
            </CardActions>
          </Card>
        )}
        
        {customProviders.length === 0 && !editMode ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No custom providers configured. Click "Add Provider" to create one.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {customProviders.map(provider => (
              <Grid item xs={12} key={provider.id}>
                <Card sx={{ mb: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="div">
                          {provider.name}
                        </Typography>
                        <Chip
                          label={provider.enabled ? 'Enabled' : 'Disabled'}
                          size="small"
                          color={provider.enabled ? 'success' : 'default'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Box>
                        <Tooltip title="Edit Provider">
                          <IconButton
                            onClick={() => handleEditProvider(provider.id)}
                            disabled={loading || editMode !== null}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Provider">
                          <IconButton
                            onClick={() => handleDeleteProvider(provider.id)}
                            disabled={loading || editMode !== null}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {provider.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" component="div">
                          <strong>Base URL:</strong> {provider.baseUrl}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" component="div">
                          <strong>Auth Type:</strong> {provider.authType.toUpperCase()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" component="div">
                          <strong>Usage Endpoint:</strong> {provider.usageEndpoint}
                        </Typography>
                      </Grid>
                      {provider.costEndpoint && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" component="div">
                            <strong>Cost Endpoint:</strong> {provider.costEndpoint}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={provider.enabled}
                          onChange={() => handleToggleProvider(provider.id)}
                          disabled={loading || editMode !== null}
                        />
                      }
                      label={provider.enabled ? 'Enabled' : 'Disabled'}
                    />
                  </CardActions>
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
          {loading ? 'Saving...' : 'Save Provider Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default CustomProviderManager;
