# AI API Cost Tracking

This document explains how the AI API cost tracking works in APIwidget.

## Overview

APIwidget integrates with three major AI API providers to track usage and costs:

1. **OpenAI** (GPT models)
2. **Anthropic** (Claude models)
3. **Google** (Gemini models)

The implementation provides real-time cost tracking, usage analytics, and secure API key management.

## Implementation Details

### API Services

Each provider has a dedicated service that handles API integration:

- `openaiService.ts`: Handles OpenAI API integration
- `claudeService.ts`: Handles Anthropic's Claude API integration
- `geminiService.ts`: Handles Google's Gemini API integration

These services provide:
- Token usage tracking
- Cost calculation based on current pricing
- Usage analytics
- API key validation

### Pricing Information

The services include up-to-date pricing information for each provider:

#### OpenAI Pricing
- GPT-4o: $0.005 per 1K input tokens, $0.015 per 1K output tokens
- GPT-4 Turbo: $0.01 per 1K input tokens, $0.03 per 1K output tokens
- GPT-3.5 Turbo: $0.0005 per 1K input tokens, $0.0015 per 1K output tokens

#### Claude Pricing
- Claude 3.5 Sonnet: $0.003 per 1K input tokens, $0.015 per 1K output tokens
- Claude 3 Haiku: $0.00125 per 1K input tokens, $0.00375 per 1K output tokens
- Claude 3 Opus: $0.015 per 1K input tokens, $0.075 per 1K output tokens

#### Gemini Pricing
- Gemini 1.5 Flash: $0.075 per 1M input tokens (≤128K), $0.30 per 1M output tokens (≤128K)
- Gemini 1.5 Pro: $1.25 per 1M input tokens (≤128K), $5.00 per 1M output tokens (≤128K)
- Gemini 2.0 Flash: $0.10 per 1M text input tokens, $0.40 per 1M output tokens

### API Key Management

API keys are stored securely using:
- Local storage only (no remote transmission)
- Encryption with machine-specific keys
- Validation for each provider's key format

### Usage Tracking

The application tracks:
- Token usage (input and output)
- Cost calculation based on current pricing
- Usage trends over time
- Percentage of budget used

## Integration with Dashboard

The dashboard displays:
- Current usage and costs for each provider
- Usage trends
- Cost forecasting
- Budget tracking

## Future Improvements

1. **Real API Integration**: Replace simulated data with real API calls
2. **Detailed Cost Breakdown**: Show costs by model and feature
3. **Budget Alerts**: Add support for budget alerts
4. **Export Data**: Add functionality to export cost data
5. **Historical Analysis**: Provide more detailed historical analysis

## Security Considerations

- API keys are stored locally and encrypted
- No API keys are transmitted to external servers
- Keys are validated to ensure they have the correct format
- The application uses the principle of least privilege

## Usage

To use the AI API cost tracking:

1. Add your API keys in the API Key Settings page
2. The dashboard will automatically display usage and cost data
3. View detailed analytics in the dashboard

## Testing

The implementation includes simulated data for testing purposes. In a production environment, this would be replaced with real API calls to fetch actual usage data.
