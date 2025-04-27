import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Api as ApiIcon,
  Settings as SettingsIcon,
  Insights as InsightsIcon,
  History as HistoryIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApiProviders } from '../../contexts/ApiProviderContext';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { providers, loading } = useApiProviders();

  const configuredProviders = providers.filter(provider => provider.isConfigured);

  const mainMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'API Usage',
      icon: <InsightsIcon />,
      path: '/usage',
    },
    {
      text: 'History',
      icon: <HistoryIcon />,
      path: '/history',
    },
  ];

  const bottomMenuItems = [
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
    {
      text: 'Help',
      icon: <HelpIcon />,
      path: '/help',
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          APIwidget
        </Typography>
      </Box>
      <Divider />
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(144, 202, 249, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(144, 202, 249, 0.12)',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          API PROVIDERS
        </Typography>
      </Box>
      <List>
        {loading ? (
          <ListItem>
            <ListItemText primary="Loading..." />
          </ListItem>
        ) : configuredProviders.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary="No APIs configured" 
              secondary="Add your first API key in settings"
              secondaryTypographyProps={{ fontSize: '0.75rem' }}
            />
          </ListItem>
        ) : (
          configuredProviders.map((provider) => (
            <ListItem key={provider.id} disablePadding>
              <Tooltip title={provider.description} placement="right">
                <ListItemButton
                  selected={location.pathname === `/provider/${provider.id}`}
                  onClick={() => navigate(`/provider/${provider.id}`)}
                >
                  <ListItemIcon>
                    <Badge color="success" variant="dot">
                      <ApiIcon sx={{ color: provider.color }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary={provider.name} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))
        )}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
