import React, { useState, useEffect } from 'react';
import { Box, Grid, Tabs, Tab, useTheme, SelectChangeEvent,  } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Download as DownloadIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import UsageOverviewChart from '../../components/analytics/UsageOverviewChart';
import UsageByProviderChart from '../../components/analytics/UsageByProviderChart';
import UsageByUserChart from '../../components/analytics/UsageByUserChart';
import UsageByEndpointChart from '../../components/analytics/UsageByEndpointChart';
import UsageDetailsTable from '../../components/analytics/UsageDetailsTable';
import { getUsageData, UsageData, UsageFilter } from '../../services/analyticsService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`usage-analytics-tabpanel-${index}`}
      aria-labelledby={`usage-analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `usage-analytics-tab-${index}`,
    'aria-controls': `usage-analytics-tabpanel-${index}`,
  };
}

const UsageAnalytics: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { providers } = useApiProviders();
  const [tabValue, setTabValue] = useState(0);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<UsageFilter>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    providerId: 'all',
    userId: 'all',
    endpoint: '',
    groupBy: 'day',
  });

  useEffect(() => {
    if (user) {
      loadUsageData();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUsageData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getUsageData(filters);
      setUsageData(data);
    } catch (err) {
      console.error('Error loading usage data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (field: keyof UsageFilter, value: unknown) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    loadUsageData();
  };

  const handleExportData = () => {
    // Implement export functionality
    console.log('Exporting data with filters:', filters);
    // This would typically generate a CSV or Excel file for download
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Usage Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and analyze API usage across your organization
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Grid container spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
              />
            </Grid>
          </LocalizationProvider>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select
                value={filters.providerId}
                label="Provider"
                onChange={(e: SelectChangeEvent) => handleFilterChange('providerId', e.target.value)}
              >
                <MenuItem value="all">All Providers</MenuItem>
                {providers.map(provider => (
                  <MenuItem key={provider.id} value={provider.id}>{provider.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Group By</InputLabel>
              <Select
                value={filters.groupBy}
                label="Group By"
                onChange={(e: SelectChangeEvent) => handleFilterChange('groupBy', e.target.value)}
              >
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={handleApplyFilters}
                disabled={loading}
                fullWidth
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportData}
                disabled={loading || !usageData}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: theme.palette.error.light }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {loading ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading usage data...</Typography>
        </Paper>
      ) : usageData ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Requests</Typography>
                  <Typography variant="h3">{usageData.totalRequests.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Active Users</Typography>
                  <Typography variant="h3">{usageData.activeUsers.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Providers Used</Typography>
                  <Typography variant="h3">{usageData.providersUsed.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Avg. Response Time</Typography>
                  <Typography variant="h3">{usageData.avgResponseTime.toFixed(2)} ms</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="usage analytics tabs">
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="By Provider" {...a11yProps(1)} />
                <Tab label="By User" {...a11yProps(2)} />
                <Tab label="By Endpoint" {...a11yProps(3)} />
                <Tab label="Details" {...a11yProps(4)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <UsageOverviewChart data={usageData.timeSeriesData} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <UsageByProviderChart data={usageData.providerData} />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <UsageByUserChart data={usageData.userData} />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <UsageByEndpointChart data={usageData.endpointData} />
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <UsageDetailsTable data={usageData.detailedData} />
            </TabPanel>
          </Paper>
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No usage data available. Apply filters to load data.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default UsageAnalytics;
