import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Api as ApiIcon } from '@mui/icons-material';

interface EmptyDashboardStateProps {
  onAddApiKey: () => void;
}

const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({ onAddApiKey }) => {
  return (
    <Card sx={{ 
      mb: 4, 
      p: 2, 
      textAlign: 'center', 
      borderRadius: '16px', 
      background: 'rgba(30, 30, 30, 0.7)', 
      backdropFilter: 'blur(10px)', 
      border: '1px solid rgba(255, 255, 255, 0.1)' 
    }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 600 }}>
          Welcome to APIwidget!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Get started by adding your first API key to monitor usage and costs.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onAddApiKey}
          startIcon={<ApiIcon />}
        >
          Add Your First API Key
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyDashboardState;
