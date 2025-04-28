import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ApiKeyManager from '../components/settings/ApiKeyManager';

const ApiKeySettings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        API Key Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your API keys for different providers. These keys are stored securely and used to fetch usage and cost data.
      </Typography>

      <ApiKeyManager />
    </Box>
  );
};

export default ApiKeySettings;
