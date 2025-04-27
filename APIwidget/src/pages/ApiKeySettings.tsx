import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { listApiKeys, deleteApiKey, saveApiKey, ApiKeyEntry } from '../services/keyManager';
import { useApiProviders } from '../contexts/ApiProviderContext';

const ApiKeySettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newKeyProvider, setNewKeyProvider] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();
  const { providers, refreshProviders } = useApiProviders();

  const fetchApiKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const keys = await listApiKeys();
      setApiKeys(keys);
    } catch (err) {
      setError('Failed to load API keys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleDeleteClick = (provider: string) => {
    setKeyToDelete(provider);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!keyToDelete) return;
    
    setLoading(true);
    try {
      await deleteApiKey(keyToDelete);
      setApiKeys(apiKeys.filter(key => key.provider !== keyToDelete));
      setSuccess(`API key for ${keyToDelete} deleted successfully`);
      refreshProviders();
    } catch (err) {
      setError('Failed to delete API key');
      console.error(err);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setKeyToDelete(null);
    }
  };

  const handleAddKey = async () => {
    setError(null);
    
    if (!newKeyProvider || !newKeyValue) {
      setError('Provider and API key are required');
      return;
    }
    
    setLoading(true);
    try {
      await saveApiKey(newKeyProvider, newKeyValue, newKeyLabel || undefined);
      await fetchApiKeys();
      setSuccess('API key added successfully');
      setAddDialogOpen(false);
      setNewKeyProvider('');
      setNewKeyValue('');
      setNewKeyLabel('');
      refreshProviders();
    } catch (err) {
      setError('Failed to add API key');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKey(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          API Key Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddDialogOpen(true)}
        >
          Add New API Key
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          {loading && apiKeys.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : apiKeys.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No API keys found
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setAddDialogOpen(true)}
                sx={{ mt: 2 }}
              >
                Add Your First API Key
              </Button>
            </Box>
          ) : (
            <List>
              {apiKeys.map((key, index) => (
                <React.Fragment key={key.provider}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{key.label || key.provider}</Typography>
                          <Chip
                            label={key.provider}
                            size="small"
                            sx={{ ml: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            API Key: 
                            {showKey[key.provider] ? (
                              <span style={{ fontFamily: 'monospace', marginLeft: 8 }}>
                                {key.key}
                              </span>
                            ) : (
                              <span style={{ fontFamily: 'monospace', marginLeft: 8 }}>
                                ••••••••••••••••••••••
                              </span>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => toggleKeyVisibility(key.provider)}
                              sx={{ ml: 1 }}
                            >
                              {showKey[key.provider] ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Added: {formatDate(key.created_at)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last used: {formatDate(key.last_used)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteClick(key.provider)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < apiKeys.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the API key for {keyToDelete}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add API Key Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New API Key</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Add a new API key to monitor usage and costs.
          </DialogContentText>
          <TextField
            select
            label="API Provider"
            value={newKeyProvider}
            onChange={(e) => setNewKeyProvider(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="API Key"
            value={newKeyValue}
            onChange={(e) => setNewKeyValue(e.target.value)}
            fullWidth
            margin="normal"
            required
            type={showKey['new'] ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => toggleKeyVisibility('new')}
                  edge="end"
                >
                  {showKey['new'] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <TextField
            label="Label (Optional)"
            value={newKeyLabel}
            onChange={(e) => setNewKeyLabel(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="e.g., Production OpenAI Key"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddKey}
            color="primary"
            variant="contained"
            disabled={!newKeyProvider || !newKeyValue || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add API Key'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApiKeySettings;
