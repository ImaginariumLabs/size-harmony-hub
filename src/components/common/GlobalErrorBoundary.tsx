import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert, AlertTitle } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * GlobalErrorBoundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole application.
 * 
 * This is part of the Phase 2 implementation to improve error handling and prevent UI crashes.
 */
class GlobalErrorBoundary extends Component<Props, State> {
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
    console.error('Uncaught error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRefresh = (): void => {
    // Reset the error boundary state and try again
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReportBug = (): void => {
    // Implement bug reporting functionality
    // This could open a modal or redirect to a bug reporting form
    console.log('Report bug:', this.state.error);
    
    // For now, we'll just log the error to the console
    // In a real implementation, this would send the error to a reporting service
    alert('Thank you for reporting this issue. Our team will investigate it.');
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
            bgcolor: 'background.default'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              borderRadius: 2,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Something went wrong</AlertTitle>
              We're sorry, but an error occurred while rendering this component.
            </Alert>

            <Typography variant="h5" gutterBottom>
              Error Details
            </Typography>

            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 200
              }}
            >
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {this.state.error?.toString() || 'Unknown error'}
              </Typography>
              
              {this.state.errorInfo && (
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', mt: 2 }}>
                  {this.state.errorInfo.componentStack}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleRefresh}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<BugReportIcon />}
                onClick={this.handleReportBug}
              >
                Report Bug
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    // Render children if there's no error
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
