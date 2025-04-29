import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiProviders } from '../contexts/ApiProviderContext';
import GeminiApiSettings from '../components/settings/GeminiApiSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-key-tabpanel-${index}`}
      aria-labelledby={`api-key-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

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
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
              px: 3,
            }
          }}
        >
          {providers.map((provider) => (
            <Tab
              key={provider.id}
              label={provider.name}
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: provider.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    mr: 1
                  }}
                >
                  {provider.name.charAt(0)}
                </Box>
              }
              iconPosition="start"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textTransform: 'none',
                fontWeight: 500,
              }}
            />
          ))}
        </Tabs>

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
              
              {provider.id === 'openai' && (
                <Typography variant="body1">
                  OpenAI API key settings will be implemented here.
                </Typography>
              )}
              
              {provider.id === 'claude' && (
                <Typography variant="body1">
                  Claude API key settings will be implemented here.
                </Typography>
              )}
            </TabPanel>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ApiKeySettings;
