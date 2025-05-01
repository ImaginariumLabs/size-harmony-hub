import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiProviders } from '../contexts/ApiProviderContext';
import GeminiApiSettings from '../components/settings/GeminiApiSettings';
import OpenAIApiSettings from '../components/settings/OpenAIApiSettings';
import ClaudeApiSettings from '../components/settings/ClaudeApiSettings';
import { isElectron } from '../services/electronService';

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
      id={`api-key-tabpanel-${index}`}
      aria-labelledby={`api-key-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `api-key-tab-${index}`,
    'aria-controls': `api-key-tabpanel-${index}`,
  };
}

const ApiKeySettings: React.FC = () => {
  const navigate = useNavigate();
  const { providerId } = useParams<{ providerId?: string }>();
  const { providers, loading } = useApiProviders();
  const [activeTab, setActiveTab] = useState(0);

  // Set active tab based on provider ID from URL
  useEffect(() => {
    if (providerId) {
      const index = providers.findIndex(p => p.id === providerId);
      if (index !== -1) {
        setActiveTab(index);
      }
    }
  }, [providerId, providers]);

  // Ensure all providers are displayed
  useEffect(() => {
    if (providers.length === 0) {
      console.error('No API providers found');
    } else {
      console.log('Available providers:', providers.map(p => p.id).join(', '));
    }
  }, [providers]);

  // Add electron-environment class to body when in Electron
  useEffect(() => {
    if (isElectron()) {
      document.body.classList.add('electron-environment');
      console.log('Added electron-environment class to body in ApiKeySettings');

      // Force a re-render to ensure proper display in Electron
      const timer = setTimeout(() => {
        console.log('Forcing re-render in ApiKeySettings');
      }, 500);

      return () => {
        document.body.classList.remove('electron-environment');
        clearTimeout(timer);
      };
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Update URL to reflect selected provider
    navigate(`/settings/api-keys/${providers[newValue].id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Back to Dashboard">
            <IconButton onClick={() => navigate('/')} size="large">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            API Key Settings
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/settings/api-keys/new')}
        >
          Add New API Key
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="API provider tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme => theme.palette.primary.main,
              },
            }}
          >
            {providers.map((provider, index) => (
              <Tab
                key={provider.id}
                label={provider.name}
                {...a11yProps(index)}
                sx={{
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'text.primary',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {providers.map((provider, index) => (
            <TabPanel key={provider.id} value={activeTab} index={index}>
              <Typography variant="h6" gutterBottom>
                {provider.name} API Integration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {provider.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {provider.id === 'google' && <GeminiApiSettings />}

              {provider.id === 'openai' && <OpenAIApiSettings />}

              {provider.id === 'claude' && <ClaudeApiSettings />}
            </TabPanel>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ApiKeySettings;
