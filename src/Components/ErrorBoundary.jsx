import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth='sm'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 60, color: '#ff6b6b', mb: 2 }}
            />
            <Typography variant='h4' gutterBottom>
              Something went wrong
            </Typography>
            <Typography
              variant='body1'
              sx={{ mb: 3, color: '#bbb' }}
            >
              An unexpected error occurred. Please try refreshing the page.
            </Typography>
            {import.meta.env.DEV && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderRadius: 1,
                  textAlign: 'left',
                  maxWidth: '100%',
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant='caption'
                  sx={{
                    fontFamily: 'monospace',
                    color: '#ff6b6b',
                  }}
                >
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && (
                    <div>{this.state.errorInfo.componentStack}</div>
                  )}
                </Typography>
              </Box>
            )}
            <Button
              variant='contained'
              onClick={this.handleReset}
              color='primary'
            >
              Try Again
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
