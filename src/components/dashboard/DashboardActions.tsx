import React, { useState } from 'react';
import { Fab, SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';

interface DashboardActionsProps {
  onAddWidget: () => void;
  onAddAdvancedWidget?: () => void;
  disabled: boolean;
}

/**
 * DashboardActions component
 *
 * Provides floating action buttons for adding widgets to the dashboard.
 */
const DashboardActions: React.FC<DashboardActionsProps> = ({
  onAddWidget,
  onAddAdvancedWidget,
  disabled
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // If no advanced widget handler is provided, use simple FAB
  if (!onAddAdvancedWidget) {
    return (
      <Fab
        color="primary"
        aria-label="add widget"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2196f3, #1976d2)',
          }
        }}
        onClick={onAddWidget}
        disabled={disabled}
      >
        <AddIcon />
      </Fab>
    );
  }

  // With advanced widget handler, use SpeedDial
  return (
    <SpeedDial
      ariaLabel="dashboard actions"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
      }}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="up"
      FabProps={{
        sx: {
          background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2196f3, #1976d2)',
          }
        },
        disabled
      }}
    >
      <SpeedDialAction
        icon={<DashboardIcon />}
        tooltipTitle="Add Standard Widget"
        tooltipOpen
        onClick={() => {
          handleClose();
          onAddWidget();
        }}
      />
      <SpeedDialAction
        icon={<AnalyticsIcon />}
        tooltipTitle="Add Advanced Widget"
        tooltipOpen
        onClick={() => {
          handleClose();
          onAddAdvancedWidget();
        }}
      />
    </SpeedDial>
  );
};

export default DashboardActions;
