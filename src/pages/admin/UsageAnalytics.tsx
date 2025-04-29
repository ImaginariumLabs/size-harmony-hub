import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

// Mock data for demonstration
const mockUsageData = {
  totalCost: 1245.67,
  totalCalls: 3456789,
  totalTokens: 98765432,
  costByProvider: [
    { name: 'OpenAI', value: 745.32 },
    { name: 'Claude', value: 320.15 },
    { name: 'Gemini', value: 180.20 },
  ],
  callsByProvider: [
    { name: 'OpenAI', value: 2345678 },
    { name: 'Claude', value: 765432 },
    { name: 'Gemini', value: 345679 },
  ],
  tokensByProvider: [
    { name: 'OpenAI', value: 65432198 },
    { name: 'Claude', value: 23456789 },
    { name: 'Gemini', value: 9876545 },
  ],
  dailyUsage: [
    { date: '2025-05-01', cost: 35.67, calls: 98765, tokens: 3456789 },
    { date: '2025-05-02', cost: 42.89, calls: 102345, tokens: 3678901 },
    { date: '2025-05-03', cost: 38.45, calls: 95678, tokens: 3234567 },
    { date: '2025-05-04', cost: 41.23, calls: 99876, tokens: 3567890 },
    { date: '2025-05-05', cost: 45.67, calls: 105432, tokens: 3789012 },
    { date: '2025-05-06', cost: 52.34, calls: 112345, tokens: 4123456 },
    { date: '2025-05-07', cost: 48.90, calls: 108765, tokens: 3987654 },
    { date: '2025-05-08', cost: 51.23, calls: 110987, tokens: 4056789 },
    { date: '2025-05-09', cost: 55.67, calls: 115432, tokens: 4234567 },
    { date: '2025-05-10', cost: 58.90, calls: 118765, tokens: 4345678 },
  ],
  topUsers: [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', cost: 245.67, calls: 678901, tokens: 23456789 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', cost: 198.45, calls: 567890, tokens: 19876543 },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', cost: 156.78, calls: 456789, tokens: 15678901 },
    { id: 4, name: 'Alice Williams', email: 'alice.williams@example.com', cost: 134.56, calls: 345678, tokens: 12345678 },
    { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', cost: 123.45, calls: 234567, tokens: 9876543 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const UsageAnalytics: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState(mockUsageData);
  const [timeRange, setTimeRange] = useState('7d');
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [provider, setProvider] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // In a real implementation, this would fetch data from the server
    // For now, we're using mock data
  }, [timeRange, startDate, endDate, provider]);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setTimeRange(value);
    
    const now = new Date();
    let start = new Date();
    
    switch (value) {
      case '24h':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        // Keep current custom dates
        break;
    }
    
    if (value !== 'custom') {
      setStartDate(start);
      setEndDate(now);
    }
  };

  const handleProviderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProvider(event.target.value as string);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportData = () => {
    // In a real implementation, this would export data to CSV or Excel
    alert('Data export functionality would be implemented here');
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Usage Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Export data">
            <IconButton onClick={handleExportData} disabled={loading}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                label="Time Range"
              >
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {timeRange === 'custom' && (
            <>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}
          <Grid item xs={12} md={timeRange === 'custom' ? 3 : 6}>
            <FormControl fullWidth size="small">
              <InputLabel>Provider</InputLabel>
              <Select
                value={provider}
                onChange={handleProviderChange}
                label="Provider"
              >
                <MenuItem value="all">All Providers</MenuItem>
                <MenuItem value="openai">OpenAI</MenuItem>
                <MenuItem value="claude">Claude</MenuItem>
                <MenuItem value="gemini">Gemini</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
              fullWidth
              onClick={handleRefresh}
              disabled={loading}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Total Cost" />
            <Divider />
            <CardContent>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                {formatCurrency(usageData.totalCost)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all providers and users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Total API Calls" />
            <Divider />
            <CardContent>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                {formatNumber(usageData.totalCalls)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all providers and users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Total Tokens" />
            <Divider />
            <CardContent>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                {formatNumber(usageData.totalTokens)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all providers and users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader title="Daily Usage" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={usageData.dailyUsage}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="cost"
                      name="Cost ($)"
                      stroke={theme.palette.primary.main}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="calls"
                      name="API Calls"
                      stroke={theme.palette.secondary.main}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="Cost by Provider" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageData.costByProvider}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {usageData.costByProvider.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="API Calls by Provider" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageData.callsByProvider}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => formatNumber(value as number)} />
                    <Legend />
                    <Bar dataKey="value" name="API Calls" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Users Table */}
      <Card>
        <CardHeader title="Top Users by Cost" />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">API Calls</TableCell>
                <TableCell align="right">Tokens</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usageData.topUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">{formatCurrency(user.cost)}</TableCell>
                    <TableCell align="right">{formatNumber(user.calls)}</TableCell>
                    <TableCell align="right">{formatNumber(user.tokens)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={usageData.topUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
};

export default UsageAnalytics;
