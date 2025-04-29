# Navigation Guide

This document provides an overview of the navigation structure in the APIwidget application.

## Main Navigation

The main navigation is located in the sidebar on the left side of the application. It provides access to all the main features of the application.

### Dashboard

The Dashboard is the main landing page of the application. It provides an overview of your API usage across all configured providers.

**Path:** `/`

### Usage Analytics

The Usage Analytics page provides detailed insights into your API usage patterns, costs, and trends. You can view usage trends, compare providers, and analyze costs.

**Path:** `/usage`

### Request History

The Request History page allows you to view detailed information about all your API requests. You can filter requests by provider, status, date range, and more.

**Path:** `/history`

### Widget Gallery

The Widget Gallery provides a collection of pre-configured widgets for different use cases. You can browse the gallery and add widgets to your dashboard or as floating widgets.

**Path:** `/widgets`

### Floating Widgets

The Floating Widgets page allows you to manage your floating widgets. You can add, remove, and customize widgets that stay on top of other applications.

**Path:** `/floating-widgets`

## Bottom Navigation

### API Keys

The API Keys page allows you to manage your API keys for different providers. You can add, edit, and remove API keys.

**Path:** `/settings/api-keys`

### Help & Support

The Help & Support page provides documentation, FAQs, and support resources to help you use the application effectively.

**Path:** `/help`

## Provider Pages

Each configured API provider has its own dedicated page that shows detailed usage information for that provider.

**Path:** `/provider/:providerId`

For example:
- `/provider/openai` - OpenAI provider details
- `/provider/claude` - Claude provider details
- `/provider/google` - Google (Gemini) provider details

## URL Structure

The application uses a simple URL structure to organize its pages:

- `/` - Dashboard
- `/usage` - Usage Analytics
- `/history` - Request History
- `/widgets` - Widget Gallery
- `/floating-widgets` - Floating Widgets
- `/settings/api-keys` - API Keys
- `/help` - Help & Support
- `/provider/:providerId` - Provider Details

## Navigation Components

The application uses the following components for navigation:

1. **Sidebar** - The main navigation sidebar on the left side of the application.
2. **Breadcrumbs** - Breadcrumb navigation at the top of each page.
3. **Back Button** - A back button on certain pages to return to the previous page.
4. **Links** - Contextual links within pages to navigate to related content.

## Keyboard Shortcuts

The application supports the following keyboard shortcuts for navigation:

- `Alt+D` - Go to Dashboard
- `Alt+U` - Go to Usage Analytics
- `Alt+H` - Go to Request History
- `Alt+W` - Go to Widget Gallery
- `Alt+F` - Go to Floating Widgets
- `Alt+K` - Go to API Keys
- `Alt+?` - Go to Help & Support
