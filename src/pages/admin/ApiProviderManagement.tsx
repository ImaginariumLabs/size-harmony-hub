import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/MockAuthContext';

// Mock data for demonstration
const mockProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI API for GPT models',
    baseUrl: 'https://api.openai.com/v1',
    authType: 'bearer',
    status: 'active',
    createdAt: '2025-01-01 10:00:00',
    lastUpdated: '2025-05-10 14:23:45',
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic Claude API',
    baseUrl: 'https://api.anthropic.com/v1',
    authType: 'key',
    status: 'active',
    createdAt: '2025-01-15 11:30:00',
    lastUpdated: '2025-05-09 09:15:30',
  },
  {
    id: 'google',
    name: 'Google Gemini',
    description: 'Google Gemini API',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    authType: 'key',
    status: 'active',
    createdAt: '2025-02-01 14:20:00',
    lastUpdated: '2025-05-10 11:45:22',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub API for repository integration',
    baseUrl: 'https://api.github.com',
    authType: 'bearer',
    status: 'inactive',
    createdAt: '2025-02-10 09:45:00',
    lastUpdated: '2025-04-15 16:30:45',
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Amazon Web Services API',
    baseUrl: 'https://api.aws.amazon.com',
    authType: 'key',
    status: 'active',
    createdAt: '2025-02-15 10:15:00',
    lastUpdated: '2025-05-08 13:20:10',
  },
];

interface Provider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  authType: string;
  status: string;
  createdAt: string;
  lastUpdated: string;
}

interface ProviderFormData {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  authType: string;
  status: string;
}

const ApiProviderManagement: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState<ProviderFormData>({
    id: '',
    name: '',
    description: '',
    baseUrl: '',
    authType: 'bearer',
    status: 'active',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const [advancedMode, setAdvancedMode] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch data from the server
    // For now, we're using mock data
    setProviders(mockProviders);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProviders(mockProviders);
      setLoading(false);
    }, 1000);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      id: '',
      name: '',
      description: '',
      baseUrl: '',
      authType: 'bearer',
      status: 'active',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (provider: Provider) => {
    setDialogMode('edit');
    setSelectedProvider(provider);
    setFormData({
      id: provider.id,
      name: provider.name,
      description: provider.description,
      baseUrl: provider.baseUrl,
      authType: provider.authType,
      status: provider.status,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProvider(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = event.target.name as keyof ProviderFormData;
    const value = event.target.value as string;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = () => {
    // In a real implementation, this would send data to the server
    if (dialogMode === 'add') {
      // Add new provider
      const newProvider: Provider = {
        ...formData,
        createdAt: new Date().toLocaleString(),
        lastUpdated: new Date().toLocaleString(),
      };
      setProviders((prev) => [...prev, newProvider]);
      setSnackbar({
        open: true,
        message: 'Provider added successfully',
        severity: 'success',
      });
    } else {
      // Edit existing provider
      if (selectedProvider) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === selectedProvider.id
              ? {
                  ...p,
                  name: formData.name,
                  description: formData.description,
                  baseUrl: formData.baseUrl,
                  authType: formData.authType,
                  status: formData.status,
                  lastUpdated: new Date().toLocaleString(),
                }
              : p
          )
        );
        setSnackbar({
          open: true,
          message: 'Provider updated successfully',
          severity: 'success',
        });
      }
    }
    handleCloseDialog();
  };

  const handleOpenDeleteDialog = (provider: Provider) => {
    setProviderToDelete(provider);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProviderToDelete(null);
  };

  const handleDeleteProvider = () => {
    if (providerToDelete) {
      setProviders((prev) => prev.filter((p) => p.id !== providerToDelete.id));
      setSnackbar({
        open: true,
        message: 'Provider deleted successfully',
        severity: 'success',
      });
    }
    handleCloseDeleteDialog();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'deprecated':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon fontSize="small" />;
      case 'inactive':
        return <CancelIcon fontSize="small" />;
      case 'deprecated':
        return <BlockIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          API Provider Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search providers..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ width: 250 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add Provider
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Base URL</TableCell>
                <TableCell>Auth Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProviders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((provider) => (
                <TableRow key={provider.id} hover>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.description}</TableCell>
                  <TableCell>{provider.baseUrl}</TableCell>
                  <TableCell>
                    <Chip
                      label={provider.authType.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor:
                          provider.authType === 'bearer'
                            ? theme.palette.primary.main
                            : provider.authType === 'key'
                            ? theme.palette.secondary.main
                            : theme.palette.grey[500],
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(provider.status)}
                      label={provider.status.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(provider.status),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatTimestamp(provider.lastUpdated)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenEditDialog(provider)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(provider)}
                        disabled={['openai', 'claude', 'google'].includes(provider.id)} // Prevent deleting core providers
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProviders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No providers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProviders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Provider Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Provider' : 'Edit Provider'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={advancedMode}
                  onChange={(e) => setAdvancedMode(e.target.checked)}
                  color="primary"
                />
              }
              label="Advanced Mode"
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Provider ID"
              name="id"
              value={formData.id}
              onChange={handleFormChange}
              fullWidth
              required
              disabled={dialogMode === 'edit'} // Can't change ID when editing
            />
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Base URL"
              name="baseUrl"
              value={formData.baseUrl}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Authentication Type</InputLabel>
              <Select
                name="authType"
                value={formData.authType}
                onChange={handleFormChange}
                label="Authentication Type"
              >
                <MenuItem value="bearer">Bearer Token</MenuItem>
                <MenuItem value="key">API Key</MenuItem>
                <MenuItem value="basic">Basic Auth</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="deprecated">Deprecated</MenuItem>
              </Select>
            </FormControl>

            {advancedMode && (
              <>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Advanced settings are available for configuring endpoints, response mapping, and rate limits.
                  These settings should be configured carefully.
                </Alert>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Endpoint Configuration
                </Typography>
                <TextField
                  label="Usage Endpoint"
                  name="usageEndpoint"
                  placeholder="/usage"
                  fullWidth
                />
                <TextField
                  label="Cost Endpoint"
                  name="costEndpoint"
                  placeholder="/cost"
                  fullWidth
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Response Mapping
                </Typography>
                <TextField
                  label="Usage Path"
                  name="usagePath"
                  placeholder="data.usage"
                  fullWidth
                />
                <TextField
                  label="Cost Path"
                  name="costPath"
                  placeholder="data.cost"
                  fullWidth
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitForm}
            variant="contained"
            color="primary"
            disabled={!formData.id || !formData.name || !formData.baseUrl}
          >
            {dialogMode === 'add' ? 'Add Provider' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the provider <strong>{providerToDelete?.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteProvider} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiProviderManagement;
