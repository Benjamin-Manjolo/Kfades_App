import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/services');
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Just enter your name & phone to book
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Welcome;
