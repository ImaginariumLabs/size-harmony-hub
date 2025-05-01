import React, { useState, useCallback, memo } from 'react';
import { Box, Menu, MenuItem, Card, CardHeader, CardContent, Divider, IconButton, Typography } from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { DashboardWidget as DashboardWidgetType } from '../../contexts/DashboardWidgetContext';
import { getMockProviderData } from '../../services/mockDataService';
import WidgetCustomizationDialog from './WidgetCustomizationDialog';

interface DashboardWidgetProps {
  widget: DashboardWidgetType;
  onRemove: (id: string) => void;
  onSizeChange: (id: string, size: 'small' | 'medium' | 'large') => void;
  onToggleVisibility: (id: string) => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  onRemove,
  onSizeChange,
  onToggleVisibility,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Get mock data for the provider
  const providerData = getMockProviderData(widget.providerId);

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle widget removal
  const handleRemove = () => {
    onRemove(widget.id);
    handleMenuClose();
  };

  // Handle widget size change
  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    onSizeChange(widget.id, size);
    handleMenuClose();
  };

  // Handle widget visibility toggle
  const handleToggleVisibility = () => {
    onToggleVisibility(widget.id);
    handleMenuClose();
  };

  // Handle opening the customization dialog
  const handleOpenCustomizeDialog = () => {
    setCustomizeDialogOpen(true);
    handleMenuClose();
  };

  // Handle closing the customization dialog
  const handleCloseCustomizeDialog = () => {
    setCustomizeDialogOpen(false);
  };

  // Handle widget update from customization dialog
  const handleWidgetUpdate = useCallback((updatedWidget: DashboardWidgetType) => {
    // Update size if changed
    if (updatedWidget.size !== widget.size) {
      onSizeChange(widget.id, updatedWidget.size);
    }

    // Update visibility if changed
    if (updatedWidget.isVisible !== widget.isVisible) {
      onToggleVisibility(widget.id);
    }

    // Close the dialog
    handleCloseCustomizeDialog();
  }, [widget.id, widget.size, widget.isVisible, onSizeChange, onToggleVisibility]);

  // Get provider color
  const getProviderColor = (providerId: string): string => {
    switch (providerId) {
      case 'openai':
        return '#10a37f';
      case 'github':
        return '#24292e';
      case 'aws':
        return '#ff9900';
      case 'google':
        return '#4285f4';
      case 'azure':
        return '#0089d6';
      default:
        return '#64b5f6';
    }
  };

  // Get provider name
  const getProviderName = (providerId: string): string => {
    switch (providerId) {
      case 'openai':
        return 'OpenAI';
      case 'github':
        return 'GitHub';
      case 'aws':
        return 'AWS';
      case 'google':
        return 'Google Cloud';
      case 'azure':
        return 'Azure';
      default:
        return providerId;
    }
  };



  // Get widget height
  const getWidgetHeight = () => {
    switch (widget.size) {
      case 'small':
        return 180;
      case 'medium':
        return 240;
      case 'large':
        return 300;
      default:
        return 180;
    }
  };

  // Render different widget types
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'cost':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              ${providerData.total.toFixed(2)}
            </Typography>
            <Typography
              variant="body1"
              color={providerData.changeType === 'increase' ? 'error.main' : 'success.main'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {providerData.changeType === 'increase' ? '↑' : '↓'} ${providerData.change.toFixed(2)} ({(providerData.change / providerData.total * 100).toFixed(1)}%)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              Updated just now
            </Typography>
          </Box>
        );
      case 'usage':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              65%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              of monthly quota used
            </Typography>
            <Box sx={{ width: '80%', mt: 2, bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
              <Box
                sx={{
                  height: 8,
                  width: '65%',
                  bgcolor: getProviderColor(widget.providerId),
                  borderRadius: 1
                }}
              />
            </Box>
          </Box>
        );
      case 'quota':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              1,284
            </Typography>
            <Typography variant="body1" color="text.secondary">
              API requests today
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ mt: 2 }}>
              8% more than yesterday
            </Typography>
          </Box>
        );
      case 'history':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Last 7 days usage
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 100, gap: 1 }}>
              {[35, 42, 58, 45, 62, 68, 75].map((value, index) => (
                <Box
                  key={index}
                  sx={{
                    height: `${value}%`,
                    width: 12,
                    bgcolor: getProviderColor(widget.providerId),
                    borderRadius: '4px 4px 0 0',
                    opacity: 0.8
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">Mon</Typography>
              <Typography variant="caption" color="text.secondary">Sun</Typography>
            </Box>
          </Box>
        );
      default:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              Widget type not supported
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Card
      sx={{
        height: getWidgetHeight(),
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: `linear-gradient(135deg, ${getProviderColor(widget.providerId)}22 0%, #12121222 100%)`,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
      }}
    >
      <CardHeader
        title={`${getProviderName(widget.providerId)} ${widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}`}
        avatar={
          <Box className="widget-drag-handle" sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', '&:active': { cursor: 'grabbing' } }}>
            <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </Box>
        }
        action={
          <IconButton
            aria-label="widget settings"
            aria-controls={open ? 'widget-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
        sx={{
          pb: 0,
          '& .MuiCardHeader-title': {
            fontSize: '1rem',
            fontWeight: 500,
          },
          '& .MuiCardHeader-avatar': {
            marginRight: 1
          }
        }}
      />
      <Menu
        id="widget-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'widget-menu-button',
        }}
      >
        <MenuItem onClick={() => handleSizeChange('small')}>
          <ZoomOutIcon fontSize="small" sx={{ mr: 1 }} />
          Small
        </MenuItem>
        <MenuItem onClick={() => handleSizeChange('medium')}>
          <ZoomInIcon fontSize="small" sx={{ mr: 1 }} />
          Medium
        </MenuItem>
        <MenuItem onClick={() => handleSizeChange('large')}>
          <ZoomInIcon fontSize="small" sx={{ mr: 1 }} />
          Large
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenCustomizeDialog}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Customize
        </MenuItem>
        <MenuItem onClick={handleToggleVisibility}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          {widget.isVisible ? 'Hide in Widget' : 'Show in Widget'}
        </MenuItem>
        <MenuItem onClick={handleRemove}>
          <CloseIcon fontSize="small" sx={{ mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>

      {/* Widget Customization Dialog */}
      <WidgetCustomizationDialog
        open={customizeDialogOpen}
        widget={widget}
        onClose={handleCloseCustomizeDialog}
        onUpdate={handleWidgetUpdate}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(DashboardWidget, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.widget.size === nextProps.widget.size &&
    prevProps.widget.isVisible === nextProps.widget.isVisible &&
    prevProps.widget.type === nextProps.widget.type &&
    prevProps.widget.providerId === nextProps.widget.providerId
  );
});
