# APIwidget User Guide

## Getting Started

### Installation

1. Download the latest installer from the [releases page](https://github.com/ImaginariumLabs/APIwidget/releases)
2. Run the installer and follow the on-screen instructions
3. Launch APIwidget from your Start menu or desktop shortcut
4. Alternatively, use the `run-widget.bat` script in the root directory to run the application in development mode

### First Launch

When you first launch APIwidget, you'll be guided through a quick setup process:

1. Choose your theme preference (dark or light)
2. Select which API providers you want to monitor
3. Add your API keys for the selected providers
4. Configure widget appearance and position

### System Requirements

- **Operating System**: Windows 10 or later
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Disk Space**: 100MB free space
- **Display**: 1280x720 or higher resolution
- **Internet**: Required for API data retrieval
- **Node.js**: 16.x or higher (for development mode)

## Using the Widgets

### Widget Overview

APIwidget now supports multiple floating widgets with enhanced features. Each widget provides at-a-glance information about your API usage:

- **Primary Cost Display**: Shows the current cost for the selected API provider
- **Change Indicator**: Shows cost change since last period (day/week/month)
- **Provider Name**: Displays which API provider is currently being shown
- **Usage Percentage**: Shows percentage of budget/quota used
- **Last Updated**: Shows when the data was last refreshed

### Widget Controls

- **Drag**: Click and drag anywhere on the widget to move it
- **Resize**: Drag the bottom-right corner to freely resize the widget
- **Provider Switch**: Click the provider name to cycle through providers
- **Settings**: Click the gear icon to open settings
- **Refresh**: Click the refresh icon to update data manually
- **Close**: Click the X icon to close the widget

### Multiple Widget Layouts

APIwidget supports three different layout modes for multiple widgets:

- **Free Layout**: Position widgets anywhere on the screen
- **Grid Layout**: Arrange widgets in a grid pattern
- **Line Layout**: Arrange widgets in a horizontal line at the bottom of the screen

### Widget Configuration Presets

You can save and restore widget configurations as presets:

1. Arrange your widgets as desired
2. Click the "Save Preset" button in the Floating Widgets page
3. Enter a name for your preset
4. To restore a preset, select it from the dropdown and click "Load Preset"

### Keyboard Shortcuts

- **S**: Open settings panel
- **Escape**: Close settings panel
- **T**: Toggle theme (dark/light)
- **C**: Cycle through widget sizes
- **Arrow keys**: Navigate between providers
- **Ctrl+Shift+W**: Show/hide all widgets
- **Ctrl+Shift+A**: Add a new widget

## Managing API Keys

To add or manage your API keys:

1. Click the gear icon on the widget to open settings
2. Select "API Keys" from the settings menu
3. Click "Add New Key" to add a new API key
4. Enter your API key and select the provider
5. Click "Save" to store your key securely

### Supported API Providers

- **OpenAI**: Monitor token usage and costs for GPT models (GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo)
- **Claude (Anthropic)**: Monitor usage of Claude models (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku)
- **Gemini (Google)**: Track Google AI API usage with free tier support (Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash)
- **GitHub**: Track API rate limits and usage
- **AWS**: Monitor AWS API usage (coming soon)
- **Azure**: Monitor Azure API usage (coming soon)

## Customizing the Widget

### Appearance

1. Click the gear icon on the widget to open settings
2. Select "Appearance" from the settings menu
3. Choose from the following options:
   - **Theme**: Dark or light
   - **Size**: Custom size with free resizing
   - **Transparency**: Adjust the widget transparency
   - **Always on Top**: Toggle whether the widget stays on top of other windows
   - **Glass Morphism Effect**: Adjust the blur and transparency of the glass effect

### Position and Layout

Widgets remember their positions between sessions. To manage widget layouts:

1. Navigate to the Floating Widgets page from the main dashboard
2. Select a layout mode (Free, Grid, or Line)
3. Add, remove, or rearrange widgets as needed
4. Save your configuration as a preset for future use
5. To reset all widget positions, click "Reset Layout"

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

1. Click the expand icon on any widget
2. Alternatively, click the APIwidget icon in the system tray and select "Open Dashboard"
3. View detailed information about all your API providers
4. See historical usage trends and patterns
5. Access advanced settings and configurations

### Dashboard Features

- **Usage Overview**: Summary of all API usage
- **Cost Analysis**: Detailed breakdown of costs by provider
- **Usage Trends**: Charts showing usage patterns over time
- **Model Breakdown**: Analysis of usage by model for each provider
- **Daily Usage**: Track usage and costs on a daily basis
- **Token Distribution**: Analyze the distribution of input vs. output tokens
- **Recommendations**: Suggestions for optimizing API usage

### Dashboard Navigation

The dashboard includes a side menu for easy navigation:

- **Dashboard**: Main overview page
- **Usage Analytics**: Detailed usage statistics and trends
- **Request History**: History of API requests
- **Widget Gallery**: Browse and add pre-configured widgets
- **Floating Widgets**: Manage multiple floating widgets
- **API Providers**: Detailed pages for each provider (OpenAI, Claude, Gemini)
- **API Keys**: Manage your API keys
- **Help & Support**: Access help and support resources

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

## Real-Time API Tracking

APIwidget provides real-time tracking of API usage and costs:

### Token Counting

For accurate cost calculation, APIwidget counts tokens for each API request:

- **OpenAI**: Uses the tiktoken library for accurate token counting
- **Claude**: Uses the Anthropic tokenizer for accurate token counting
- **Gemini**: Uses the Gemini API's countTokens endpoint for accurate token counting

### Usage Statistics

Detailed usage statistics are available for each provider:

- **Total Cost**: Current total cost for the billing period
- **Token Usage**: Number of input and output tokens used
- **Request Count**: Number of API requests made
- **Daily Usage**: Usage and costs broken down by day
- **Model Usage**: Usage and costs broken down by model

### Cost Calculation

Costs are calculated based on the current pricing for each provider:

- **OpenAI**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
- **Claude**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Gemini**: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash

Pricing information is regularly updated to ensure accurate cost calculation.
