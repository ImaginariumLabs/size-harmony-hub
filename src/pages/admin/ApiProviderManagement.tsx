import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Box, Tabs, Tab, useTheme, Typography, Paper } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomProviderManager from '../../components/settings/CustomProviderManager';
import ApiKeyRotationManager from '../../components/settings/ApiKeyRotationManager';
import ProviderHealthDashboard from '../../components/dashboard/ProviderHealthDashboard';
import ProviderHealthHistory from '../../components/dashboard/ProviderHealthHistory';

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
      id={`api-provider-tabpanel-${index}`}
      aria-labelledby={`api-provider-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `api-provider-tab-${index}`,
    'aria-controls': `api-provider-tabpanel-${index}`,
  };
}

const ApiProviderManagement: React.FC = () => {
  // Theme will be used in future implementations
  // User will be used in future implementations
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Parse tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const tabIndex = parseInt(tabParam, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 3) {
        setTabValue(tabIndex);
      }
    }
  }, [location.search]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Update URL with tab parameter
    navigate(`/admin/api-providers?tab=${newValue}`);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          API Provider Management
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="API provider management tabs">
            <Tab label="Custom Providers" {...a11yProps(0)} />
            <Tab label="API Key Rotation" {...a11yProps(1)} />
            <Tab label="Provider Health" {...a11yProps(2)} />
            <Tab label="Health History" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <CustomProviderManager />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ApiKeyRotationManager />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ProviderHealthDashboard />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <ProviderHealthHistory />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ApiProviderManagement;
