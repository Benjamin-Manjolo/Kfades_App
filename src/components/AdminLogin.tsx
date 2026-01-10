import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication - in real app, this would be API call
    if (phone === '1234567890' && pin === '1234') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid phone number or PIN');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          Demo: Use phone 1234567890 and PIN 1234
        </Typography>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
