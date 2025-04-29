import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

// Mock data for demonstration
const mockSystemStatus = {
  status: 'healthy',
  uptime: '7d 12h 34m',
  lastRestart: '2025-05-03 08:15:22',
  cpuUsage: 12,
  memoryUsage: 28,
  diskUsage: 45,
};

const mockUserStats = {
  totalUsers: 124,
  activeUsers: 87,
  newUsers: 12,
  userGrowth: 8.5,
};

const mockApiUsage = {
  totalCalls: 1245678,
  totalCost: 345.67,
  callsToday: 12456,
  costToday: 34.56,
  callsGrowth: 12.3,
  costGrowth: -5.2,
};

const mockRecentActivity = [
  { id: 1, user: 'admin@example.com', action: 'Updated system settings', timestamp: '2025-05-10 14:23:45' },
  { id: 2, user: 'john.doe@example.com', action: 'Added new API key', timestamp: '2025-05-10 13:45:12' },
  { id: 3, user: 'jane.smith@example.com', action: 'Created new user account', timestamp: '2025-05-10 12:30:08' },
  { id: 4, user: 'admin@example.com', action: 'Performed system backup', timestamp: '2025-05-10 10:15:33' },
  { id: 5, user: 'admin@example.com', action: 'Updated API provider configuration', timestamp: '2025-05-09 16:42:19' },
];

const mockAlerts = [
  { id: 1, type: 'warning', message: 'OpenAI API usage approaching budget limit', timestamp: '2025-05-10 14:30:00' },
  { id: 2, type: 'error', message: 'Failed to connect to Claude API', timestamp: '2025-05-10 13:15:22' },
  { id: 3, type: 'info', message: 'System backup completed successfully', timestamp: '2025-05-10 10:20:45' },
  { id: 4, type: 'success', message: 'All security checks passed', timestamp: '2025-05-10 09:05:12' },
];

const mockUsageTrends = [
  { date: '2025-05-01', apiCalls: 35000, cost: 120 },
  { date: '2025-05-02', apiCalls: 32000, cost: 110 },
  { date: '2025-05-03', apiCalls: 30000, cost: 105 },
  { date: '2025-05-04', apiCalls: 34000, cost: 115 },
  { date: '2025-05-05', apiCalls: 38000, cost: 130 },
  { date: '2025-05-06', apiCalls: 42000, cost: 145 },
  { date: '2025-05-07', apiCalls: 45000, cost: 155 },
  { date: '2025-05-08', apiCalls: 48000, cost: 165 },
  { date: '2025-05-09', apiCalls: 51000, cost: 175 },
  { date: '2025-05-10', apiCalls: 54000, cost: 185 },
];

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(mockSystemStatus);
  const [userStats, setUserStats] = useState(mockUserStats);
  const [apiUsage, setApiUsage] = useState(mockApiUsage);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [usageTrends, setUsageTrends] = useState(mockUsageTrends);

  useEffect(() => {
    // In a real implementation, this would fetch data from the server
    // For now, we're using mock data
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'critical':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'info':
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUpIcon color="success" fontSize="small" />
    ) : (
      <TrendingDownIcon color="error" fontSize="small" />
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} size="small" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader
              title="System Status"
              avatar={<DashboardIcon />}
              action={
                <Chip
                  label={systemStatus.status.toUpperCase()}
                  sx={{
                    backgroundColor: getStatusColor(systemStatus.status),
                    color: 'white',
                  }}
                />
              }
            />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText primary="Uptime" secondary={systemStatus.uptime} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Last Restart" secondary={systemStatus.lastRestart} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="CPU Usage"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgressWithLabel value={systemStatus.cpuUsage} />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Memory Usage"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgressWithLabel value={systemStatus.memoryUsage} />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Disk Usage"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgressWithLabel value={systemStatus.diskUsage} />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* User Statistics */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader title="User Statistics" avatar={<PeopleIcon />} />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText primary="Total Users" secondary={userStats.totalUsers} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Active Users" secondary={userStats.activeUsers} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="New Users (Last 7 Days)" secondary={userStats.newUsers} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="User Growth"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {userStats.userGrowth}%
                        {getGrowthIcon(userStats.userGrowth)}
                      </Box>
                    }
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/users')}
                  startIcon={<PeopleIcon />}
                >
                  Manage Users
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* API Usage */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader title="API Usage" avatar={<StorageIcon />} />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Total API Calls"
                    secondary={apiUsage.totalCalls.toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total Cost"
                    secondary={`$${apiUsage.totalCost.toFixed(2)}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="API Calls Today"
                    secondary={apiUsage.callsToday.toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Cost Today"
                    secondary={`$${apiUsage.costToday.toFixed(2)}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Call Growth"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {apiUsage.callsGrowth}%
                        {getGrowthIcon(apiUsage.callsGrowth)}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Cost Growth"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {apiUsage.costGrowth}%
                        {getGrowthIcon(apiUsage.costGrowth)}
                      </Box>
                    }
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/analytics')}
                  startIcon={<TrendingUpIcon />}
                >
                  View Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader title="Quick Actions" avatar={<SettingsIcon />} />
            <Divider />
            <CardContent>
              <List>
                <ListItem button onClick={() => navigate('/admin/users')}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItem>
                <ListItem button onClick={() => navigate('/admin/api-providers')}>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage API Providers" />
                </ListItem>
                <ListItem button onClick={() => navigate('/admin/analytics')}>
                  <ListItemIcon>
                    <TrendingUpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Usage Analytics" />
                </ListItem>
                <ListItem button onClick={() => navigate('/admin/settings')}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="System Settings" />
                </ListItem>
                <ListItem button onClick={() => navigate('/admin/security')}>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Security Management" />
                </ListItem>
                <ListItem button onClick={() => navigate('/admin/backup')}>
                  <ListItemIcon>
                    <BackupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Backup & Recovery" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Usage Trends */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader title="API Usage Trends" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={usageTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="apiCalls"
                      name="API Calls"
                      stroke={theme.palette.primary.main}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      name="Cost ($)"
                      stroke={theme.palette.secondary.main}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader
              title="System Alerts"
              action={
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/admin/alerts')}
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {alerts.length === 0 ? (
                <Alert severity="success">No active alerts</Alert>
              ) : (
                <List>
                  {alerts.map((alert) => (
                    <ListItem key={alert.id}>
                      <ListItemIcon>{getAlertIcon(alert.type)}</ListItemIcon>
                      <ListItemText
                        primary={alert.message}
                        secondary={formatTimestamp(alert.timestamp)}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Recent Activity"
              action={
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/admin/activity')}
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.user} - ${formatTimestamp(activity.timestamp)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper component for linear progress with label
const LinearProgressWithLabel: React.FC<{ value: number }> = ({ value }) => {
  const theme = useTheme();

  const getColor = (value: number) => {
    if (value < 60) return theme.palette.success.main;
    if (value < 80) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Box
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.palette.grey[300],
            position: 'relative',
          }}
        >
          <Box
            sx={{
              height: '100%',
              borderRadius: 5,
              backgroundColor: getColor(value),
              width: `${value}%`,
              transition: 'width 0.5s ease-in-out',
            }}
          />
        </Box>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
