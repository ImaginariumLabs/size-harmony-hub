# APIwidget User Guide

## Getting Started

### Installation

1. Download the latest installer from the [releases page](https://github.com/your-org/apiwidget/releases)
2. Run the installer and follow the on-screen instructions
3. Launch APIwidget from your Start menu or desktop shortcut

### First Launch

When you first launch APIwidget, you'll be guided through a quick setup process:

1. Choose your theme preference (dark or light)
2. Select which API providers you want to monitor
3. Add your API keys for the selected providers
4. Configure widget appearance and position

## Using the Widget

### Widget Overview

The APIwidget floating widget provides at-a-glance information about your API usage:

- **Primary Cost Display**: Shows the current cost for the selected API provider
- **Change Indicator**: Shows cost change since last period (day/week/month)
- **Provider Name**: Displays which API provider is currently being shown
- **Last Updated**: Shows when the data was last refreshed

### Widget Controls

- **Drag**: Click and drag anywhere on the widget to move it
- **Resize**: Drag the bottom-right corner to resize the widget
- **Provider Switch**: Click the provider name to cycle through providers
- **Settings**: Click the gear icon to open settings
- **Refresh**: Click the refresh icon to update data manually

### Keyboard Shortcuts

- **S**: Open settings panel
- **Escape**: Close settings panel
- **T**: Toggle theme (dark/light)
- **C**: Cycle through widget sizes
- **Arrow keys**: Navigate between providers

## Managing API Keys

To add or manage your API keys:

1. Click the gear icon on the widget to open settings
2. Select "API Keys" from the settings menu
3. Click "Add New Key" to add a new API key
4. Enter your API key and select the provider
5. Click "Save" to store your key securely

### Supported API Providers

- **OpenAI**: Monitor token usage and costs for GPT models
- **GitHub**: Track API rate limits and usage
- **AWS**: Monitor AWS API usage
- **Google Cloud**: Track GCP API usage (coming soon)
- **Azure**: Monitor Azure API usage (coming soon)

## Customizing the Widget

### Appearance

1. Click the gear icon on the widget to open settings
2. Select "Appearance" from the settings menu
3. Choose from the following options:
   - **Theme**: Dark or light
   - **Size**: Compact, small, medium, or large
   - **Transparency**: Adjust the widget transparency
   - **Always on Top**: Toggle whether the widget stays on top of other windows

### Position

The widget remembers its position between sessions. To reset the position:

1. Click the gear icon on the widget to open settings
2. Select "Position" from the settings menu
3. Click "Reset Position" to move the widget to the default position

## Application Settings

### General Settings

1. Click the gear icon on the widget to open settings
2. Select "General" from the settings menu
3. Configure the following options:
   - **Start with Windows**: Launch automatically when Windows starts
   - **Minimize to Tray**: Hide the widget when minimized
   - **Refresh Interval**: How often to update API usage data
   - **Show Notifications**: Enable/disable system notifications

### Data Settings

1. Click the gear icon on the widget to open settings
2. Select "Data" from the settings menu
3. Configure the following options:
   - **Data Storage**: Choose whether to store historical data
   - **Data Retention**: How long to keep historical data
   - **Export Data**: Export your usage data to CSV

## Setting Up Alerts

To set up alerts for API usage:

1. Click the gear icon on the widget to open settings
2. Select "Alerts" from the settings menu
3. Click "Add New Alert"
4. Configure alert thresholds for:
   - Cost limits
   - Rate limit warnings
   - Quota usage
5. Choose notification methods (system notification, email)
6. Save your alert configuration

## Main Dashboard

To access the full dashboard:

1. Click the expand icon on the widget
2. View detailed information about all your API providers
3. See historical usage trends and patterns
4. Access advanced settings and configurations

### Dashboard Features

- **Usage Overview**: Summary of all API usage
- **Cost Analysis**: Detailed breakdown of costs by provider
- **Usage Trends**: Charts showing usage patterns over time
- **Recommendations**: Suggestions for optimizing API usage

## Troubleshooting

### Widget Not Appearing

If the widget doesn't appear after launching the application:

1. Check the system tray for the APIwidget icon
2. Right-click the icon and select "Show Widget"
3. If the widget still doesn't appear, try restarting the application
4. Check if the widget is positioned off-screen by resetting its position

### API Key Issues

If you're experiencing issues with an API key:

1. Verify the key is correct and has the necessary permissions
2. Check if the key has expired or been revoked
3. Try regenerating a new key from the provider's website
4. Delete and re-add the key in APIwidget

### Data Not Updating

If your usage data isn't updating:

1. Click the refresh button on the widget
2. Check if the API provider is experiencing downtime
3. Verify your API key has the necessary permissions to view usage data
4. Restart the application to refresh your session

## Best Practices

- **Regular Monitoring**: Check your widget regularly to stay informed about your API usage
- **Set Up Alerts**: Configure alerts to be notified of unusual activity or approaching limits
- **Secure API Keys**: Never share your API keys and rotate them periodically
- **Optimize Usage**: Use the recommendations provided to optimize your API usage and reduce costs
- **Multiple Providers**: Monitor all your API providers to get a complete picture of your usage

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+W | Show/hide widget |
| Ctrl+Shift+S | Open settings |
| Ctrl+Shift+R | Refresh data |
| Ctrl+Shift+D | Open dashboard |
| Ctrl+Shift+Q | Quit application |

## System Requirements

- **Operating System**: Windows 10 or later
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Disk Space**: 100MB free space
- **Display**: 1280x720 or higher resolution
- **Internet**: Required for API data retrieval
