# AI API Cost Tracking

This document explains how the AI API cost tracking works in APIwidget.

## Overview

APIwidget integrates with three major AI API providers to track usage and costs:

1. **OpenAI** (GPT models)
2. **Anthropic** (Claude models)
3. **Google** (Gemini models)

The implementation provides real-time cost tracking, usage analytics, and secure API key management. All API keys are stored locally on the user's device and are never transmitted to external servers, ensuring maximum security and privacy.

## Implementation Highlights

1. **Real API Integration**: Implemented real API integration for Gemini, with proper token counting and usage tracking
2. **Detailed Usage Statistics**: Added detailed usage statistics including daily usage and model breakdown
3. **Multiple Floating Widgets**: Enhanced support for multiple floating widgets with layout presets
4. **Secure API Key Storage**: Improved the security of API key storage with machine-specific encryption

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

The pricing information is used to calculate costs based on token usage. For Gemini 1.5 models, the pricing is tiered with different rates for base tokens (first 128K) and extended tokens (beyond 128K).

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
- Daily usage statistics
- Model-specific usage breakdown

For Gemini API, we've implemented a comprehensive tracking system that:

- Tracks token usage for each API request
- Calculates costs based on the latest pricing
- Stores daily usage statistics
- Provides model-specific usage breakdown
- Supports multiple models (Gemini 1.5 Flash, Gemini 1.5 Pro, Gemini 2.0 Flash)

#### Detailed Usage Statistics

The application provides detailed usage statistics for each provider:

1. **Daily Usage**: Track usage and costs on a daily basis
2. **Model Breakdown**: See which models are being used and their associated costs
3. **Token Distribution**: Analyze the distribution of input vs. output tokens
4. **Cost Trends**: Visualize cost trends over time
5. **Budget Utilization**: Monitor percentage of budget used

#### Real-time Token Counting

For Gemini API, we've implemented real-time token counting using the API's countTokens endpoint. This provides accurate token counts for cost calculations. If the API call fails, the application falls back to an approximation method (1 token ≈ 4 characters).

## Integration with Dashboard

The dashboard displays:

- Current usage and costs for each provider
- Usage trends
- Cost forecasting
- Budget tracking

## Recent Updates

1. **Real API Integration**: Implemented real API integration for Gemini, with proper token counting and usage tracking
2. **Detailed Usage Statistics**: Added detailed usage statistics including daily usage and model breakdown
3. **Multiple Floating Widgets**: Enhanced support for multiple floating widgets with layout presets

## Future Development

1. **Budget Alerts**: Add support for budget alerts
2. **Export Data**: Add functionality to export cost data
3. **Historical Analysis**: Provide more detailed historical analysis
4. **Additional API Providers**: Add support for more API providers

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
4. Use floating widgets to monitor API usage in real-time
5. Save and restore widget configurations for different monitoring setups

## Multiple Floating Widgets

The application now supports multiple floating widgets with enhanced features:

- Resizable widgets with free resizing (not just predefined sizes)
- Multiple layout options (free, grid, line)
- Widget configuration presets (save and restore widget layouts)
- Improved drag-and-drop functionality

For more details on the multiple floating widgets implementation, see [MULTIPLE_FLOATING_WIDGETS.md](./MULTIPLE_FLOATING_WIDGETS.md).

## API Integration Architecture

The API integration follows a layered architecture:

1. **Provider-specific Services**: Each provider has a dedicated service (openaiService.ts, claudeService.ts, geminiService.ts)
2. **Enhanced API Service**: A unified service that handles caching and error handling (enhancedApiService.ts)
3. **API Integration Service**: A facade that provides a consistent interface for all providers (apiIntegrationService.ts)
4. **Electron Bridge**: Secure communication between the renderer and main processes for API key access

This architecture ensures:

- Separation of concerns
- Code reusability
- Consistent error handling
- Efficient caching
- Secure API key management

## Testing

The implementation includes both real API integration and simulated data for testing purposes:

- Gemini API uses real API calls to validate API keys and count tokens
- For demo purposes, the application simulates some usage data to provide a realistic experience
- In a production environment, all usage would be tracked through actual API calls

## Planned Enhancements

1. **Budget Alerts**: Add support for budget alerts and notifications
2. **Export Data**: Add functionality to export cost data for analysis
3. **Historical Analysis**: Provide more detailed historical analysis tools
4. **Additional API Providers**: Add support for more API providers
5. **Usage Optimization**: Provide recommendations for optimizing API usage and reducing costs
