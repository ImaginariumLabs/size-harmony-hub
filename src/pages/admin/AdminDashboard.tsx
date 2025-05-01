import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Settings as SettingsIcon,
  Api as ApiIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import { getAllProviderHealth } from '../../services/customProviderService';
import { ApiProviderHealth } from '../../types/api';

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { providers } = useApiProviders();
  const [loading, setLoading] = useState(true);
  const [providerHealth, setProviderHealth] = useState<Record<string, ApiProviderHealth>>({});
  const [recentActivity, setRecentActivity] = useState<{ action: string; timestamp: string; user: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provider health data
        const healthData = await getAllProviderHealth();
        setProviderHealth(healthData);

        // Mock recent activity data
        setRecentActivity([
          { action: 'User added', timestamp: new Date().toISOString(), user: 'admin@example.com' },
          { action: 'API provider updated', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'admin@example.com' },
          { action: 'System settings changed', timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'admin@example.com' },
        ]);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return theme.palette.success.main;
      case 'degraded':
        return theme.palette.warning.main;
      case 'outage':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'degraded':
      case 'outage':
        return <WarningIcon sx={{ color: status === 'degraded' ? theme.palette.warning.main : theme.palette.error.main }} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back, {user?.username || user?.email}
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.primary.dark,
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Users
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {Math.floor(Math.random() * 100)}
            </Typography>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => navigate('/admin/users')}
              sx={{ alignSelf: 'flex-end' }}
            >
              Manage Users
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.secondary.dark,
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              API Providers
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {providers.length}
            </Typography>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => navigate('/admin/api-providers')}
              sx={{ alignSelf: 'flex-end' }}
            >
              Manage Providers
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.success.dark,
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              API Requests
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {Math.floor(Math.random() * 10000)}
            </Typography>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => navigate('/admin/analytics')}
              sx={{ alignSelf: 'flex-end' }}
            >
              View Analytics
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.error.dark,
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Alerts
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {Object.values(providerHealth).filter(h => h.status !== 'operational').length}
            </Typography>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => navigate('/admin/alerts')}
              sx={{ alignSelf: 'flex-end' }}
            >
              View Alerts
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="System Status" />
            <Divider />
            <CardContent>
              <List>
                {providers.map((provider) => {
                  const health = providerHealth[provider.id] || {
                    status: 'unknown',
                    lastChecked: new Date().toISOString(),
                  };
                  return (
                    <ListItem key={provider.id}>
                      <ListItemIcon>
                        {getStatusIcon(health.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={provider.name}
                        secondary={`Last checked: ${new Date(health.lastChecked).toLocaleString()}`}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: getStatusColor(health.status),
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                        }}
                      >
                        {health.status}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Activity" />
            <Divider />
            <CardContent>
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${new Date(activity.timestamp).toLocaleString()} by ${activity.user}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Quick Actions" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Button
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/admin/users')}
                    fullWidth
                    sx={{ p: 1 }}
                  >
                    Users
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => navigate('/admin/settings')}
                    fullWidth
                    sx={{ p: 1 }}
                  >
                    Settings
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ApiIcon />}
                    onClick={() => navigate('/admin/api-providers')}
                    fullWidth
                    sx={{ p: 1 }}
                  >
                    Providers
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    onClick={() => navigate('/admin/analytics')}
                    fullWidth
                    sx={{ p: 1 }}
                  >
                    Analytics
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button
                    variant="outlined"
                    startIcon={<NotificationsIcon />}
                    onClick={() => navigate('/admin/alerts')}
                    fullWidth
                    sx={{ p: 1 }}
                  >
                    Alerts
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
