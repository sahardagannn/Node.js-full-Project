/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Avatar, Button } from '@mui/material';
import EditProfileForm from '../components/EditProfileForm';

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

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedProfile),
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
            <EditProfileForm
              initialData={profile}
              onSave={handleUpdateProfile}
              onCancel={() => setEditing(false)}
            />
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
