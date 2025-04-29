import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  TextField,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data for demonstration
const mockGeneralSettings = {
  applicationName: 'APIwidget',
  defaultTheme: 'dark',
  sessionTimeout: 30,
  defaultLanguage: 'en',
  enableAnalytics: true,
  debugMode: false,
};

const mockAuthSettings = {
  passwordMinLength: 12,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecial: true,
  passwordMaxAge: 90,
  passwordHistory: 5,
  mfaEnabled: true,
  mfaRequiredForAdmins: true,
  mfaRequiredForAll: false,
  ssoEnabled: false,
};

const mockNotificationSettings = {
  emailNotificationsEnabled: true,
  smtpServer: 'smtp.example.com',
  smtpPort: 587,
  smtpUsername: 'notifications@example.com',
  smtpPassword: '********',
  emailFromAddress: 'notifications@example.com',
  inAppNotificationsEnabled: true,
  notificationRetentionDays: 30,
  webhookNotificationsEnabled: false,
  webhookUrl: '',
};

const mockStorageSettings = {
  usageDataRetentionDays: 365,
  logRetentionDays: 90,
  backupRetentionDays: 30,
  userStorageLimitMB: 100,
  totalStorageLimitGB: 10,
  enableCompression: true,
  compressionLevel: 'medium',
};

const SystemSettings: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState(mockGeneralSettings);
  const [authSettings, setAuthSettings] = useState(mockAuthSettings);
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [storageSettings, setStorageSettings] = useState(mockStorageSettings);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the server
    // For now, we're using mock data
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGeneralSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAuthSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setAuthSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNotificationSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStorageSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setStorageSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      if (name.startsWith('general')) {
        setGeneralSettings((prev) => ({
          ...prev,
          [name.replace('general', '')]: value,
        }));
      } else if (name.startsWith('auth')) {
        setAuthSettings((prev) => ({
          ...prev,
          [name.replace('auth', '')]: value,
        }));
      } else if (name.startsWith('notification')) {
        setNotificationSettings((prev) => ({
          ...prev,
          [name.replace('notification', '')]: value,
        }));
      } else if (name.startsWith('storage')) {
        setStorageSettings((prev) => ({
          ...prev,
          [name.replace('storage', '')]: value,
        }));
      }
    }
  };

  const handleSaveSettings = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success',
      });
    }, 1000);
  };

  const handleResetSettings = () => {
    setGeneralSettings(mockGeneralSettings);
    setAuthSettings(mockAuthSettings);
    setNotificationSettings(mockNotificationSettings);
    setStorageSettings(mockStorageSettings);
    setSnackbar({
      open: true,
      message: 'Settings reset to defaults',
      severity: 'info',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleResetSettings}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<SecurityIcon />} label="Authentication" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<StorageIcon />} label="Storage" />
        </Tabs>
        <Divider />

        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Application Settings" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Application Name"
                        name="applicationName"
                        value={generalSettings.applicationName}
                        onChange={handleGeneralSettingsChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Default Theme</InputLabel>
                        <Select
                          name="generaldefaultTheme"
                          value={generalSettings.defaultTheme}
                          onChange={handleSelectChange}
                          label="Default Theme"
                        >
                          <MenuItem value="light">Light</MenuItem>
                          <MenuItem value="dark">Dark</MenuItem>
                          <MenuItem value="system">System</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Session Timeout (minutes)"
                        name="sessionTimeout"
                        type="number"
                        value={generalSettings.sessionTimeout}
                        onChange={handleGeneralSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1, max: 1440 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Default Language</InputLabel>
                        <Select
                          name="generaldefaultLanguage"
                          value={generalSettings.defaultLanguage}
                          onChange={handleSelectChange}
                          label="Default Language"
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                          <MenuItem value="ja">Japanese</MenuItem>
                          <MenuItem value="zh">Chinese</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Feature Settings" />
                <Divider />
                <CardContent>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={generalSettings.enableAnalytics}
                          onChange={handleGeneralSettingsChange}
                          name="enableAnalytics"
                          color="primary"
                        />
                      }
                      label="Enable Usage Analytics"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={generalSettings.debugMode}
                          onChange={handleGeneralSettingsChange}
                          name="debugMode"
                          color="primary"
                        />
                      }
                      label="Debug Mode"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Authentication Settings */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Password Policy" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Minimum Password Length"
                        name="passwordMinLength"
                        type="number"
                        value={authSettings.passwordMinLength}
                        onChange={handleAuthSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 8, max: 128 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Password Maximum Age (days)"
                        name="passwordMaxAge"
                        type="number"
                        value={authSettings.passwordMaxAge}
                        onChange={handleAuthSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0, max: 365 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Password History (count)"
                        name="passwordHistory"
                        type="number"
                        value={authSettings.passwordHistory}
                        onChange={handleAuthSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0, max: 24 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={authSettings.passwordRequireUppercase}
                              onChange={handleAuthSettingsChange}
                              name="passwordRequireUppercase"
                              color="primary"
                            />
                          }
                          label="Require Uppercase Letters"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={authSettings.passwordRequireLowercase}
                              onChange={handleAuthSettingsChange}
                              name="passwordRequireLowercase"
                              color="primary"
                            />
                          }
                          label="Require Lowercase Letters"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={authSettings.passwordRequireNumbers}
                              onChange={handleAuthSettingsChange}
                              name="passwordRequireNumbers"
                              color="primary"
                            />
                          }
                          label="Require Numbers"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={authSettings.passwordRequireSpecial}
                              onChange={handleAuthSettingsChange}
                              name="passwordRequireSpecial"
                              color="primary"
                            />
                          }
                          label="Require Special Characters"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Multi-Factor Authentication" />
                <Divider />
                <CardContent>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={authSettings.mfaEnabled}
                          onChange={handleAuthSettingsChange}
                          name="mfaEnabled"
                          color="primary"
                        />
                      }
                      label="Enable Multi-Factor Authentication"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={authSettings.mfaRequiredForAdmins}
                          onChange={handleAuthSettingsChange}
                          name="mfaRequiredForAdmins"
                          color="primary"
                          disabled={!authSettings.mfaEnabled}
                        />
                      }
                      label="Require MFA for Administrators"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={authSettings.mfaRequiredForAll}
                          onChange={handleAuthSettingsChange}
                          name="mfaRequiredForAll"
                          color="primary"
                          disabled={!authSettings.mfaEnabled}
                        />
                      }
                      label="Require MFA for All Users"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Single Sign-On" />
                <Divider />
                <CardContent>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={authSettings.ssoEnabled}
                          onChange={handleAuthSettingsChange}
                          name="ssoEnabled"
                          color="primary"
                        />
                      }
                      label="Enable Single Sign-On"
                    />
                  </FormGroup>
                  {authSettings.ssoEnabled && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      To configure SSO providers, please visit the SSO Configuration page.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Email Notifications" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailNotificationsEnabled}
                        onChange={handleNotificationSettingsChange}
                        name="emailNotificationsEnabled"
                        color="primary"
                      />
                    }
                    label="Enable Email Notifications"
                  />
                  {notificationSettings.emailNotificationsEnabled && (
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="SMTP Server"
                          name="smtpServer"
                          value={notificationSettings.smtpServer}
                          onChange={handleNotificationSettingsChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="SMTP Port"
                          name="smtpPort"
                          type="number"
                          value={notificationSettings.smtpPort}
                          onChange={handleNotificationSettingsChange}
                          fullWidth
                          margin="normal"
                          inputProps={{ min: 1, max: 65535 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="SMTP Username"
                          name="smtpUsername"
                          value={notificationSettings.smtpUsername}
                          onChange={handleNotificationSettingsChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="SMTP Password"
                          name="smtpPassword"
                          type="password"
                          value={notificationSettings.smtpPassword}
                          onChange={handleNotificationSettingsChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="From Email Address"
                          name="emailFromAddress"
                          type="email"
                          value={notificationSettings.emailFromAddress}
                          onChange={handleNotificationSettingsChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="In-App Notifications" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.inAppNotificationsEnabled}
                        onChange={handleNotificationSettingsChange}
                        name="inAppNotificationsEnabled"
                        color="primary"
                      />
                    }
                    label="Enable In-App Notifications"
                  />
                  {notificationSettings.inAppNotificationsEnabled && (
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <TextField
                          label="Notification Retention (days)"
                          name="notificationRetentionDays"
                          type="number"
                          value={notificationSettings.notificationRetentionDays}
                          onChange={handleNotificationSettingsChange}
                          fullWidth
                          margin="normal"
                          inputProps={{ min: 1, max: 365 }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Webhook Notifications" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.webhookNotificationsEnabled}
                        onChange={handleNotificationSettingsChange}
                        name="webhookNotificationsEnabled"
                        color="primary"
                      />
                    }
                    label="Enable Webhook Notifications"
                  />
                  {notificationSettings.webhookNotificationsEnabled && (
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <TextField
                          label="Webhook URL"
                          name="webhookUrl"
                          value={notificationSettings.webhookUrl}
                          onChange={handleNotificationSettingsChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Storage Settings */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Data Retention" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Usage Data Retention (days)"
                        name="usageDataRetentionDays"
                        type="number"
                        value={storageSettings.usageDataRetentionDays}
                        onChange={handleStorageSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1, max: 3650 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Log Retention (days)"
                        name="logRetentionDays"
                        type="number"
                        value={storageSettings.logRetentionDays}
                        onChange={handleStorageSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1, max: 365 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Backup Retention (days)"
                        name="backupRetentionDays"
                        type="number"
                        value={storageSettings.backupRetentionDays}
                        onChange={handleStorageSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1, max: 365 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Storage Limits" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Per-User Storage Limit (MB)"
                        name="userStorageLimitMB"
                        type="number"
                        value={storageSettings.userStorageLimitMB}
                        onChange={handleStorageSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Total Storage Limit (GB)"
                        name="totalStorageLimitGB"
                        type="number"
                        value={storageSettings.totalStorageLimitGB}
                        onChange={handleStorageSettingsChange}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Compression Settings" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={storageSettings.enableCompression}
                        onChange={handleStorageSettingsChange}
                        name="enableCompression"
                        color="primary"
                      />
                    }
                    label="Enable Data Compression"
                  />
                  {storageSettings.enableCompression && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Compression Level</InputLabel>
                      <Select
                        name="storagecompressionLevel"
                        value={storageSettings.compressionLevel}
                        onChange={handleSelectChange}
                        label="Compression Level"
                      >
                        <MenuItem value="low">Low (Faster, Less Compression)</MenuItem>
                        <MenuItem value="medium">Medium (Balanced)</MenuItem>
                        <MenuItem value="high">High (Slower, More Compression)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

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

export default SystemSettings;
