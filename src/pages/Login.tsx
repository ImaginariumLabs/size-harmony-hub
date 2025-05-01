import React, { useState } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  TextField,
  Button,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        console.log('Attempting to sign up with:', email);
        const { error } = await signUp(email, password);
        if (error) {
          console.error('Sign up error:', error);
          throw error;
        }
        // Show success message and switch to sign in
        setIsSignUp(false);
        setError('Account created! You can now sign in.');
      } else {
        console.log('Attempting to sign in with:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Sign in error:', error);
          throw error;
        }
        navigate('/');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            APIwidget
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isSignUp ? 'Create a new account' : 'Sign in to your account'}
          </Typography>
        </Box>

        {error && (
          <Alert severity={error.includes('created') ? 'success' : 'error'} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isSignUp ? (
              'Sign Up'
            ) : (
              'Sign In'
            )}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
            </Link>
            <Link
              component={RouterLink}
              to="/reset-password"
              variant="body2"
            >
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
