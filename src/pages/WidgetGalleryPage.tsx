import React from 'react';
import { Box, Breadcrumbs, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WidgetGallery from '../components/widgets/WidgetGallery';

const WidgetGalleryPage: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/" color="inherit">
            Dashboard
          </Link>
          <Typography color="text.primary">Widget Gallery</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Widget Gallery
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Customize your dashboard with widgets to monitor your API usage and costs.
        </Typography>
      </Box>

      <WidgetGallery />
    </Box>
  );
};

export default WidgetGalleryPage;
