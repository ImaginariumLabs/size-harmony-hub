import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  ViewColumn as ViewColumnIcon,
  GridView as GridViewIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { LayoutType } from '../../hooks/useWidgetLayout';

interface WidgetControlsProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  onAddWidget: () => void;
}

/**
 * Widget Controls Component
 * 
 * Displays control buttons for adding widgets and changing layouts
 */
const WidgetControls: React.FC<WidgetControlsProps> = ({
  layout,
  onLayoutChange,
  onAddWidget
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 9999
      }}
    >
      <Tooltip title="Add Widget" placement="left" TransitionComponent={Fade} arrow>
        <IconButton
          color="primary"
          onClick={onAddWidget}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Line Layout" placement="left" TransitionComponent={Fade} arrow>
        <IconButton
          color={layout === 'line' ? 'secondary' : 'default'}
          onClick={() => onLayoutChange('line')}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Grid Layout" placement="left" TransitionComponent={Fade} arrow>
        <IconButton
          color={layout === 'grid' ? 'secondary' : 'default'}
          onClick={() => onLayoutChange('grid')}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <GridViewIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Free Layout" placement="left" TransitionComponent={Fade} arrow>
        <IconButton
          color={layout === 'free' ? 'secondary' : 'default'}
          onClick={() => onLayoutChange('free')}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default WidgetControls;
