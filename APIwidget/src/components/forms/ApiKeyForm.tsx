import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import { saveApiKey } from '../../services/keyManager';

interface ApiKeyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSuccess, onCancel }) => {
  const [provider, setProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [label, setLabel] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { providers, refreshProviders } = useApiProviders();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!provider) {
      setError('Please select a provider');
      return;
    }

    if (!apiKey) {
      setError('Please enter an API key');
      return;
    }

    setLoading(true);
    try {
      await saveApiKey(provider, apiKey, label || undefined);
      setSuccess('API key saved successfully');
      await refreshProviders();
      
      // Reset form
      setProvider('');
      setApiKey('');
      setLabel('');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="provider-label">API Provider</InputLabel>
        <Select
          labelId="provider-label"
          id="provider"
          value={provider}
          label="API Provider"
          onChange={(e) => setProvider(e.target.value)}
          disabled={loading}
        >
          {providers.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select the API provider for this key</FormHelperText>
      </FormControl>

      <TextField
        margin="normal"
        required
        fullWidth
        id="apiKey"
        label="API Key"
        name="apiKey"
        autoComplete="off"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        disabled={loading}
        type={showApiKey ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowApiKey(!showApiKey)}
                edge="end"
              >
                {showApiKey ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        margin="normal"
        fullWidth
        id="label"
        label="Label (Optional)"
        name="label"
        autoComplete="off"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        disabled={loading}
        helperText="A friendly name for this API key, e.g. 'Production OpenAI Key'"
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button onClick={onCancel} sx={{ mr: 2 }} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !provider || !apiKey}
        >
          {loading ? <CircularProgress size={24} /> : 'Save API Key'}
        </Button>
      </Box>
    </Box>
  );
};

export default ApiKeyForm;
