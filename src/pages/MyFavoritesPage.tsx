/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface CardData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: { url: string; alt: string };
  address: { country: string; city: string; street: string; houseNumber: string };
  likes: string[]; // Array of user IDs
}

const MyFavoritesPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return; // רק משתמש מחובר יכול לראות כרטיסים
    fetchFavorites();
  }, [isLoggedIn]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID is missing in localStorage');
      }
  
      console.log('Current User ID:', userId);
  
      const response = await fetch('http://localhost:5000/api/cards', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to fetch cards');
      }
  
      const data: CardData[] = await response.json();
      console.log('Fetched Cards:', data);
  
      const likedCards = data.filter(
        (card) => card.likes && card.likes.includes(userId)
      );
  
      console.log('Liked Cards:', likedCards);
      setFavorites(likedCards);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6" color="error">
          Please log in to view your favorite cards.
        </Typography>
      </Box>
    );
  }

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

  if (favorites.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6">
          You have no favorite cards yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Favorite Cards
      </Typography>
      <Grid container spacing={2}>
        {favorites.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card._id}>
            <Card>
              <CardMedia
                component="img"
                alt={card.image.alt}
                height="140"
                image={card.image.url || 'https://via.placeholder.com/150'}
              />
              <CardContent>
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {card.subtitle}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`${card.address.street}, ${card.address.city}, ${card.address.country}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyFavoritesPage;
