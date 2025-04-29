# APIwidget Troubleshooting Guide

This guide provides solutions for common issues you might encounter while using APIwidget. If you're experiencing problems, follow the troubleshooting steps below to resolve them.

## Table of Contents

1. [Application Issues](#application-issues)
   - [Application Won't Start](#application-wont-start)
   - [Application Crashes](#application-crashes)
   - [Blank or White Screen](#blank-or-white-screen)
   - [Performance Issues](#performance-issues)

2. [Widget Issues](#widget-issues)
   - [Widget Not Visible](#widget-not-visible)
   - [Widget Not Draggable](#widget-not-draggable)
   - [Widget Not Resizable](#widget-not-resizable)
   - [Multiple Widgets Not Working](#multiple-widgets-not-working)

3. [API Integration Issues](#api-integration-issues)
   - [API Key Problems](#api-key-problems)
   - [No Data Displayed](#no-data-displayed)
   - [Incorrect Data](#incorrect-data)
   - [Data Not Updating](#data-not-updating)

4. [Dashboard Issues](#dashboard-issues)
   - [Dashboard Not Loading](#dashboard-not-loading)
   - [Charts Not Displaying](#charts-not-displaying)
   - [Navigation Problems](#navigation-problems)

5. [System Integration Issues](#system-integration-issues)
   - [System Tray Icon Missing](#system-tray-icon-missing)
   - [Notifications Not Working](#notifications-not-working)
   - [Auto-Start Issues](#auto-start-issues)

6. [Advanced Troubleshooting](#advanced-troubleshooting)
   - [Enabling Debug Mode](#enabling-debug-mode)
   - [Checking Log Files](#checking-log-files)
   - [Resetting the Application](#resetting-the-application)

## Application Issues

### Application Won't Start

If APIwidget doesn't start when you launch it:

1. **Check for running instances**: Look in Task Manager (Windows) or Activity Monitor (macOS) for existing APIwidget processes and end them.

2. **Verify installation**: Make sure the application was installed correctly. Try reinstalling if necessary.

3. **Check system requirements**: Ensure your system meets the minimum requirements:
   - Windows 10 or later
   - 4GB RAM
   - 100MB free disk space

4. **Run as administrator**: Right-click the application icon and select "Run as administrator" (Windows).

5. **Check antivirus software**: Your antivirus might be blocking the application. Add APIwidget to the exceptions list.

### Application Crashes

If APIwidget crashes during use:

1. **Update the application**: Make sure you're using the latest version of APIwidget.

2. **Check system resources**: Ensure you have enough free memory and disk space.

3. **Disable conflicting applications**: Some applications might conflict with APIwidget, especially those that modify the UI or use overlay features.

4. **Check for updates**: Ensure your operating system and graphics drivers are up to date.

5. **Run in compatibility mode**: Right-click the application icon, select Properties > Compatibility, and try running in compatibility mode for Windows 10 (Windows).

### Blank or White Screen

If you see a blank or white screen when launching APIwidget:

1. **Wait a moment**: The application might be loading. Give it 30 seconds to initialize.

2. **Restart the application**: Close and reopen APIwidget.

3. **Check your display settings**: Ensure your display scaling is set to 100% or try a different resolution.

4. **Run with debug logging**: Use the `start-electron.bat` script with debug logging enabled (see [Enabling Debug Mode](#enabling-debug-mode)).

5. **Check graphics acceleration**: Try disabling hardware acceleration in your system settings.

### Performance Issues

If APIwidget is running slowly or using excessive resources:

1. **Close unnecessary applications**: Free up system resources by closing other applications.

2. **Reduce widget count**: Using fewer widgets will improve performance.

3. **Increase polling interval**: In Settings > General, increase the data refresh interval to reduce API calls.

4. **Disable animations**: In Settings > Appearance, disable animations to improve performance.

5. **Check for background processes**: Ensure no unnecessary processes are running in the background.

## Widget Issues

### Widget Not Visible

If you can't see the widget:

1. **Check system tray**: Look for the APIwidget icon in the system tray. Right-click it and select "Show Widget".

2. **Check widget settings**: Open the main application and go to Settings > Widgets to ensure the widget is enabled.

3. **Check display settings**: The widget might be off-screen. Go to Settings > Widgets > Reset Position.

4. **Verify transparency settings**: If your system doesn't support transparency, the widget might be invisible. Try disabling glass morphism in Settings > Appearance.

5. **Check z-order**: Other applications might be covering the widget. Try setting "Always on Top" in widget settings.

### Widget Not Draggable

If you can't drag the widget to reposition it:

1. **Check lock status**: The widget might be locked. Click the lock icon in the widget header to unlock it.

2. **Drag from the header**: Make sure you're dragging from the widget header area, not the content area.

3. **Check permissions**: On some systems, you need administrator privileges to interact with always-on-top windows.

4. **Restart the application**: Close and reopen APIwidget to reset the widget state.

5. **Reset widget settings**: Go to Settings > Widgets > Reset Settings to restore default behavior.

### Widget Not Resizable

If you can't resize the widget:

1. **Check resize handle**: Look for the resize handle in the bottom-right corner of the widget.

2. **Check lock status**: The widget might be locked. Click the lock icon to unlock it.

3. **Verify widget type**: Some widget types have fixed sizes and cannot be resized.

4. **Check minimum/maximum size**: The widget might already be at its minimum or maximum size.

5. **Reset widget settings**: Go to Settings > Widgets > Reset Settings to restore default behavior.

### Multiple Widgets Not Working

If you're having issues with multiple widgets:

1. **Check system resources**: Multiple widgets require more system resources. Ensure your system can handle them.

2. **Verify widget limit**: There might be a limit to the number of widgets you can have. Check the documentation.

3. **Check layout mode**: If using grid or line layout, try switching to free positioning.

4. **Restart the application**: Close and reopen APIwidget to reset all widget states.

5. **Reset widget configuration**: Go to Settings > Widgets > Reset All to restore default configuration.

## API Integration Issues

### API Key Problems

If you're having issues with API keys:

1. **Verify API key format**: Ensure the API key is in the correct format:
   - OpenAI: Starts with "sk-" and is at least 30 characters
   - Claude: Starts with "sk-ant-" and is at least 30 characters
   - Gemini: Typically a long alphanumeric string

2. **Check API key validity**: Verify the API key is valid and active in the provider's dashboard.

3. **Re-enter the API key**: Go to Settings > API Keys, delete the existing key, and enter it again.

4. **Check permissions**: Ensure the API key has the necessary permissions for usage statistics.

5. **Check for special characters**: If copying the API key, ensure no extra spaces or characters are included.

### No Data Displayed

If no API usage data is displayed:

1. **Check API key**: Ensure you've entered a valid API key for the provider.

2. **Verify API usage**: Make sure you've actually used the API with this key recently.

3. **Check internet connection**: Ensure you have an active internet connection.

4. **Wait for data refresh**: Data might take a few minutes to appear after adding a new API key.

5. **Try mock data**: Enable mock data in Settings > General > Use Mock Data to test functionality.

### Incorrect Data

If the displayed data seems incorrect:

1. **Check time period**: Verify the selected time period (daily, weekly, monthly) in the dashboard.

2. **Refresh data**: Click the refresh button to get the latest data.

3. **Verify provider dashboard**: Compare the data with what's shown in the provider's own dashboard.

4. **Check for multiple keys**: If you have multiple API keys for the same provider, the data might be incomplete.

5. **Clear cache**: Go to Settings > Advanced > Clear Cache to reset stored data.

### Data Not Updating

If your usage data isn't updating:

1. **Check refresh interval**: Verify the automatic refresh interval in Settings > General.

2. **Manual refresh**: Try clicking the refresh button to force an update.

3. **Check API limits**: You might have reached the API rate limits. Wait and try again later.

4. **Verify internet connection**: Ensure you have an active internet connection.

5. **Restart the application**: Close and reopen APIwidget to reset the data fetching process.

## Dashboard Issues

### Dashboard Not Loading

If the dashboard doesn't load:

1. **Check internet connection**: Ensure you have an active internet connection.

2. **Verify API keys**: Make sure you've added at least one valid API key.

3. **Clear browser cache**: If using the web version, clear your browser cache.

4. **Restart the application**: Close and reopen APIwidget.

5. **Check for updates**: Ensure you're using the latest version of APIwidget.

### Charts Not Displaying

If charts or graphs aren't displaying correctly:

1. **Check data availability**: Ensure you have enough data for the selected time period.

2. **Resize the window**: Sometimes resizing the application window can trigger chart redrawing.

3. **Switch views**: Try switching between different dashboard views.

4. **Check browser compatibility**: If using the web version, try a different browser.

5. **Update graphics drivers**: Ensure your graphics drivers are up to date.

### Navigation Problems

If you're having issues navigating the dashboard:

1. **Check for UI errors**: Look for error messages or red indicators in the UI.

2. **Verify sidebar visibility**: Ensure the sidebar is visible and expanded.

3. **Try keyboard shortcuts**: Use keyboard navigation (Tab, Enter) instead of mouse clicks.

4. **Restart the application**: Close and reopen APIwidget to reset the UI state.

5. **Reset layout**: Go to Settings > Appearance > Reset Layout to restore the default layout.

## System Integration Issues

### System Tray Icon Missing

If the system tray icon is missing:

1. **Check system tray settings**: Ensure the system tray is enabled and visible in your operating system.

2. **Look for hidden icons**: The icon might be in the hidden icons section of the system tray.

3. **Restart the application**: Close and reopen APIwidget.

4. **Check startup settings**: Verify that APIwidget is configured to start with the system.

5. **Reinstall the application**: Uninstall and reinstall APIwidget to reset system integration.

### Notifications Not Working

If you're not receiving notifications:

1. **Check notification settings**: Go to Settings > Notifications and ensure notifications are enabled.

2. **Verify system permissions**: Ensure APIwidget has permission to send notifications in your system settings.

3. **Check notification thresholds**: Notifications might only trigger when certain thresholds are met.

4. **Test notification**: Use the "Test Notification" button in Settings > Notifications.

5. **Restart the application**: Close and reopen APIwidget to reset the notification system.

### Auto-Start Issues

If APIwidget doesn't start automatically with your system:

1. **Check auto-start setting**: Go to Settings > General and ensure "Start with System" is enabled.

2. **Verify system permissions**: Ensure APIwidget has permission to auto-start in your system settings.

3. **Check startup folder**: Look in your system's startup folder for the APIwidget shortcut.

4. **Add manually to startup**: Add APIwidget to your system's startup applications manually.

5. **Reinstall the application**: Uninstall and reinstall APIwidget to reset system integration.

## Advanced Troubleshooting

### Enabling Debug Mode

To enable debug mode for advanced troubleshooting:

1. **Use debug batch file**: Run the `start-electron.bat` script in the application directory with the following commands:

   ```batch
   @echo off
   echo Starting APIwidget Electron app with debug logging...
   cd APIwidget
   set NODE_ENV=development
   set OPEN_MAIN_WINDOW=true
   set DEBUG=electron:*
   set ELECTRON_ENABLE_LOGGING=true
   npm run electron:dev
   ```

2. **Check console output**: Look for error messages or warnings in the console output.

3. **Save logs**: Copy the console output to a text file for further analysis or to share with support.

### Checking Log Files

To check application log files:

1. **Locate log files**: Log files are stored in the following locations:
   - Windows: `%APPDATA%\APIwidget\logs`
   - macOS: `~/Library/Logs/APIwidget`
   - Linux: `~/.config/APIwidget/logs`

2. **Examine recent logs**: Look for files with recent timestamps and examine their contents for errors.

3. **Search for errors**: Search for terms like "error", "warning", "failed", or "exception" in the log files.

4. **Share with support**: If needed, share the log files with the support team for further analysis.

### Resetting the Application

If all else fails, you can reset the application to its default state:

1. **Close the application**: Ensure APIwidget is completely closed.

2. **Clear application data**:
   - Windows: Delete the folder `%APPDATA%\APIwidget`
   - macOS: Delete the folder `~/Library/Application Support/APIwidget`
   - Linux: Delete the folder `~/.config/APIwidget`

3. **Reinstall the application**: Uninstall APIwidget, then download and install the latest version.

4. **Reconfigure settings**: After reinstalling, you'll need to reconfigure all settings and re-enter your API keys.

## Still Need Help?

If you're still experiencing issues after trying these troubleshooting steps:

1. **Check the documentation**: Review the full documentation at [docs.apiwidget.com](https://docs.apiwidget.com).

2. **Visit the forum**: Ask for help on the [APIwidget Community Forum](https://forum.apiwidget.com).

3. **Submit a bug report**: Report the issue on the [GitHub Issues page](https://github.com/ImaginariumLabs/APIwidget/issues).

4. **Contact support**: Email support at [support@apiwidget.com](mailto:support@apiwidget.com) with details about your issue.

Remember to include the following information when seeking help:
- APIwidget version
- Operating system and version
- Steps to reproduce the issue
- Any error messages you've seen
- Screenshots if applicable
- Log files if available
