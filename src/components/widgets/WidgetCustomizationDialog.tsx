import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import { DashboardWidget as DashboardWidgetType } from '../../contexts/DashboardWidgetContext';

interface WidgetCustomizationDialogProps {
  open: boolean;
  widget: DashboardWidgetType;
  onClose: () => void;
  onUpdate: (widget: DashboardWidgetType) => void;
}

/**
 * Enhanced widget customization dialog
 * 
 * Allows users to customize various aspects of a dashboard widget.
 */
const WidgetCustomizationDialog: React.FC<WidgetCustomizationDialogProps> = ({
  open,
  widget,
  onClose,
  onUpdate
}) => {
  const [widgetConfig, setWidgetConfig] = useState<DashboardWidgetType>({...widget});
  
  // Handle field changes
  const handleChange = (field: keyof DashboardWidgetType, value: any) => {
    setWidgetConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle type change
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('type', event.target.value);
  };
  
  // Handle size change
  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('size', event.target.value);
  };
  
  // Handle provider change
  const handleProviderChange = (event: SelectChangeEvent) => {
    handleChange('providerId', event.target.value);
  };
  
  // Handle save
  const handleSave = () => {
    onUpdate(widgetConfig);
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Customize Widget</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="provider-select-label">API Provider</InputLabel>
            <Select
              labelId="provider-select-label"
              id="provider-select"
              value={widgetConfig.providerId}
              label="API Provider"
              onChange={handleProviderChange}
            >
              <MenuItem value="openai">OpenAI</MenuItem>
              <MenuItem value="claude">Claude</MenuItem>
              <MenuItem value="google">Google (Gemini)</MenuItem>
              <MenuItem value="github">GitHub</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle1" gutterBottom>
            Widget Type
          </Typography>
          <RadioGroup
            value={widgetConfig.type}
            onChange={handleTypeChange}
            row
            sx={{ mb: 3 }}
          >
            <FormControlLabel value="cost" control={<Radio />} label="Cost" />
            <FormControlLabel value="usage" control={<Radio />} label="Usage" />
            <FormControlLabel value="quota" control={<Radio />} label="Quota" />
            <FormControlLabel value="history" control={<Radio />} label="History" />
          </RadioGroup>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Widget Size
          </Typography>
          <RadioGroup
            value={widgetConfig.size}
            onChange={handleSizeChange}
            row
            sx={{ mb: 3 }}
          >
            <FormControlLabel value="small" control={<Radio />} label="Small" />
            <FormControlLabel value="medium" control={<Radio />} label="Medium" />
            <FormControlLabel value="large" control={<Radio />} label="Large" />
          </RadioGroup>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Position
          </Typography>
          <Box sx={{ px: 2, mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              X Position
            </Typography>
            <Slider
              value={widgetConfig.position.x}
              onChange={(_, value) => handleChange('position', { ...widgetConfig.position, x: value as number })}
              min={0}
              max={100}
              valueLabelDisplay="auto"
            />
            
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              Y Position
            </Typography>
            <Slider
              value={widgetConfig.position.y}
              onChange={(_, value) => handleChange('position', { ...widgetConfig.position, y: value as number })}
              min={0}
              max={100}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Appearance
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={widgetConfig.isVisible}
                onChange={(e) => handleChange('isVisible', e.target.checked)}
              />
            }
            label="Visible"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WidgetCustomizationDialog;
