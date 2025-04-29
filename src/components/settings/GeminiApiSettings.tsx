import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Chip,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { validateApiKey } from '../../services/geminiService';
import { saveApiKey, getApiKey } from '../../services/electronService';

const GeminiApiSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load existing API key on component mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await getApiKey('google');
        if (key) {
          setApiKey(key);
          setHasSavedKey(true);
          setIsValid(true);
        }
      } catch (error) {
        console.error('Error loading API key:', error);
      }
    };

    loadApiKey();
  }, []);

  // Handle API key validation
  const handleValidate = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setIsValid(null);

    try {
      const valid = await validateApiKey(apiKey);
      setIsValid(valid);
    } catch (error) {
      console.error('Error validating API key:', error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle API key save
  const handleSave = async () => {
    if (!apiKey.trim() || !isValid) return;

    setIsSaving(true);

    try {
      await saveApiKey('google', apiKey);
      setHasSavedKey(true);
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Handle API key change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsValid(null);
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Typography variant="h6" gutterBottom>
        Gemini API Settings
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your Gemini API key to track usage and costs. Your key is stored locally and never sent to our servers.
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField
              label="Gemini API Key"
              variant="outlined"
              fullWidth
              value={apiKey}
              onChange={handleApiKeyChange}
              type={showApiKey ? 'text' : 'password'}
              placeholder="Enter your Gemini API key"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            
            <Tooltip title="Copy API Key">
              <IconButton onClick={handleCopy} disabled={!apiKey}>
                {copySuccess ? <CheckIcon color="success" /> : <CopyIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        
        {isValid === true && (
          <Grid item xs={12}>
            <Alert severity="success">API key is valid!</Alert>
          </Grid>
        )}
        
        {isValid === false && (
          <Grid item xs={12}>
            <Alert severity="error">Invalid API key. Please check and try again.</Alert>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={handleValidate}
              disabled={!apiKey.trim() || isValidating}
              startIcon={isValidating ? <CircularProgress size={20} /> : null}
            >
              {isValidating ? 'Validating...' : 'Validate Key'}
            </Button>
            
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!apiKey.trim() || isValid !== true || isSaving}
              startIcon={isSaving ? <CircularProgress size={20} /> : null}
            >
              {isSaving ? 'Saving...' : hasSavedKey ? 'Update Key' : 'Save Key'}
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            How to get a Gemini API key:
          </Typography>
          <ol>
            <li>Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Navigate to the API keys section</li>
            <li>Create a new API key</li>
            <li>Copy and paste it here</li>
          </ol>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GeminiApiSettings;
