import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  Link,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import { isPlatform } from '../utils/platformUtils';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || '/';
  
  // Check if we're in Electron or web mode
  const isWeb = isPlatform.web();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError('Invalid email or password');
      } else {
        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to APIwidget
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          {isWeb && (
            <>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Link href="#" variant="body2" color="primary">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2" color="primary">
                      Don't have an account? Sign up
                    </Link>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  For admin access, use:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Email: admin@example.com
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Password: password
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
