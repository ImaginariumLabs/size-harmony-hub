import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Paper } from '@mui/material';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

// Sample data for API providers
const apiProviders = [
  { id: 'openai', name: 'OpenAI', color: '#10a37f', usage: 65 },
  { id: 'github', name: 'GitHub', color: '#24292e', usage: 42 },
  { id: 'aws', name: 'AWS', color: '#ff9900', usage: 28 },
];

const WebApp: React.FC = () => {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            APIwidget
          </Typography>
          <Button variant="contained" color="primary">
            Add API Key
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {/* Sidebar */}
          <Box sx={{ width: 240, borderRight: '1px solid rgba(255, 255, 255, 0.12)', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              DASHBOARD
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant={activeProvider === null ? 'contained' : 'text'}
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                onClick={() => setActiveProvider(null)}
              >
                OVERVIEW
              </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
              API PROVIDERS
            </Typography>
            <Box>
              {apiProviders.map((provider) => (
                <Button
                  key={provider.id}
                  fullWidth
                  variant={activeProvider === provider.id ? 'contained' : 'text'}
                  sx={{ justifyContent: 'flex-start', mb: 1 }}
                  onClick={() => setActiveProvider(provider.id)}
                >
                  {provider.name}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              API Dashboard Overview
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total API Cost (This Month)
                  </Typography>
                  <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                    $24.56
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    API Requests (Today)
                  </Typography>
                  <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                    1,284
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Active API Providers
                  </Typography>
                  <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                    3
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* API Status */}
            <Paper sx={{ p: 2, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                API Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">OpenAI</Typography>
                  <Typography variant="body2">65% Used</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, height: 10, overflow: 'hidden' }}>
                  <Box sx={{ width: '65%', bgcolor: '#10a37f', height: '100%' }} />
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">GitHub</Typography>
                  <Typography variant="body2">42% Used</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, height: 10, overflow: 'hidden' }}>
                  <Box sx={{ width: '42%', bgcolor: '#24292e', height: '100%' }} />
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">AWS</Typography>
                  <Typography variant="body2">28% Used</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, height: 10, overflow: 'hidden' }}>
                  <Box sx={{ width: '28%', bgcolor: '#ff9900', height: '100%' }} />
                </Box>
              </Box>
            </Paper>

            {/* Recent Activity */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Today, 10:30 AM
                </Typography>
                <Typography variant="body1">
                  OpenAI API - 150 requests ($1.25)
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Today, 9:15 AM
                </Typography>
                <Typography variant="body1">
                  GitHub API - 75 requests ($0.00)
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Yesterday, 4:45 PM
                </Typography>
                <Typography variant="body1">
                  AWS API - 230 requests ($0.92)
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default WebApp;
