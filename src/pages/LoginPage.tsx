/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ייבוא הקונטקסט

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // שימוש בפונקציית login מהקונטקסט
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    // Validation
    if (!email || !password) {
      setError('Email and Password are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      // עדכון מצב התחברות דרך הקונטקסט ושמירת ה-JWT
      login(data.token);

      console.log('Login successful');
      alert('Login successful! Welcome back.');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleInputChange}
        type="email"
      />
      <TextField
        label="Password"
        name="password"
        fullWidth
        margin="normal"
        value={formData.password}
        onChange={handleInputChange}
        type="password"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
        sx={{ marginTop: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
        Don't have an account? <a href="/register">Register</a>
      </Typography>
    </Box>
  );
};

export default LoginPage;
