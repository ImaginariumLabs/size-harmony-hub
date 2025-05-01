import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Box, Tabs, Tab, useTheme, Typography, Paper } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAuth } from '../../contexts/AuthContext';
import GeneralSettings from '../../components/settings/GeneralSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import IntegrationSettings from '../../components/settings/IntegrationSettings';

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
      id={`system-settings-tabpanel-${index}`}
      aria-labelledby={`system-settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `system-settings-tab-${index}`,
    'aria-controls': `system-settings-tabpanel-${index}`,
  };
}

const SystemSettings: React.FC = () => {
  // Theme will be used in future implementations
  // User will be used in future implementations
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure global system settings and preferences
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="system settings tabs">
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Security" {...a11yProps(1)} />
            <Tab label="Notifications" {...a11yProps(2)} />
            <Tab label="Integrations" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <GeneralSettings />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SecuritySettings />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <NotificationSettings />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <IntegrationSettings />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default SystemSettings;
