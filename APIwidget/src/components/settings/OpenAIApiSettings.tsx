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
  Link,
} from '@mui/material';
import {
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { validateApiKey } from '../../services/openaiService';
import { getApiKey, saveApiKey } from '../../services/electronService';

const OpenAIApiSettings: React.FC = () => {
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
        const key = await getApiKey('openai');
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
      // First check the format
      const isValidFormat = apiKey.startsWith('sk-') && apiKey.length > 30;

      if (!isValidFormat) {
        setIsValid(false);
        return;
      }

      // Make a real API call to validate the key
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
      await saveApiKey('openai', apiKey);
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
        OpenAI API Settings
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your OpenAI API key to track usage and costs. Your key is stored locally and never sent to our servers.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField
              label="OpenAI API Key"
              variant="outlined"
              fullWidth
              value={apiKey}
              onChange={handleApiKeyChange}
              type={showApiKey ? 'text' : 'password'}
              placeholder="Enter your OpenAI API key (starts with sk-)"
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
            <Alert severity="error">Invalid API key. OpenAI API keys typically start with "sk-" and are at least 30 characters long.</Alert>
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
            How to get an OpenAI API key:
          </Typography>
          <ol>
            <li>Go to <Link href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI API Keys</Link></li>
            <li>Sign in with your OpenAI account</li>
            <li>Click "Create new secret key"</li>
            <li>Copy and paste it here</li>
          </ol>

          <Box sx={{ mt: 3, mb: 2, p: 2, bgcolor: 'rgba(16, 163, 127, 0.1)', borderRadius: 1, border: '1px solid rgba(16, 163, 127, 0.2)' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon fontSize="small" color="primary" />
              OpenAI API Pricing Information
            </Typography>
            <Typography variant="body2" paragraph>
              OpenAI API usage is billed based on the number of tokens processed. Current pricing (as of 2025):
            </Typography>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& th, & td': { p: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' } }}>
              <Box component="thead" sx={{ '& th': { textAlign: 'left', fontWeight: 'bold' } }}>
                <Box component="tr">
                  <Box component="th">Model</Box>
                  <Box component="th">Input (per 1K tokens)</Box>
                  <Box component="th">Output (per 1K tokens)</Box>
                </Box>
              </Box>
              <Box component="tbody">
                <Box component="tr">
                  <Box component="td">GPT-4o</Box>
                  <Box component="td">$0.005</Box>
                  <Box component="td">$0.015</Box>
                </Box>
                <Box component="tr">
                  <Box component="td">GPT-4 Turbo</Box>
                  <Box component="td">$0.01</Box>
                  <Box component="td">$0.03</Box>
                </Box>
                <Box component="tr">
                  <Box component="td">GPT-3.5 Turbo</Box>
                  <Box component="td">$0.0005</Box>
                  <Box component="td">$0.0015</Box>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Check the <Link href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer">OpenAI pricing page</Link> for the most current rates.
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            <Chip label="Free Tier" size="small" color="primary" sx={{ mr: 1 }} />
            OpenAI offers $5 in free API credits that can be used during your first 3 months.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OpenAIApiSettings;
