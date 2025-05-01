import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import ComponentTest from '../test/ComponentTest';

const TestPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          APIwidget Timeout Protection Tests
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            About These Tests
          </Typography>
          <Typography paragraph>
            This page contains tests to verify that our timeout protection improvements
            are working correctly. The tests simulate slow API calls that should trigger
            our timeout protection mechanisms.
          </Typography>
          <Typography paragraph>
            If the tests are successful, you should see fallback data being used instead
            of endless loading states.
          </Typography>
        </Paper>
        
        <ComponentTest />
      </Box>
    </Container>
  );
};

export default TestPage;
