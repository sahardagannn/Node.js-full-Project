/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';

interface UserProfile {
  name: { first: string; middle?: string; last: string };
  email: string;
  phone: string;
  address: {
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip?: string;
  };
  image: { url: string; alt: string };
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setEditing(false);
      alert('Profile updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const { name, value } = e.target;

    if (name in profile.address) {
      setProfile({
        ...profile,
        address: { ...profile.address, [name]: value },
      });
    } else if (name in profile.name) {
      setProfile({
        ...profile,
        name: { ...profile.name, [name]: value },
      });
    } else if (name === 'alt') {
      setProfile({ ...profile, image: { ...profile.image, alt: value } });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {profile && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Avatar
              src={profile.image.url}
              alt={profile.image.alt || 'Profile Picture'}
              sx={{ width: 100, height: 100 }}
            />
          </Box>
          {editing ? (
            <>
              <TextField
                label="First Name"
                name="first"
                fullWidth
                margin="normal"
                value={profile.name.first}
                onChange={handleInputChange}
              />
              <TextField
                label="Middle Name"
                name="middle"
                fullWidth
                margin="normal"
                value={profile.name.middle || ''}
                onChange={handleInputChange}
              />
              <TextField
                label="Last Name"
                name="last"
                fullWidth
                margin="normal"
                value={profile.name.last}
                onChange={handleInputChange}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                value={profile.email}
                onChange={handleInputChange}
                type="email"
              />
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                margin="normal"
                value={profile.phone}
                onChange={handleInputChange}
              />
              <TextField
                label="Country"
                name="country"
                fullWidth
                margin="normal"
                value={profile.address.country}
                onChange={handleInputChange}
              />
              <TextField
                label="City"
                name="city"
                fullWidth
                margin="normal"
                value={profile.address.city}
                onChange={handleInputChange}
              />
              <TextField
                label="Street"
                name="street"
                fullWidth
                margin="normal"
                value={profile.address.street}
                onChange={handleInputChange}
              />
              <TextField
                label="House Number"
                name="houseNumber"
                fullWidth
                margin="normal"
                value={profile.address.houseNumber}
                onChange={handleInputChange}
              />
              <TextField
                label="Image URL"
                name="url"
                fullWidth
                margin="normal"
                value={profile.image.url}
                onChange={(e) =>
                  setProfile({ ...profile, image: { ...profile.image, url: e.target.value } })
                }
              />
              <TextField
                label="Alt Text"
                name="alt"
                fullWidth
                margin="normal"
                value={profile.image.alt}
                onChange={handleInputChange}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1">
                Name: {profile.name.first} {profile.name.middle || ''} {profile.name.last}
              </Typography>
              <Typography variant="body1">Email: {profile.email}</Typography>
              <Typography variant="body1">Phone: {profile.phone}</Typography>
              <Typography variant="body1">
                Address: {profile.address.street}, {profile.address.city}, {profile.address.country}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ProfilePage;
