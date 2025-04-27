import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApiProviders } from '../contexts/ApiProviderContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { providers, loading } = useApiProviders();
  
  const configuredProviders = providers.filter(provider => provider.isConfigured);
  const unconfiguredProviders = providers.filter(provider => !provider.isConfigured);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/settings/api-keys/new')}
        >
          Add New API Key
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : configuredProviders.length === 0 ? (
        <Card sx={{ mb: 4, p: 2, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              Welcome to APIwidget!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first API key to monitor usage and costs.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/settings/api-keys/new')}
            >
              Add Your First API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total API Cost (This Month)
                </Typography>
                <Typography
                  component="p"
                  variant="h4"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  $24.56
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="success.main"
                >
                  <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                  12% less than last month
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
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  API Requests (Today)
                </Typography>
                <Typography
                  component="p"
                  variant="h4"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  1,284
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="success.main"
                >
                  <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                  8% more than yesterday
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
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Active API Providers
                </Typography>
                <Typography
                  component="p"
                  variant="h4"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  {configuredProviders.length}
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/settings/api-keys')}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Manage API Keys
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* API Status */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="API Status" />
                <Divider />
                <CardContent>
                  <List>
                    {configuredProviders.map((provider) => (
                      <ListItem
                        key={provider.id}
                        secondaryAction={
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/provider/${provider.id}`)}
                          >
                            Details
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <ApiIcon sx={{ color: provider.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={provider.name}
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                Usage: 65%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={65}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Alerts" />
                <Divider />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="OpenAI API Usage"
                        secondary="80% of monthly quota used"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="GitHub API Rate Limit"
                        secondary="Reset in 30 minutes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="AWS API"
                        secondary="All services operational"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
