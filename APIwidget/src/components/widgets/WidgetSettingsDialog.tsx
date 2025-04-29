import React, { useState } from 'react';
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
  Typography,
  Box,
  Slider,
  Divider,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import { DashboardWidget } from '../../contexts/DashboardWidgetContext';

interface WidgetSettingsDialogProps {
  open: boolean;
  widgetId: string;
  widget: DashboardWidget;
  onClose: () => void;
  onSave: (widgetId: string, updates: Partial<DashboardWidget>) => void;
}

const WidgetSettingsDialog: React.FC<WidgetSettingsDialogProps> = ({
  open,
  widgetId,
  widget,
  onClose,
  onSave,
}) => {
  const { providers } = useApiProviders();
  const [providerId, setProviderId] = useState(widget.providerId);
  const [size, setSize] = useState(widget.size);
  const [type, setType] = useState(widget.type);
  const [opacity, setOpacity] = useState(70); // Default opacity 70%

  // Handle provider change
  const handleProviderChange = (event: SelectChangeEvent) => {
    setProviderId(event.target.value);
  };

  // Handle size change
  const handleSizeChange = (event: SelectChangeEvent) => {
    setSize(event.target.value as 'small' | 'medium' | 'large');
  };

  // Handle type change
  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as 'cost' | 'usage' | 'quota' | 'history');
  };

  // Handle opacity change
  const handleOpacityChange = (_event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  // Handle save
  const handleSave = () => {
    onSave(widgetId, {
      providerId,
      size,
      type,
      // We don't update position here as that's handled by dragging
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Widget Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="provider-select-label">API Provider</InputLabel>
            <Select
              labelId="provider-select-label"
              id="provider-select"
              value={providerId}
              label="API Provider"
              onChange={handleProviderChange}
            >
              {providers.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the API provider to display in this widget</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="type-select-label">Widget Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={type}
              label="Widget Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="cost">Cost</MenuItem>
              <MenuItem value="usage">Usage</MenuItem>
              <MenuItem value="quota">Quota</MenuItem>
              <MenuItem value="history">History</MenuItem>
            </Select>
            <FormHelperText>Select what information to display in the widget</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="size-select-label">Widget Size</InputLabel>
            <Select
              labelId="size-select-label"
              id="size-select"
              value={size}
              label="Widget Size"
              onChange={handleSizeChange}
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
            <FormHelperText>Select the size of the widget</FormHelperText>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography id="opacity-slider" gutterBottom>
            Background Opacity: {opacity}%
          </Typography>
          <Slider
            aria-labelledby="opacity-slider"
            value={opacity}
            onChange={handleOpacityChange}
            min={10}
            max={100}
            step={5}
            marks
            valueLabelDisplay="auto"
          />
          <FormHelperText>Adjust the transparency of the widget background</FormHelperText>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WidgetSettingsDialog;
