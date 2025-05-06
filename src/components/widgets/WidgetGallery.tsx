import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Edit as EditIcon,
  Delete as DeleteIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Settings as SettingsIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useDashboardWidgets } from '../../contexts/DashboardWidgetContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GlassMorphismWidget from './GlassMorphismWidget';

interface WidgetPreviewProps {
  type: string;
  providerId: string;
  size: 'small' | 'medium' | 'large';
  onAdd: () => void;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ type, providerId, size, onAdd }) => {
  const { providers } = useApiProviders();
  const provider = providers.find(p => p.id === providerId) || providers[0];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: provider.color || 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
              {provider.name.charAt(0)}
            </Typography>
          </Box>
          <Typography variant="h6">{provider.name}</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {type.charAt(0).toUpperCase() + type.slice(1)} Widget
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: 1,
            height: size === 'small' ? 80 : size === 'medium' ? 120 : 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {type === 'cost' && (
            <>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                $0.00
              </Typography>
              <Typography variant="body2" color="success.main">
                ↓ $0.00 (0%)
              </Typography>
            </>
          )}

          {type === 'usage' && (
            <>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                0
              </Typography>
              <Typography variant="body2">Requests Today</Typography>
            </>
          )}

          {type === 'quota' && (
            <>
              <Box
                sx={{
                  width: '100%',
                  height: 10,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 5,
                  mb: 1,
                }}
              >
                <Box
                  sx={{ width: '30%', height: '100%', bgcolor: 'primary.main', borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2">30% of quota used</Typography>
            </>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={onAdd} fullWidth>
          Add Widget
        </Button>
      </CardActions>
    </Card>
  );
};

const WidgetGallery: React.FC = () => {
  const { widgets, addWidget, removeWidget, toggleWidgetVisibility } = useDashboardWidgets();
  const { providers } = useApiProviders();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedType, setSelectedType] = useState('cost');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Handle opening the dialog
  const handleOpenDialog = (type: string) => {
    setSelectedType(type);
    setSelectedProvider(providers[0]?.id || '');
    setOpenDialog(true);
  };

  // Handle adding a widget
  const handleAddWidget = () => {
    if (selectedProvider) {
      addWidget({
        providerId: selectedProvider,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: selectedType as any,
        size: selectedSize,
        position: { x: Math.random() * 500, y: Math.random() * 300 },
        isVisible: true,
      });
      setOpenDialog(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Widget Gallery
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('cost')}
        >
          Add New Widget
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose from a variety of widgets to monitor your API usage and costs. Add multiple widgets
        to your dashboard or as floating widgets.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <WidgetPreview
            type="cost"
            providerId={providers[0]?.id || 'openai'}
            size="medium"
            onAdd={() => handleOpenDialog('cost')}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WidgetPreview
            type="usage"
            providerId={providers[1]?.id || 'google'}
            size="medium"
            onAdd={() => handleOpenDialog('usage')}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WidgetPreview
            type="quota"
            providerId={providers[2]?.id || 'claude'}
            size="medium"
            onAdd={() => handleOpenDialog('quota')}
          />
        </Grid>
      </Grid>

      {widgets.length > 0 && (
        <>
          <Box
            sx={{
              mt: 6,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Your Widgets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {widgets.length} widget{widgets.length !== 1 ? 's' : ''} added
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {widgets.map(widget => {
              const provider = providers.find(p => p.id === widget.providerId) || providers[0];

              return (
                <Grid size={{ xs: 12, md: 4 }} key={widget.id}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: 'rgba(30, 30, 30, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: provider?.color || 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: 'white', fontWeight: 'bold' }}
                          >
                            {provider?.name.charAt(0) || '?'}
                          </Typography>
                        </Box>
                        <Typography variant="h6">{provider?.name || 'Unknown'}</Typography>
                      </Box>

                      <Box>
                        <Tooltip title={widget.isVisible ? 'Hide Widget' : 'Show Widget'}>
                          <IconButton
                            size="small"
                            onClick={() => toggleWidgetVisibility(widget.id)}
                            sx={{ mr: 1 }}
                          >
                            {widget.isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Remove Widget">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeWidget(widget.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Type: {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {widget.size.charAt(0).toUpperCase() + widget.size.slice(1)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => toggleWidgetVisibility(widget.id)}
                      >
                        {widget.isVisible ? 'Hide' : 'Show'} Widget
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Add Widget Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          Add New Widget
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="widget-type-label">Widget Type</InputLabel>
            <Select
              labelId="widget-type-label"
              value={selectedType}
              label="Widget Type"
              onChange={e => setSelectedType(e.target.value)}
            >
              <MenuItem value="cost">Cost</MenuItem>
              <MenuItem value="usage">Usage</MenuItem>
              <MenuItem value="quota">Quota</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="provider-label">API Provider</InputLabel>
            <Select
              labelId="provider-label"
              value={selectedProvider}
              label="API Provider"
              onChange={e => setSelectedProvider(e.target.value)}
            >
              {providers.map(provider => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="size-label">Widget Size</InputLabel>
            <Select
              labelId="size-label"
              value={selectedSize}
              label="Widget Size"
              onChange={e => setSelectedSize(e.target.value as 'small' | 'medium' | 'large')}
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel control={<Switch defaultChecked />} label="Show as floating widget" />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddWidget} disabled={!selectedProvider}>
            Add Widget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WidgetGallery;
