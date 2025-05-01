import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

/**
 * DashboardBreadcrumbs component
 * 
 * Displays breadcrumb navigation based on the current route path.
 * Improves user orientation within the application.
 */
const DashboardBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Map of path segments to display names
  const pathDisplayNames: Record<string, string> = {
    'settings': 'Settings',
    'api-keys': 'API Keys',
    'new': 'Add New',
    'provider': 'Provider',
    'openai': 'OpenAI',
    'claude': 'Claude',
    'google': 'Google',
    'github': 'GitHub',
    'usage': 'Usage Analytics',
    'history': 'Request History',
    'widgets': 'Widget Gallery',
    'floating-widgets': 'Floating Widgets',
    'help': 'Help & Support',
    'admin': 'Admin',
  };
  
  // If we're at the root path, don't show breadcrumbs
  if (pathnames.length === 0) {
    return null;
  }
  
  return (
    <Box sx={{ mb: 3, mt: 1 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
      >
        <Link 
          component={RouterLink} 
          to="/" 
          color="inherit" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          Dashboard
        </Link>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = pathDisplayNames[value] || value.charAt(0).toUpperCase() + value.slice(1);
          
          return last ? (
            <Typography color="text.primary" key={to}>
              {displayName}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              color="inherit"
              key={to}
              sx={{ 
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              {displayName}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default DashboardBreadcrumbs;
