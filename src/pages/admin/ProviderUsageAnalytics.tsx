import React, { useState, useEffect } from 'react';
import { Box, Grid, Tabs, Tab, useTheme, SelectChangeEvent, Typography, Paper, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Download as DownloadIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import ProviderUsageOverviewChart from '../../components/analytics/ProviderUsageOverviewChart';
import ProviderCostAnalysisChart from '../../components/analytics/ProviderCostAnalysisChart';
import ProviderResponseTimeChart from '../../components/analytics/ProviderResponseTimeChart';
import ProviderErrorRateChart from '../../components/analytics/ProviderErrorRateChart';
import ProviderUsageDetailsTable from '../../components/analytics/ProviderUsageDetailsTable';
import { getProviderUsageData, ProviderUsageData, ProviderUsageFilter } from '../../services/analyticsService';

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
      id={`provider-analytics-tabpanel-${index}`}
      aria-labelledby={`provider-analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `provider-analytics-tab-${index}`,
    'aria-controls': `provider-analytics-tabpanel-${index}`,
  };
}

const ProviderUsageAnalytics: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { providers } = useApiProviders();
  const [tabValue, setTabValue] = useState(0);
  const [usageData, setUsageData] = useState<ProviderUsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<ProviderUsageFilter>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    providerId: providers.length > 0 ? providers[0].id : '',
    endpoint: '',
    groupBy: 'day',
  });

  useEffect(() => {
    if (user && providers.length > 0) {
      // Set default provider to first provider
      setFilters(prev => ({
        ...prev,
        providerId: providers[0].id,
      }));
      loadUsageData();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, providers]);

  const loadUsageData = async () => {
    if (!filters.providerId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getProviderUsageData(filters);
      setUsageData(data);
    } catch (err) {
      console.error('Error loading provider usage data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load provider usage data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (field: keyof ProviderUsageFilter, value: unknown) => {
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

  const getProviderName = (providerId: string): string => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : providerId;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Provider Usage Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze detailed usage metrics for specific API providers
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
          <Typography>Loading provider usage data...</Typography>
        </Paper>
      ) : usageData ? (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {getProviderName(filters.providerId)} - Overview
            </Typography>
            <Grid container spacing={3}>
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
                    <Typography variant="h6" gutterBottom>Total Cost</Typography>
                    <Typography variant="h3">${usageData.totalCost.toFixed(2)}</Typography>
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
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Error Rate</Typography>
                    <Typography variant="h3">{(usageData.errorRate * 100).toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="provider analytics tabs">
                <Tab label="Usage" {...a11yProps(0)} />
                <Tab label="Cost" {...a11yProps(1)} />
                <Tab label="Response Time" {...a11yProps(2)} />
                <Tab label="Error Rate" {...a11yProps(3)} />
                <Tab label="Details" {...a11yProps(4)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <ProviderUsageOverviewChart data={usageData.timeSeriesData} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <ProviderCostAnalysisChart data={usageData.costData} />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <ProviderResponseTimeChart data={usageData.responseTimeData} />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <ProviderErrorRateChart data={usageData.errorData} />
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <ProviderUsageDetailsTable data={usageData.detailedData} />
            </TabPanel>
          </Paper>
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No provider usage data available. Apply filters to load data.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ProviderUsageAnalytics;
