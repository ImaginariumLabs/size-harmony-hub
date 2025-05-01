import React, { useState } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  Paper,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Insights as InsightsIcon,
  History as HistoryIcon,
  Widgets as WidgetsIcon,
  ViewInAr as ViewInArIcon,
  Api as ApiIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Web as WebIcon,
} from '@mui/icons-material';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | false>('getting-started');

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const faqItems = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <InfoIcon />,
      content: (
        <>
          <Typography paragraph>
            Welcome to APIwidget! This application helps you track and monitor your API usage across various providers.
            Here's how to get started:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText
                primary="1. Add your API keys"
                secondary="Go to Settings and add your API keys for the providers you want to track."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText
                primary="2. View your dashboard"
                secondary="The dashboard provides an overview of your API usage across all providers."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ViewInArIcon /></ListItemIcon>
              <ListItemText
                primary="3. Enable floating widgets"
                secondary="Use floating widgets to monitor your API usage in real-time while working on other tasks."
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            System Requirements
          </Typography>
          <Typography paragraph>
            APIwidget is designed to run on Windows 10/11 with minimal system requirements:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Operating System: Windows 10/11" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Memory: 4GB RAM (minimum)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Disk Space: 200MB free space" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Internet Connection: Required for API tracking" />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      id: 'api-keys',
      title: 'Managing API Keys',
      icon: <ApiIcon />,
      content: (
        <>
          <Typography paragraph>
            APIwidget securely stores your API keys locally on your device. We never transmit your keys to any server.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Adding API Keys
          </Typography>
          <Typography paragraph>
            To add a new API key:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="1. Navigate to Settings"
                secondary="Click on the Settings icon in the sidebar."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Select 'API Keys'"
                secondary="This will show you all your configured API providers."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Click 'Add New Key'"
                secondary="Select the provider and enter your API key."
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Supported API Providers
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label="OpenAI" color="primary" />
            <Chip label="Claude" color="secondary" />
            <Chip label="Google (Gemini)" color="info" />
            <Chip label="GitHub" color="success" />
            <Chip label="More coming soon..." variant="outlined" />
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Security
          </Typography>
          <Typography paragraph>
            Your API keys are stored securely using system-level encryption. They are never transmitted to any server
            and remain on your local device only.
          </Typography>
        </>
      ),
    },
    {
      id: 'dashboard',
      title: 'Using the Dashboard',
      icon: <DashboardIcon />,
      content: (
        <>
          <Typography paragraph>
            The dashboard provides a comprehensive overview of your API usage across all configured providers.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Dashboard Features
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Total API Cost"
                secondary="Shows your total API costs across all providers for the current month."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="API Requests"
                secondary="Displays the total number of API requests made today."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Active Providers"
                secondary="Shows the number of API providers you have configured."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="API Status"
                secondary="Provides the current status and usage percentage for each provider."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Alerts"
                secondary="Displays any alerts related to your API usage, such as approaching quota limits."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Recent Activity"
                secondary="Shows your most recent API activity."
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Refreshing Data
          </Typography>
          <Typography paragraph>
            The dashboard automatically refreshes data every few minutes. You can manually refresh the data by clicking
            the refresh button in the top-right corner of the dashboard.
          </Typography>
        </>
      ),
    },
    {
      id: 'widgets',
      title: 'Working with Widgets',
      icon: <WidgetsIcon />,
      content: (
        <>
          <Typography paragraph>
            Widgets allow you to monitor specific aspects of your API usage. You can add widgets to your dashboard
            or use floating widgets that stay on top of other applications.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Dashboard Widgets
          </Typography>
          <Typography paragraph>
            To add a widget to your dashboard:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="1. Click 'Add Widget'"
                secondary="This button is located in the top-right corner of the dashboard."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Select a provider"
                secondary="Choose which API provider you want to monitor."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Choose widget type"
                secondary="Select whether you want to track cost, usage, or other metrics."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Select widget size"
                secondary="Choose between small, medium, or large widgets."
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Floating Widgets
          </Typography>
          <Typography paragraph>
            Floating widgets stay on top of other applications, allowing you to monitor your API usage while working on other tasks.
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="1. Click 'Floating Widgets'"
                secondary="This button is located in the sidebar."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Add widgets"
                secondary="Click the '+' button to add a new floating widget."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Customize appearance"
                secondary="Adjust the size, opacity, and other settings for your widgets."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Drag to position"
                secondary="Drag widgets to position them anywhere on your screen."
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Widget Gallery
          </Typography>
          <Typography paragraph>
            The Widget Gallery provides a collection of pre-configured widgets for different use cases.
            You can browse the gallery and add widgets directly to your dashboard or as floating widgets.
          </Typography>
        </>
      ),
    },
    {
      id: 'usage-analytics',
      title: 'Usage Analytics',
      icon: <InsightsIcon />,
      content: (
        <>
          <Typography paragraph>
            The Usage Analytics page provides detailed insights into your API usage patterns, costs, and trends.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Available Analytics
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Usage Trends"
                secondary="View how your API usage has changed over time."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Provider Comparison"
                secondary="Compare usage and costs across different API providers."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Cost Analysis"
                secondary="Analyze your API costs by model, token type, and more."
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Time Ranges
          </Typography>
          <Typography paragraph>
            You can view analytics for different time ranges:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Day: View data for the current day" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Week: View data for the past 7 days" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Month: View data for the past 30 days" />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Optimization Recommendations
          </Typography>
          <Typography paragraph>
            The Usage Analytics page also provides recommendations for optimizing your API usage and reducing costs.
            These recommendations are based on your specific usage patterns and can help you save money.
          </Typography>
        </>
      ),
    },
    {
      id: 'history',
      title: 'Request History',
      icon: <HistoryIcon />,
      content: (
        <>
          <Typography paragraph>
            The Request History page allows you to view detailed information about all your API requests.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Filtering Options
          </Typography>
          <Typography paragraph>
            You can filter the request history by:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Provider"
                secondary="Filter requests by API provider (OpenAI, Claude, etc.)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Status"
                secondary="Filter by request status (success, error, timeout)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date Range"
                secondary="Filter requests by date (today, yesterday, last 7 days, etc.)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Model"
                secondary="Search for specific models (gpt-4, claude-opus, etc.)"
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Exporting Data
          </Typography>
          <Typography paragraph>
            You can export your request history as a CSV file for further analysis in spreadsheet software.
            Simply click the "Export" button and choose where to save the file.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Request Details
          </Typography>
          <Typography paragraph>
            For each request, you can view:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Timestamp: When the request was made" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provider: Which API provider was used" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Model: Which model was used" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Tokens: Number of prompt and completion tokens" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cost: The cost of the request" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Status: Whether the request succeeded or failed" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Duration: How long the request took to complete" />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <HelpIcon />,
      content: (
        <>
          <Typography paragraph>
            If you encounter any issues with APIwidget, here are some common troubleshooting steps.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Common Issues
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>API key not working</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                If your API key is not working, try the following:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="1. Verify that the API key is correct and has not expired" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="2. Check that you have sufficient credits or quota with the API provider" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="3. Try removing and re-adding the API key" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="4. Check your internet connection" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Floating widgets not appearing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                If floating widgets are not appearing, try the following:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="1. Check that you have enabled floating widgets in the settings" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="2. Make sure you have added at least one widget" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="3. Try restarting the application" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="4. Check if your system allows always-on-top windows" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Data not updating</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                If your data is not updating, try the following:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="1. Click the refresh button to manually update the data" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="2. Check your internet connection" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="3. Verify that your API keys are still valid" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="4. Restart the application" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Reporting Issues
          </Typography>
          <Typography paragraph>
            If you continue to experience issues, please report them through one of the support channels listed below.
            When reporting an issue, please include:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="1. A detailed description of the issue" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Steps to reproduce the issue" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Your operating system and version" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Any error messages you received" />
            </ListItem>
          </List>
        </>
      ),
    },
  ];

  // Filter FAQ items based on search query
  const filteredFaqItems = searchQuery
    ? faqItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.props.children.some(
          child =>
            typeof child === 'object' &&
            child !== null &&
            'props' in child &&
            typeof child.props.children === 'string' &&
            child.props.children.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : faqItems;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Help & Documentation
        </Typography>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Search help topics"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* FAQ Sections */}
      <Box sx={{ mb: 4 }}>
        {filteredFaqItems.length > 0 ? (
          filteredFaqItems.map((item) => (
            <Accordion
              key={item.id}
              expanded={expandedSection === item.id}
              onChange={handleAccordionChange(item.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${item.id}-content`}
                id={`${item.id}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>{item.icon}</Box>
                  <Typography variant="h6">{item.title}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {item.content}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No results found
            </Typography>
            <Typography color="text.secondary">
              Try a different search term or browse the help topics below.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Support */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Need More Help?
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <GitHubIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  GitHub Issues
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Report bugs or request features on our GitHub repository.
                </Typography>
                <Button
                  variant="outlined"
                  href="https://github.com/ImaginariumLabs/APIwidget"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Repository
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <EmailIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  Email Support
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Contact our support team directly via email.
                </Typography>
                <Button
                  variant="outlined"
                  href="mailto:support@apiwidget.example.com"
                >
                  Send Email
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <WebIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  Documentation
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Browse our comprehensive online documentation.
                </Typography>
                <Button
                  variant="outlined"
                  href="https://docs.apiwidget.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Docs
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Version Info */}
      <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
        <Typography variant="body2">
          APIwidget v1.0.0
        </Typography>
        <Typography variant="caption">
          © 2023-2024 Imaginarium Labs. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HelpPage;
