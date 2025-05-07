import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon,
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

  // Load existing API key on component mount with timeout protection
  useEffect(() => {
    const loadApiKey = async () => {
      // Create a timeout promise to prevent endless loading
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('API key load timed out after 5 seconds'));

          return () => {
            // Cleanup timeout to prevent memory leaks
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          };
        }, 5000); // 5 second timeout
      });

      try {
        // Race the API call against the timeout
        const key = await Promise.race([getApiKey('google'), timeout]);

        if (key) {
          setApiKey(key);
          setHasSavedKey(true);
          setIsValid(true);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
          console.error('Error loading API key:', error);
        }

        // Provide more specific error messages
        if (error instanceof Error && error.message.includes('timed out')) {
          if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
            console.warn('API key load timed out');
          }
        }
      }
    };

    loadApiKey();
  }, []);

  // Handle API key validation with timeout protection
  const handleValidate = async () => {
    if (!apiKey.trim()) return;

    // Create a timeout promise to prevent endless loading
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Validation timed out after 10 seconds'));
      }, 10000); // 10 second timeout
    });

    setIsValidating(true);
    setIsValid(null);

    try {
      // Race the API call against the timeout
      const valid = await Promise.race([validateApiKey(apiKey), timeout]);

      setIsValid(valid);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error validating API key:', error);
      }

      // Provide more specific error messages
      if (error instanceof Error && error.message.includes('timed out')) {
        if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
          console.warn('API key validation timed out');
        }
      }

      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle API key save with timeout protection
  const handleSave = async () => {
    if (!apiKey.trim() || !isValid) return;

    // Create a timeout promise to prevent endless loading
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Save operation timed out after 5 seconds'));
      }, 5000); // 5 second timeout
    });

    setIsSaving(true);

    try {
      // Race the API call against the timeout
      await Promise.race([saveApiKey('google', apiKey), timeout]);

      setHasSavedKey(true);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error saving API key:', error);
      }

      // Provide more specific error messages
      if (error instanceof Error && error.message.includes('timed out')) {
        if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
          console.warn('API key save operation timed out');
        }
      }
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
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Gemini API Settings
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your Gemini API key to track usage and costs. Your key is stored locally and never
            sent to our servers.
          </Typography>
        </Grid>

        <Grid sx={{ gridColumn: 'span 12' }}>
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
                    aria-label="Button description"
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />

            <Tooltip title="Copy API Key">
              <IconButton aria-label="Button description" onClick={handleCopy} disabled={!apiKey}>
                {copySuccess ? <CheckIcon color="success" /> : <CopyIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        {isValid === true && (
          <Grid sx={{ gridColumn: 'span 12' }}>
            <Alert severity="success">API key is valid!</Alert>
          </Grid>
        )}

        {isValid === false && (
          <Grid sx={{ gridColumn: 'span 12' }}>
            <Alert severity="error">Invalid API key. Please check and try again.</Alert>
          </Grid>
        )}

        <Grid sx={{ gridColumn: 'span 12' }}>
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

        <Grid sx={{ gridColumn: 'span 12', mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            How to get a Gemini API key:
          </Typography>
          <ol>
            <li>
              Go to{' '}
              <Link href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </Link>
            </li>
            <li>Sign in with your Google account</li>
            <li>Navigate to the API keys section</li>
            <li>Create a new API key</li>
            <li>Copy and paste it here</li>
          </ol>

          <Box
            sx={{
              mt: 3,
              mb: 2,
              p: 2,
              bgcolor: 'rgba(66, 133, 244, 0.1)',
              borderRadius: 1,
              border: '1px solid rgba(66, 133, 244, 0.2)',
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <InfoIcon fontSize="small" color="primary" />
              Gemini API Pricing Information
            </Typography>
            <Typography variant="body2" paragraph>
              Google offers a generous free tier for Gemini API usage. Current pricing (as of 2025):
            </Typography>
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                '& th, & td': { p: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
              }}
            >
              <Box component="thead" sx={{ '& th': { textAlign: 'left', fontWeight: 'bold' } }}>
                <Box component="tr">
                  <Box component="th">Model</Box>
                  <Box component="th">Input (per 1K tokens)</Box>
                  <Box component="th">Output (per 1K tokens)</Box>
                  <Box component="th">Free Monthly Quota</Box>
                </Box>
              </Box>
              <Box component="tbody">
                <Box component="tr">
                  <Box component="td">Gemini 1.5 Pro</Box>
                  <Box component="td">$0.0005</Box>
                  <Box component="td">$0.0015</Box>
                  <Box component="td">2M tokens</Box>
                </Box>
                <Box component="tr">
                  <Box component="td">Gemini 1.5 Flash</Box>
                  <Box component="td">$0.00025</Box>
                  <Box component="td">$0.0005</Box>
                  <Box component="td">4M tokens</Box>
                </Box>
                <Box component="tr">
                  <Box component="td">Gemini 1.0 Pro</Box>
                  <Box component="td">$0.0001</Box>
                  <Box component="td">$0.0005</Box>
                  <Box component="td">5M tokens</Box>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Check the{' '}
              <Link href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer">
                Google AI pricing page
              </Link>{' '}
              for the most current rates.
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            <Chip label="Free Tier" size="small" color="primary" sx={{ mr: 1 }} />
            Google's free tier is one of the most generous in the industry, making it an excellent
            choice for getting started with API integration.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GeminiApiSettings;
