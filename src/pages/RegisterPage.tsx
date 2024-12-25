/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: {
      first: '',
      middle: '',
      last: '',
    },
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      country: '',
      city: '',
      street: '',
      houseNumber: '',
      zip: '',
    },
    image: {
      url: '',
      alt: 'Business card image',
    },
    isBusiness: false, // ברירת מחדל למשתמש לא עסקי
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name in formData.name) {
      setFormData({
        ...formData,
        name: { ...formData.name, [name]: value },
      });
    } else if (name in formData.address) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else if (name === 'imageUrl') {
      setFormData({
        ...formData,
        image: { ...formData.image, url: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async () => {
    const { name, phone, email, password, confirmPassword, address, image, isBusiness } = formData;

    // Validation
    if (!name.first || !name.last || !email || !password || !confirmPassword || !phone || !image.url) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password, address, image, isBusiness }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Registration failed');
      }

      // On successful registration
      console.log('Registration successful');
      alert('Registration successful!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <TextField
        label="First Name"
        name="first"
        fullWidth
        margin="normal"
        value={formData.name.first}
        onChange={handleInputChange}
      />
      <TextField
        label="Middle Name"
        name="middle"
        fullWidth
        margin="normal"
        value={formData.name.middle}
        onChange={handleInputChange}
      />
      <TextField
        label="Last Name"
        name="last"
        fullWidth
        margin="normal"
        value={formData.name.last}
        onChange={handleInputChange}
      />
      <TextField
        label="Phone"
        name="phone"
        fullWidth
        margin="normal"
        value={formData.phone}
        onChange={handleInputChange}
      />
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
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        fullWidth
        margin="normal"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        type="password"
      />
      <TextField
        label="Country"
        name="country"
        fullWidth
        margin="normal"
        value={formData.address.country}
        onChange={handleInputChange}
      />
      <TextField
        label="City"
        name="city"
        fullWidth
        margin="normal"
        value={formData.address.city}
        onChange={handleInputChange}
      />
      <TextField
        label="Street"
        name="street"
        fullWidth
        margin="normal"
        value={formData.address.street}
        onChange={handleInputChange}
      />
      <TextField
        label="House Number"
        name="houseNumber"
        fullWidth
        margin="normal"
        value={formData.address.houseNumber}
        onChange={handleInputChange}
      />
      <TextField
        label="ZIP"
        name="zip"
        fullWidth
        margin="normal"
        value={formData.address.zip}
        onChange={handleInputChange}
      />
      <TextField
        label="Image URL"
        name="imageUrl"
        fullWidth
        margin="normal"
        value={formData.image.url}
        onChange={handleInputChange}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="isBusiness"
            checked={formData.isBusiness}
            onChange={handleInputChange}
          />
        }
        label="Register as Business"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleRegister}
        disabled={loading}
        sx={{ marginTop: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
      <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
