import React from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ViewDay as ViewDayIcon,
  ViewInAr as ViewInArIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  lastRefreshed: Date;
  showMultiview: boolean;
  configuredProvidersCount: number;
  onRefresh: () => void;
  onAddWidget: () => void;
  onToggleMultiview: () => void;
  onShare?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastRefreshed,
  showMultiview,
  configuredProvidersCount,
  onRefresh,
  onAddWidget,
  onToggleMultiview,
  onShare,
}) => {
  const navigate = useNavigate();

  const formatLastRefreshed = () => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastRefreshed.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    return lastRefreshed.toLocaleString();
  };

  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
        API Dashboard Overview
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: {formatLastRefreshed()}
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={onRefresh} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Button
          variant="outlined"
          color="primary"
          onClick={onAddWidget}
          disabled={configuredProvidersCount === 0}
          startIcon={<AddIcon />}
        >
          Add Widget
        </Button>
        <Button
          variant={showMultiview ? "contained" : "outlined"}
          color="primary"
          onClick={onToggleMultiview}
          startIcon={<ViewDayIcon />}
          sx={{ mr: 1 }}
        >
          Multiview
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/floating-widgets')}
          startIcon={<ViewInArIcon />}
        >
          Floating Widgets
        </Button>

        {onShare && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onShare}
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DashboardHeader;
