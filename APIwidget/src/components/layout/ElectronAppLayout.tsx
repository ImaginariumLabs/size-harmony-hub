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
  History as HistoryIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Insights as InsightsIcon,
  Widgets as WidgetsIcon,
  ViewInAr as ViewInArIcon,
  VpnKey as VpnKeyIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  People as PeopleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
            <MenuItem onClick={() => {
              handleAccountMenuClose();
              navigate('/admin');
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Admin Dashboard
              </Box>
            </MenuItem>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <MenuItem onClick={handleAccountMenuClose}>Logout</MenuItem>
          </Menu>

          {/* Multiview Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<ViewInArIcon />}
            size="small"
            onClick={() => navigate('/floating-widgets')}
            sx={{
              ml: 2,
              background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2196f3, #1976d2)',
              },
              ...(isElectronEnv && { WebkitAppRegion: 'no-drag' as any })
            }}
          >
            Multiview
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
          {/* Main Menu Items */}
          <List>
            <ListItem button onClick={() => navigate('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate('/usage')}>
              <ListItemIcon>
                <InsightsIcon />
              </ListItemIcon>
              <ListItemText primary="Usage Analytics" />
            </ListItem>
            <ListItem button onClick={() => navigate('/history')}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Request History" />
            </ListItem>
            <ListItem button onClick={() => navigate('/widgets')}>
              <ListItemIcon>
                <WidgetsIcon />
              </ListItemIcon>
              <ListItemText primary="Widget Gallery" />
            </ListItem>
            <ListItem button onClick={() => navigate('/floating-widgets')}>
              <ListItemIcon>
                <ViewInArIcon />
              </ListItemIcon>
              <ListItemText primary="Floating Widgets" />
            </ListItem>
          </List>

          {/* API Providers */}
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Typography
            variant="overline"
            sx={{ px: 2, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}
          >
            API Providers
          </Typography>
          <List>
            <ListItem button onClick={() => navigate('/provider/openai')}>
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
            <ListItem button onClick={() => navigate('/provider/google')}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4285f4, #0d69c8)',
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
              <ListItemText primary="Gemini" />
            </ListItem>
            <ListItem button onClick={() => navigate('/provider/claude')}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7963d2, #5d4ba8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    C
                  </Typography>
                </Box>
              </ListItemIcon>
              <ListItemText primary="Claude" />
            </ListItem>
          </List>

          {/* Admin Section */}
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Typography
            variant="overline"
            sx={{ px: 2, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}
          >
            Administration
          </Typography>
          <List>
            <ListItem button onClick={() => navigate('/admin')}>
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate('/admin/users')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItem>
            <ListItem button onClick={() => navigate('/admin/settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="System Settings" />
            </ListItem>
          </List>

          {/* Bottom Menu Items */}
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <List>
            <ListItem button onClick={() => navigate('/settings/api-keys')}>
              <ListItemIcon>
                <VpnKeyIcon />
              </ListItemIcon>
              <ListItemText primary="API Keys" />
            </ListItem>
            <ListItem button onClick={() => navigate('/help')}>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
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
