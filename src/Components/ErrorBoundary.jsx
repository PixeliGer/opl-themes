import { useTheme } from '@mui/material/styles';
import { ErrorBoundary } from 'react-error-boundary';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';

function ErrorFallback({ error, resetErrorBoundary }) {
  const theme = useTheme();
  const palette = theme.custom;

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
          color: palette.text.primary,
        }}
      >
        <ErrorOutlinedIcon sx={{ fontSize: 60, color: palette.error.main, mb: 2 }} />
        <Typography variant='h4' gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant='body1' sx={{ mb: 3, color: palette.text.secondary }}>
          An unexpected error occurred. Please try refreshing the page.
        </Typography>
        {import.meta.env.DEV && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: palette.error.bg,
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
                color: palette.error.main,
                display: 'block',
                whiteSpace: 'pre-wrap',
              }}
            >
              {error?.stack || error?.toString()}
            </Typography>
          </Box>
        )}
        <Button
          variant='contained'
          onClick={resetErrorBoundary}
          color='primary'
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Error caught by boundary:', error, info?.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
