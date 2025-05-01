import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Menu,
  Avatar,
  Typography,
  Button,
  IconButton,
  Badge,
  Tooltip,
  MenuItem
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
    navigate('/login');
  };

  const handleAddApiKey = () => {
    navigate('/settings/api-keys/new');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontWeight: 600,
            background: 'linear-gradient(90deg, #90caf9, #64b5f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          APIwidget
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddApiKey}
            sx={{
              background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2196f3, #1976d2)',
              },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Add API Key
          </Button>

          <Tooltip title="Notifications">
            <IconButton
              size="medium"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
                borderRadius: '8px',
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              size="medium"
              color="inherit"
              onClick={() => navigate('/settings/api-keys')}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
                borderRadius: '8px',
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton
              size="medium"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
                borderRadius: '8px',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
                }}
                alt={user?.email || 'User'}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          style: {
            borderRadius: '12px',
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            minWidth: '180px',
            padding: '8px',
          }
        }}
      >
        <MenuItem
          onClick={() => { handleMenuClose(); navigate('/'); }}
          sx={{ borderRadius: '8px', mb: 0.5 }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => { handleMenuClose(); navigate('/settings/api-keys'); }}
          sx={{ borderRadius: '8px', mb: 0.5 }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleSignOut}
          sx={{ borderRadius: '8px', color: '#f44336' }}
        >
          Sign Out
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          style: {
            borderRadius: '12px',
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            minWidth: '280px',
            padding: '8px',
          }
        }}
      >
        <MenuItem
          onClick={handleNotificationsMenuClose}
          sx={{ borderRadius: '8px', mb: 0.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              OpenAI API Usage Warning
            </Typography>
            <Typography variant="caption" color="text.secondary">
              80% of monthly quota used
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={handleNotificationsMenuClose}
          sx={{ borderRadius: '8px', mb: 0.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              GitHub API Rate Limit
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Reset in 30 minutes
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={handleNotificationsMenuClose}
          sx={{ borderRadius: '8px' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              New Version Available
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Update to APIwidget v2.1.0
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
