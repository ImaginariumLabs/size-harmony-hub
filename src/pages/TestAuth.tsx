import React, { useEffect, useState } from 'react';
import { Box, Alert, Container, List, ListItem, ListItemText, Typography, Paper, Button, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../services/supabaseClient';

const TestAuth: React.FC = () => {
  const { user, signOut } = useAuth();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
      } else {
        setSessionInfo(data.session);
      }
    };

    getSession();
  }, []);

  const handleTestPrivateApi = async () => {
    try {
      // This is a test endpoint that requires authentication
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        setTestResult(`Error: ${error.message}`);
      } else {
        setTestResult(`Success! Retrieved profile data: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setTestResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Authentication Test Page
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>

          {user ? (
            <Box>
              <List>
                <ListItem>
                  <ListItemText primary="User ID" secondary={user.id} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email Verified"
                    secondary={user.email_confirmed_at ? 'Yes' : 'No'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Sign In"
                    secondary={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                  />
                </ListItem>
              </List>

              <Button
                variant="contained"
                color="primary"
                onClick={handleTestPrivateApi}
                sx={{ mt: 2 }}
              >
                Test Private API Access
              </Button>

              {testResult && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Test Result:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {testResult}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Button
                variant="outlined"
                color="error"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </Box>
          ) : (
            <Alert severity="info">
              Not authenticated. Please sign in to see user information.
            </Alert>
          )}
        </Paper>

        {sessionInfo && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Session Information
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(sessionInfo, null, 2)}
              </Typography>
            </Paper>
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default TestAuth;
