import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import { AdvancedWidgetType, AdvancedWidgetConfig } from '../widgets/AdvancedWidgetFactory';
import { ApiProvider } from '../../types/api';

interface AddAdvancedWidgetDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: AdvancedWidgetType, config: AdvancedWidgetConfig) => void;
  configuredProviders: ApiProvider[];
}

/**
 * AddAdvancedWidgetDialog component
 *
 * Dialog for adding advanced widgets to the dashboard.
 */
const AddAdvancedWidgetDialog: React.FC<AddAdvancedWidgetDialogProps> = ({
  open,
  onClose,
  onAdd,
  configuredProviders,
}) => {
  const [widgetType, setWidgetType] = useState<AdvancedWidgetType>('comparison');
  const [title, setTitle] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [providerId, setProviderId] = useState('');
  const [metricType, setMetricType] = useState<'cost' | 'usage' | 'quota'>('cost');
  const [customMetricType, setCustomMetricType] = useState<'percentage' | 'value' | 'ratio' | 'distribution'>('value');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricUnit, setMetricUnit] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  // Reset form
  const resetForm = () => {
    setWidgetType('comparison');
    setTitle('');
    setSelectedProviders([]);
    setProviderId('');
    setMetricType('cost');
    setCustomMetricType('value');
    setMetricLabel('');
    setMetricUnit('');
    setErrors({});
  };

  // Handle widget type change
  const handleWidgetTypeChange = (event: SelectChangeEvent<AdvancedWidgetType>) => {
    setWidgetType(event.target.value as AdvancedWidgetType);
    setErrors({});
  };

  // Handle provider selection for comparison widget
  const handleProviderSelection = (event: SelectChangeEvent<string[]>) => {
    setSelectedProviders(event.target.value as string[]);
    setErrors({
      ...errors,
      providers: event.target.value.length === 0 ? 'Select at least one provider' : '',
    });
  };

  // Handle provider selection for trend widget
  const handleProviderChange = (event: SelectChangeEvent<string>) => {
    setProviderId(event.target.value);
    setErrors({
      ...errors,
      providerId: event.target.value === '' ? 'Provider is required' : '',
    });
  };

  // Handle metric type change
  const handleMetricTypeChange = (event: SelectChangeEvent<'cost' | 'usage' | 'quota'>) => {
    setMetricType(event.target.value as 'cost' | 'usage' | 'quota');
  };

  // Handle custom metric type change
  const handleCustomMetricTypeChange = (event: SelectChangeEvent<'percentage' | 'value' | 'ratio' | 'distribution'>) => {
    setCustomMetricType(event.target.value as 'percentage' | 'value' | 'ratio' | 'distribution');
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (title.trim() === '') {
      newErrors.title = 'Title is required';
    }

    switch (widgetType) {
      case 'comparison':
        if (selectedProviders.length === 0) {
          newErrors.providers = 'Select at least one provider';
        }
        break;

      case 'trend':
        if (providerId === '') {
          newErrors.providerId = 'Provider is required';
        }
        break;

      case 'custom':
        if (metricLabel.trim() === '') {
          newErrors.metricLabel = 'Metric label is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add widget
  const handleAddWidget = () => {
    if (!validateForm()) {
      return;
    }

    let config: AdvancedWidgetConfig = { title };

    switch (widgetType) {
      case 'comparison':
        config = {
          ...config,
          providers: selectedProviders,
          metricType,
        };
        break;

      case 'trend':
        config = {
          ...config,
          providerId,
        };
        break;

      case 'custom':
        config = {
          ...config,
          metricType: customMetricType,
          metricConfig: {
            unit: metricUnit,
          },
          label: metricLabel,
        };
        break;

      case 'alert':
        // No additional config needed
        break;
    }

    onAdd(widgetType, config);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Advanced Widget</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="widget-type-label">Widget Type</InputLabel>
                <Select
                  labelId="widget-type-label"
                  id="widget-type"
                  value={widgetType}
                  label="Widget Type"
                  onChange={handleWidgetTypeChange}
                >
                  <MenuItem value="comparison">Comparison Widget</MenuItem>
                  <MenuItem value="trend">Trend Analysis Widget</MenuItem>
                  <MenuItem value="custom">Custom Metric Widget</MenuItem>
                  <MenuItem value="alert">Alert Widget</MenuItem>
                </Select>
                <FormHelperText>
                  Select the type of advanced widget to add
                </FormHelperText>
              </FormControl>

              <TextField
                fullWidth
                label="Widget Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title || 'Enter a title for the widget'}
                sx={{ mb: 3 }}
              />

              {widgetType === 'comparison' && (
                <>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="providers-label">API Providers</InputLabel>
                    <Select
                      labelId="providers-label"
                      id="providers"
                      multiple
                      value={selectedProviders}
                      onChange={handleProviderSelection}
                      label="API Providers"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      error={!!errors.providers}
                    >
                      {configuredProviders.map((provider) => (
                        <MenuItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error={!!errors.providers}>
                      {errors.providers || 'Select providers to compare'}
                    </FormHelperText>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="metric-type-label">Metric Type</InputLabel>
                    <Select
                      labelId="metric-type-label"
                      id="metric-type"
                      value={metricType}
                      label="Metric Type"
                      onChange={handleMetricTypeChange}
                    >
                      <MenuItem value="cost">Cost</MenuItem>
                      <MenuItem value="usage">Usage</MenuItem>
                      <MenuItem value="quota">Quota</MenuItem>
                    </Select>
                    <FormHelperText>
                      Select the metric to compare
                    </FormHelperText>
                  </FormControl>
                </>
              )}

              {widgetType === 'trend' && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="provider-label">API Provider</InputLabel>
                  <Select
                    labelId="provider-label"
                    id="provider"
                    value={providerId}
                    onChange={handleProviderChange}
                    label="API Provider"
                    error={!!errors.providerId}
                  >
                    {configuredProviders.map((provider) => (
                      <MenuItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error={!!errors.providerId}>
                    {errors.providerId || 'Select a provider for trend analysis'}
                  </FormHelperText>
                </FormControl>
              )}

              {widgetType === 'custom' && (
                <>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="custom-metric-type-label">Metric Type</InputLabel>
                    <Select
                      labelId="custom-metric-type-label"
                      id="custom-metric-type"
                      value={customMetricType}
                      label="Metric Type"
                      onChange={handleCustomMetricTypeChange}
                    >
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="value">Value</MenuItem>
                      <MenuItem value="ratio">Ratio</MenuItem>
                      <MenuItem value="distribution">Distribution</MenuItem>
                    </Select>
                    <FormHelperText>
                      Select the type of custom metric
                    </FormHelperText>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Metric Label"
                    value={metricLabel}
                    onChange={(e) => setMetricLabel(e.target.value)}
                    error={!!errors.metricLabel}
                    helperText={errors.metricLabel || 'Enter a label for the metric'}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Metric Unit (optional)"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    helperText="Enter a unit for the metric (e.g., $, %, etc.)"
                    sx={{ mb: 3 }}
                  />
                </>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: '1px dashed rgba(255, 255, 255, 0.2)', borderRadius: 1, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Widget Preview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 50px)' }}>
                  {widgetType === 'comparison' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {title || 'API Provider Comparison'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 300, mx: 'auto', mt: 2 }}>
                        {selectedProviders.length > 0 ? (
                          selectedProviders.map((provider, index) => (
                            <Box key={provider} sx={{ textAlign: 'center' }}>
                              <Typography variant="body2">{provider}</Typography>
                              <Typography variant="h6">${(10 * (index + 1)).toFixed(2)}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Select providers to see preview
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  {widgetType === 'trend' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {title || 'Usage Trends'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {providerId ? `Showing trends for ${providerId}` : 'Select a provider to see preview'}
                      </Typography>
                      <Box sx={{ mt: 2, width: '100%', height: 100, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }} />
                    </Box>
                  )}

                  {widgetType === 'custom' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {title || 'Custom Metric'}
                      </Typography>
                      {customMetricType === 'percentage' && (
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: '50%',
                              border: '8px solid rgba(255, 255, 255, 0.1)',
                              position: 'relative',
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="h4">75%</Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      {customMetricType === 'value' && (
                        <Box>
                          <Typography variant="h3">{metricUnit}1,234</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metricLabel || 'Enter a label'}
                          </Typography>
                        </Box>
                      )}
                      {customMetricType === 'ratio' && (
                        <Box>
                          <Typography variant="h5">750 / 1,000</Typography>
                          <Box sx={{ width: '80%', height: 10, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 5, mx: 'auto', mt: 2, position: 'relative' }}>
                            <Box sx={{ width: '75%', height: '100%', bgcolor: 'primary.main', borderRadius: 5 }} />
                          </Box>
                        </Box>
                      )}
                      {customMetricType === 'distribution' && (
                        <Box sx={{ width: '100%', height: 100, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }} />
                      )}
                    </Box>
                  )}

                  {widgetType === 'alert' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {title || 'Alerts & Notifications'}
                      </Typography>
                      <Box sx={{ mt: 2, width: '100%', p: 1, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, textAlign: 'left' }}>
                        <Typography variant="body2">API rate limit exceeded</Typography>
                        <Typography variant="caption" color="text.secondary">OpenAI • 5m ago</Typography>
                      </Box>
                      <Box sx={{ mt: 1, width: '100%', p: 1, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, textAlign: 'left' }}>
                        <Typography variant="body2">Cost threshold exceeded</Typography>
                        <Typography variant="caption" color="text.secondary">Claude • 1h ago</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddWidget} variant="contained">Add Widget</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdvancedWidgetDialog;
