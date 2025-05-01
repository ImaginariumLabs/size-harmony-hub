import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Alert as MuiAlert, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Tabs, Tab, useTheme, SelectChangeEvent,  } from '@mui/material';
import {
  Refresh as RefreshIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  FilterList as FilterIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import {
  Alert,
  AlertType,
  AlertSeverity,
  getAllAlerts,
  markAlertAsRead,
  dismissAlert,
  markAllAlertsAsRead,
  dismissAllAlerts,
} from '../../services/alertService';
import AlertSettings from '../../components/settings/AlertSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`alerts-tabpanel-${index}`}
      aria-labelledby={`alerts-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `alerts-tab-${index}`,
    'aria-controls': `alerts-tabpanel-${index}`,
  };
};

const AdminAlerts: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { providers } = useApiProviders();
  const [tabValue, setTabValue] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadAlerts = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const allAlerts = await getAllAlerts();
      setAlerts(allAlerts);
    } catch (err) {
      console.error('Error loading alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...alerts];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(query) ||
        alert.message.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    // Apply severity filter
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }

    // Apply provider filter
    if (filterProvider !== 'all') {
      filtered = filtered.filter(alert => alert.providerId === filterProvider);
    }

    // Apply status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter(alert => !alert.read);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(alert => alert.read);
    } else if (filterStatus === 'dismissed') {
      filtered = filtered.filter(alert => alert.dismissed);
    } else if (filterStatus === 'active') {
      filtered = filtered.filter(alert => !alert.dismissed);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchQuery, filterType, filterSeverity, filterProvider, filterStatus]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const handleFilterTypeChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const handleFilterSeverityChange = (event: SelectChangeEvent) => {
    setFilterSeverity(event.target.value);
    setPage(0);
  };

  const handleFilterProviderChange = (event: SelectChangeEvent) => {
    setFilterProvider(event.target.value);
    setPage(0);
  };

  const handleFilterStatusChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    loadAlerts();
  };

  const handleMarkAsRead = async (alertId: string) => {
    setLoading(true);

    try {
      await markAlertAsRead(alertId);

      // Update local state
      setAlerts(prev => prev.map(a =>
        a.id === alertId ? { ...a, read: true } : a
      ));

      setSuccess('Alert marked as read');
    } catch (err) {
      console.error('Error marking alert as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark alert as read');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (alertId: string) => {
    setLoading(true);

    try {
      await dismissAlert(alertId);

      // Update local state
      setAlerts(prev => prev.map(a =>
        a.id === alertId ? { ...a, dismissed: true } : a
      ));

      setSuccess('Alert dismissed');
    } catch (err) {
      console.error('Error dismissing alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to dismiss alert');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);

    try {
      await markAllAlertsAsRead();

      // Update local state
      setAlerts(prev => prev.map(a => ({ ...a, read: true })));

      setSuccess('All alerts marked as read');
    } catch (err) {
      console.error('Error marking all alerts as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all alerts as read');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAll = async () => {
    setLoading(true);

    try {
      await dismissAllAlerts();

      // Update local state
      setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));

      setSuccess('All alerts dismissed');
    } catch (err) {
      console.error('Error dismissing all alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to dismiss all alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedAlert(null);
  };

  const getAlertTypeLabel = (type: string): string => {
    switch (type) {
      case AlertType.USAGE_THRESHOLD:
        return 'Usage';
      case AlertType.COST_THRESHOLD:
        return 'Cost';
      case AlertType.RATE_LIMIT:
        return 'Rate Limit';
      case AlertType.PROVIDER_HEALTH:
        return 'Health';
      case AlertType.SYSTEM:
        return 'System';
      default:
        return type;
    }
  };

  const getAlertIcon = (alert: Alert) => {
    switch (alert.severity) {
      case AlertSeverity.ERROR:
        return <ErrorIcon color="error" />;
      case AlertSeverity.WARNING:
        return <WarningIcon color="warning" />;
      case AlertSeverity.INFO:
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case AlertSeverity.ERROR:
        return theme.palette.error.main;
      case AlertSeverity.WARNING:
        return theme.palette.warning.main;
      case AlertSeverity.INFO:
        return theme.palette.info.main;
      default:
        return theme.palette.info.main;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getProviderName = (providerId?: string): string => {
    if (!providerId) return 'System';
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : providerId;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h2">
            Alert Management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<MarkReadIcon />}
            onClick={handleMarkAllAsRead}
            disabled={loading || filteredAlerts.filter(a => !a.read).length === 0}
          >
            Mark All as Read
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDismissAll}
            disabled={loading || filteredAlerts.filter(a => !a.dismissed).length === 0}
            color="error"
          >
            Dismiss All
          </Button>
        </Box>
      </Box>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </MuiAlert>
      )}

      {success && (
        <MuiAlert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </MuiAlert>
      )}

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="alert management tabs">
            <Tab label="Alerts" {...a11yProps(0)} />
            <Tab label="Alert Settings" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  label="Search Alerts"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={handleFilterTypeChange}
                    label="Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value={AlertType.USAGE_THRESHOLD}>Usage</MenuItem>
                    <MenuItem value={AlertType.COST_THRESHOLD}>Cost</MenuItem>
                    <MenuItem value={AlertType.RATE_LIMIT}>Rate Limit</MenuItem>
                    <MenuItem value={AlertType.PROVIDER_HEALTH}>Health</MenuItem>
                    <MenuItem value={AlertType.SYSTEM}>System</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={filterSeverity}
                    onChange={handleFilterSeverityChange}
                    label="Severity"
                  >
                    <MenuItem value="all">All Severities</MenuItem>
                    <MenuItem value={AlertSeverity.INFO}>Info</MenuItem>
                    <MenuItem value={AlertSeverity.WARNING}>Warning</MenuItem>
                    <MenuItem value={AlertSeverity.ERROR}>Error</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Provider</InputLabel>
                  <Select
                    value={filterProvider}
                    onChange={handleFilterProviderChange}
                    label="Provider"
                  >
                    <MenuItem value="all">All Providers</MenuItem>
                    <MenuItem value="">System</MenuItem>
                    {providers.map(provider => (
                      <MenuItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={handleFilterStatusChange}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="unread">Unread</MenuItem>
                    <MenuItem value="read">Read</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="dismissed">Dismissed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {loading && filteredAlerts.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {filteredAlerts.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No alerts found matching your filters
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Severity</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Provider</TableCell>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAlerts
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((alert) => (
                            <TableRow
                              key={alert.id}
                              hover
                              onClick={() => handleViewDetails(alert)}
                              sx={{
                                cursor: 'pointer',
                                backgroundColor: alert.read ? 'transparent' : theme.palette.action.hover,
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {getAlertIcon(alert)}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  fontWeight={alert.read ? 'normal' : 'bold'}
                                >
                                  {alert.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getAlertTypeLabel(alert.type)}
                                  size="small"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              </TableCell>
                              <TableCell>{getProviderName(alert.providerId)}</TableCell>
                              <TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
                              <TableCell>
                                {alert.dismissed ? (
                                  <Chip
                                    label="Dismissed"
                                    size="small"
                                    color="default"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                ) : alert.read ? (
                                  <Chip
                                    label="Read"
                                    size="small"
                                    color="primary"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                ) : (
                                  <Chip
                                    label="Unread"
                                    size="small"
                                    color="warning"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {!alert.read && (
                                    <Tooltip title="Mark as read">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(alert.id!);
                                        }}
                                      >
                                        <MarkReadIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  {!alert.dismissed && (
                                    <Tooltip title="Dismiss">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDismiss(alert.id!);
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredAlerts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AlertSettings />
        </TabPanel>
      </Paper>

      {/* Alert Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedAlert && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getAlertIcon(selectedAlert)}
                <Typography variant="h6">{selectedAlert.title}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedAlert.message}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body2">
                      {getAlertTypeLabel(selectedAlert.type)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Severity
                    </Typography>
                    <Typography variant="body2">
                      {selectedAlert.severity.charAt(0).toUpperCase() + selectedAlert.severity.slice(1)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Provider
                    </Typography>
                    <Typography variant="body2">
                      {getProviderName(selectedAlert.providerId)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Timestamp
                    </Typography>
                    <Typography variant="body2">
                      {formatTimestamp(selectedAlert.timestamp)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body2">
                      {selectedAlert.dismissed
                        ? 'Dismissed'
                        : selectedAlert.read
                        ? 'Read'
                        : 'Unread'}
                    </Typography>
                  </Grid>
                  {selectedAlert.actionUrl && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Action URL
                      </Typography>
                      <Typography variant="body2">
                        {selectedAlert.actionUrl}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                {selectedAlert.metadata && Object.keys(selectedAlert.metadata).length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Additional Information
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <pre style={{ margin: 0, overflow: 'auto' }}>
                        {JSON.stringify(selectedAlert.metadata, null, 2)}
                      </pre>
                    </Paper>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailDialog}>Close</Button>
              {!selectedAlert.read && (
                <Button
                  onClick={() => {
                    handleMarkAsRead(selectedAlert.id!);
                    handleCloseDetailDialog();
                  }}
                  color="primary"
                >
                  Mark as Read
                </Button>
              )}
              {!selectedAlert.dismissed && (
                <Button
                  onClick={() => {
                    handleDismiss(selectedAlert.id!);
                    handleCloseDetailDialog();
                  }}
                  color="error"
                >
                  Dismiss
                </Button>
              )}
              {selectedAlert.actionUrl && (
                <Button
                  onClick={() => {
                    navigate(selectedAlert.actionUrl!);
                    handleCloseDetailDialog();
                  }}
                  variant="contained"
                  color="primary"
                >
                  Go to Action
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminAlerts;
