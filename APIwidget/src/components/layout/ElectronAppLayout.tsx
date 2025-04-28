import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Api as ApiIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon
} from '@mui/icons-material';
import { isElectron } from '../../services/electronService';

interface ElectronAppLayoutProps {
  children: React.ReactNode;
  title?: string;
  onToggleWidget?: () => void;
  showWidget?: boolean;
}

const ElectronAppLayout: React.FC<ElectronAppLayoutProps> = ({
  children,
  title = 'APIwidget',
  onToggleWidget,
  showWidget = true
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [isElectronEnv, setIsElectronEnv] = useState(false);

  // Check if running in Electron
  useEffect(() => {
    setIsElectronEnv(isElectron());
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchor(null);
  };

  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximizeWindow) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    }
  };

  const drawerWidth = 240;

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#121212', // Ensure dark background
      color: '#ffffff' // Ensure light text
    }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
          ...(isElectronEnv && { WebkitAppRegion: 'drag' as any })
        }}
      >
        <Toolbar sx={{ minHeight: 48, px: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, ...(isElectronEnv && { WebkitAppRegion: 'no-drag' as any }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {/* Widget Toggle */}
          {onToggleWidget && (
            <FormControlLabel
              control={
                <Switch
                  checked={showWidget}
                  onChange={onToggleWidget}
                  color="primary"
                  size="small"
                />
              }
              label="Widget"
              sx={{
                mr: 2,
                ...(isElectronEnv && { WebkitAppRegion: 'no-drag' as any }),
                '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
              }}
            />
          )}

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationsMenuOpen}
              sx={{ ...(isElectronEnv && { WebkitAppRegion: 'no-drag' as any }) }}
            >
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notificationsMenuAnchor}
            open={Boolean(notificationsMenuAnchor)}
            onClose={handleNotificationsMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 320,
                maxHeight: 400,
                background: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2
              }
            }}
          >
            <MenuItem onClick={handleNotificationsMenuClose}>
              <Typography variant="body2">No new notifications</Typography>
            </MenuItem>
          </Menu>

          {/* Account Menu */}
          <Tooltip title="Account">
            <IconButton
              color="inherit"
              onClick={handleAccountMenuOpen}
              sx={{ ...(isElectronEnv && { WebkitAppRegion: 'no-drag' as any }) }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={handleAccountMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 200,
                background: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2
              }
            }}
          >
            <MenuItem onClick={handleAccountMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleAccountMenuClose}>Settings</MenuItem>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <MenuItem onClick={handleAccountMenuClose}>Logout</MenuItem>
          </Menu>

          {/* Add API Key Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<ApiIcon />}
            size="small"
            sx={{
              ml: 2,
              background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2196f3, #1976d2)',
              },
              ...(isElectronEnv && { WebkitAppRegion: 'no-drag' as any })
            }}
          >
            Add API Key
          </Button>

          {/* Window Controls for Electron */}
          {isElectronEnv && (
            <Box sx={{ ml: 2, display: 'flex', WebkitAppRegion: 'no-drag' as any }}>
              <IconButton
                color="inherit"
                onClick={handleMinimize}
                size="small"
                sx={{ p: 0.5 }}
              >
                <MinimizeIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleMaximize}
                size="small"
                sx={{ p: 0.5 }}
              >
                <MaximizeIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleClose}
                size="small"
                sx={{
                  p: 0.5,
                  '&:hover': {
                    color: '#f44336'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 48 }} />
        <Box sx={{ overflow: 'auto', px: 1, py: 2 }}>
          <List>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="API Usage" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItem>
          </List>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Typography
            variant="overline"
            sx={{ px: 2, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}
          >
            API Providers
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10a37f, #0d8a6f)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    O
                  </Typography>
                </Box>
              </ListItemIcon>
              <ListItemText primary="OpenAI" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #24292e, #1a1e22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    G
                  </Typography>
                </Box>
              </ListItemIcon>
              <ListItemText primary="GitHub" />
            </ListItem>
          </List>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <List>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#121212', // Ensure dark background
          color: '#ffffff' // Ensure light text
        }}
      >
        <Toolbar sx={{ minHeight: 48 }} />
        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
          backgroundColor: '#121212', // Ensure dark background
          color: '#ffffff' // Ensure light text
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ElectronAppLayout;
