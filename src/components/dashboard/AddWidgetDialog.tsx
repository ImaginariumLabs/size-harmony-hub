import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';
import { DashboardWidget } from '../../contexts/DashboardWidgetContext';

interface AddWidgetDialogProps {
  open: boolean;
  newWidget: Omit<DashboardWidget, 'id'>;
  configuredProviders: Array<{ id: string; name: string; isConfigured: boolean }>;
  onClose: () => void;
  onAdd: () => void;
  onChange: (widget: Omit<DashboardWidget, 'id'>) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({
  open,
  newWidget,
  configuredProviders,
  onClose,
  onAdd,
  onChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        Add Dashboard Widget
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="provider-select-label">API Provider</InputLabel>
            <Select
              labelId="provider-select-label"
              value={newWidget.providerId}
              label="API Provider"
              onChange={(e) => onChange({ ...newWidget, providerId: e.target.value })}
            >
              {configuredProviders.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the API provider to monitor</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="widget-type-select-label">Widget Type</InputLabel>
            <Select
              labelId="widget-type-select-label"
              value={newWidget.type}
              label="Widget Type"
              onChange={(e) => onChange({ ...newWidget, type: e.target.value as 'cost' | 'usage' | 'requests' })}
            >
              <MenuItem value="cost">Cost</MenuItem>
              <MenuItem value="usage">Usage</MenuItem>
              <MenuItem value="requests">Requests</MenuItem>
            </Select>
            <FormHelperText>Select the type of data to display</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="widget-size-select-label">Widget Size</InputLabel>
            <Select
              labelId="widget-size-select-label"
              value={newWidget.size}
              label="Widget Size"
              onChange={(e) => onChange({ ...newWidget, size: e.target.value as 'small' | 'medium' | 'large' })}
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
            <FormHelperText>Select the widget size</FormHelperText>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onAdd}
          variant="contained"
          color="primary"
          disabled={!newWidget.providerId}
        >
          Add Widget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWidgetDialog;
