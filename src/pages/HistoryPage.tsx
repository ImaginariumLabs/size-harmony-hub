import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  SelectChangeEvent,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FilterList as FilterListIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Info as InfoIcon,
  Download as DownloadIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useApiProviders } from '../contexts/ApiProviderContext';
import VirtualizedTable from '../components/tables/VirtualizedTable';

interface ApiRequest {
  id: string;
  timestamp: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  status: 'success' | 'error' | 'timeout';
  duration: number;
}

const HistoryPage: React.FC = () => {
  const { providers } = useApiProviders();
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [apiRequests, setApiRequests] = useState<ApiRequest[]>([]);

  const configuredProviders = providers.filter(provider => provider.isConfigured);

  // Generate sample data
  const generateSampleData = () => {
    const models = {
      openai: ['gpt-4', 'gpt-3.5-turbo'],
      claude: ['claude-opus', 'claude-sonnet'],
      google: ['gemini-pro', 'gemini-flash'],
    };

    const statuses: ('success' | 'error' | 'timeout')[] = ['success', 'error', 'timeout'];
    const data: ApiRequest[] = [];

    for (let i = 0; i < 100; i++) {
      const provider = configuredProviders[Math.floor(Math.random() * configuredProviders.length)];
      const providerModels = models[provider.id as keyof typeof models] || ['default-model'];
      const model = providerModels[Math.floor(Math.random() * providerModels.length)];
      const status = statuses[Math.floor(Math.random() * (i > 90 ? 3 : i > 80 ? 2 : 1))]; // More errors in later entries

      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Random time in the last 72 hours

      const promptTokens = Math.floor(Math.random() * 500) + 100;
      const completionTokens = Math.floor(Math.random() * 1000) + 200;

      // Calculate cost based on model and tokens
      let costPerPromptToken = 0.0001;
      let costPerCompletionToken = 0.0002;

      if (model.includes('gpt-4')) {
        costPerPromptToken = 0.00003;
        costPerCompletionToken = 0.00006;
      } else if (model.includes('claude-opus')) {
        costPerPromptToken = 0.000015;
        costPerCompletionToken = 0.000045;
      }

      const cost = promptTokens * costPerPromptToken + completionTokens * costPerCompletionToken;

      data.push({
        id: `req-${i}-${Date.now()}`,
        timestamp: date.toISOString(),
        provider: provider.id,
        model,
        promptTokens,
        completionTokens,
        cost,
        status,
        duration: Math.floor(Math.random() * 2000) + 200, // 200-2200ms
      });
    }

    // Sort by timestamp, newest first
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Fetch history data
  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch data from the API
      // For now, we'll just simulate a delay and generate sample data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiRequests(generateSampleData());
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching history data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount

  useEffect(() => {
    fetchHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle provider filter change
  const handleProviderFilterChange = (event: SelectChangeEvent) => {
    setProviderFilter(event.target.value);
    setPage(0);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Handle date range filter change
  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
    setPage(0);
  };

  // Format the last refreshed time
  const formatLastRefreshed = () => {
    // Current date for comparison
    const now = new Date();
    const diff = now.getTime() - lastRefreshed.getTime();

    if (diff < 60000) {
      return 'just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else {
      return `${Math.floor(diff / 3600000)}h ago`;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format cost
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  // Filter data based on search query and filters
  const filteredData = apiRequests.filter(request => {
    // Search query filter
    if (searchQuery && !request.model.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Provider filter
    if (providerFilter !== 'all' && request.provider !== providerFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && request.status !== statusFilter) {
      return false;
    }

    // Date range filter
    if (dateRange !== 'all') {
      const requestDate = new Date(request.timestamp);
      // Current date will be used in future implementations

      if (dateRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (requestDate < today) {
          return false;
        }
      } else if (dateRange === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestDate < yesterday || requestDate >= today) {
          return false;
        }
      } else if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (requestDate < weekAgo) {
          return false;
        }
      }
    }

    return true;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'timeout':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get provider name
  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : providerId;
  };

  // Export history data
  const exportHistoryData = () => {
    const csvContent = [
      [
        'Timestamp',
        'Provider',
        'Model',
        'Prompt Tokens',
        'Completion Tokens',
        'Cost',
        'Status',
        'Duration (ms)',
      ].join(','),
      ...filteredData.map(request =>
        [
          request.timestamp,
          getProviderName(request.provider),
          request.model,
          request.promptTokens,
          request.completionTokens,
          request.cost,
          request.status,
          request.duration,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `api-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          API Request History
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatLastRefreshed()}
          </Typography>
          {isLoading ? (
            <IconButton size="small" disabled>
              <CircularProgress size={20} />
            </IconButton>
          ) : (
            <Tooltip title="Refresh data">
              <IconButton onClick={fetchHistoryData} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {configuredProviders.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No API providers configured. Add your first API key in settings to start tracking API
          requests.
        </Alert>
      ) : (
        <>
          {/* Filters */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Search by model"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  sx={{ flexGrow: 1, minWidth: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="provider-filter-label">Provider</InputLabel>
                  <Select
                    labelId="provider-filter-label"
                    value={providerFilter}
                    label="Provider"
                    onChange={handleProviderFilterChange}
                  >
                    <MenuItem value="all">All Providers</MenuItem>
                    {configuredProviders.map(provider => (
                      <MenuItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="timeout">Timeout</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="date-range-filter-label">Date Range</InputLabel>
                  <Select
                    labelId="date-range-filter-label"
                    value={dateRange}
                    label="Date Range"
                    onChange={handleDateRangeChange}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="yesterday">Yesterday</MenuItem>
                    <MenuItem value="week">Last 7 Days</MenuItem>
                  </Select>
                </FormControl>

                <Tooltip title="Export filtered data as CSV">
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportHistoryData}
                    size="small"
                  >
                    Export
                  </Button>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card>
            <Box sx={{ p: 0 }}>
              <VirtualizedTable
                columns={[
                  {
                    id: 'timestamp',
                    label: 'Timestamp',
                    minWidth: 180,
                    accessor: row => formatTimestamp(row.timestamp),
                  },
                  {
                    id: 'provider',
                    label: 'Provider',
                    minWidth: 120,
                    accessor: row => getProviderName(row.provider),
                  },
                  {
                    id: 'model',
                    label: 'Model',
                    minWidth: 150,
                    accessor: row => row.model,
                  },
                  {
                    id: 'tokens',
                    label: 'Tokens',
                    minWidth: 120,
                    align: 'right',
                    accessor: row => row.promptTokens + row.completionTokens,
                    format: (value, row) => (
                      <>
                        {value}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {row.promptTokens} in / {row.completionTokens} out
                        </Typography>
                      </>
                    ),
                  },
                  {
                    id: 'cost',
                    label: 'Cost',
                    minWidth: 100,
                    align: 'right',
                    accessor: row => row.cost,
                    format: value => formatCost(value),
                  },
                  {
                    id: 'status',
                    label: 'Status',
                    minWidth: 100,
                    align: 'center',
                    accessor: row => row.status,
                    format: value => (
                      <Chip
                        label={value}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        color={getStatusColor(value) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    ),
                  },
                  {
                    id: 'duration',
                    label: 'Duration',
                    minWidth: 100,
                    align: 'right',
                    accessor: row => row.duration,
                    format: value => `${value}ms`,
                  },
                ]}
                data={filteredData}
                getRowId={row => row.id}
                maxHeight={600}
                emptyMessage="No requests found matching the current filters."
              />
            </Box>

            {/* Keep pagination for now to maintain UX consistency */}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>

          {/* Summary */}
          <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Total Requests
                </Typography>
                <Typography variant="h4" component="div">
                  {filteredData.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {filteredData.filter(r => r.status === 'success').length} successful (
                  {(
                    (filteredData.filter(r => r.status === 'success').length /
                      filteredData.length) *
                    100
                  ).toFixed(1)}
                  %)
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Total Cost
                </Typography>
                <Typography variant="h4" component="div">
                  ${filteredData.reduce((sum, request) => sum + request.cost, 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Avg. $
                  {(
                    filteredData.reduce((sum, request) => sum + request.cost, 0) /
                    (filteredData.length || 1)
                  ).toFixed(4)}{' '}
                  per request
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Total Tokens
                </Typography>
                <Typography variant="h4" component="div">
                  {filteredData
                    .reduce(
                      (sum, request) => sum + request.promptTokens + request.completionTokens,
                      0
                    )
                    .toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {filteredData
                    .reduce((sum, request) => sum + request.promptTokens, 0)
                    .toLocaleString()}{' '}
                  prompt /{' '}
                  {filteredData
                    .reduce((sum, request) => sum + request.completionTokens, 0)
                    .toLocaleString()}{' '}
                  completion
                </Typography>
              </Paper>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default HistoryPage;
