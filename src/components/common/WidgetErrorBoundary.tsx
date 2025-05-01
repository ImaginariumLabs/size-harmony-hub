import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  children: ReactNode;
  widgetId: string;
  onError?: (widgetId: string, error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * WidgetErrorBoundary component that catches JavaScript errors in individual widgets,
 * preventing the entire dashboard from crashing when a single widget fails.
 */
class WidgetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error(`Widget error (ID: ${this.props.widgetId}):`, error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(this.props.widgetId, error);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = (): void => {
    // Reset the error boundary state and try again
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI for widget errors
      return (
        <Card sx={{ 
          height: '100%', 
          bgcolor: 'rgba(30, 30, 30, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
        }}>
          <CardContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            p: 2
          }}>
            <ErrorIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="body2" align="center" gutterBottom>
              This widget encountered an error
            </Typography>
            <Box sx={{ mt: 2, maxHeight: 60, overflow: 'auto', width: '100%', mb: 2 }}>
              <Typography variant="caption" component="pre" sx={{ 
                fontFamily: 'monospace', 
                whiteSpace: 'pre-wrap',
                fontSize: '0.7rem',
                color: 'text.secondary',
                textAlign: 'center'
              }}>
                {this.state.error?.message || 'Unknown error'}
              </Typography>
            </Box>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={this.handleRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Render children if there's no error
    return this.props.children;
  }
}

export default WidgetErrorBoundary;
