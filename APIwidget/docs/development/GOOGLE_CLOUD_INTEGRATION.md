# Google Cloud API Integration

This document explains how the Google Cloud API integration works in APIwidget.

## Overview

APIwidget integrates with Google Cloud to provide real-time cost and usage tracking for Google Cloud services. The integration uses both the Cloud Billing API and Cloud Monitoring API to fetch data.

## Implementation Details

### API Authentication

Google Cloud API authentication is implemented using API keys. The application supports two types of authentication:

1. **API Key**: A simple API key for accessing Google Cloud APIs
2. **Service Account Key**: A JSON key file for a service account with appropriate permissions

Both types of keys are stored securely using the application's encrypted storage system.

### Data Sources

The integration fetches data from two primary sources:

1. **Cloud Billing API**: Used to fetch billing and cost data
   - Endpoint: `https://cloudbilling.googleapis.com/v1`
   - Provides information about current costs and billing account details

2. **Cloud Monitoring API**: Used to fetch usage metrics
   - Endpoint: `https://monitoring.googleapis.com/v3`
   - Provides detailed metrics about resource usage

### Implementation Files

- `src/services/googleCloudService.ts`: Main service for Google Cloud API integration
- `src/services/apiIntegrationService.ts`: Integration with the application's API provider system
- `electron/main.js`: Secure storage and validation of Google Cloud API keys

## Usage

To use the Google Cloud integration:

1. Obtain a Google Cloud API key or service account key
2. Add the key in the API Key Settings page
3. The dashboard will automatically display Google Cloud cost and usage data

## Free Tier Benefits

Google Cloud offers a generous free tier for many services, which makes it an excellent choice for users to test the application with real data without incurring costs. Some of the free tier benefits include:

- Compute Engine: 1 e2-micro VM instance per month
- Cloud Storage: 5 GB of regional storage per month
- Cloud Functions: 2 million invocations per month
- BigQuery: 1 TB of queries per month
- Pub/Sub: 10 GB of messages per month

## Security Considerations

- API keys are stored locally and encrypted using a machine-specific encryption key
- No API keys are transmitted to external servers
- Service account keys are validated to ensure they have the correct format
- The application uses the principle of least privilege, only requesting the permissions it needs

## Future Improvements

- Add support for OAuth 2.0 authentication
- Implement more detailed cost breakdown by service
- Add support for budget alerts based on Google Cloud budget data
- Integrate with Cloud Billing Export to BigQuery for more detailed analysis
