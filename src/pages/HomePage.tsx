/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CardData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: { url: string; alt: string };
  address: { country: string; city: string; street: string; houseNumber: string };
  likes: string[]; // Array of user IDs
}

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return; // רק משתמש מחובר יכול לראות כרטיסים
    fetchCards();
  }, [isLoggedIn]);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/cards', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to fetch cards');
      }

      const data = await response.json();
      setCards(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (cardId: string) => {
    try {
      console.log(`Sending like request for card: ${cardId}`); // לוג לזיהוי קריאה
  
      const response = await fetch(`http://localhost:5000/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error Response:', errorResponse); // לוג לשגיאה
        throw new Error(errorResponse.message || 'Failed to like card');
      }
  
      const updatedCard = await response.json();
      console.log('Updated Card:', updatedCard); // לוג לכרטיס המעודכן
  
      // עדכון הכרטיסים במצב המקומי
      setCards((prevCards) =>
        prevCards.map((card) => (card._id === updatedCard._id ? updatedCard : card))
      );
    } catch (err: any) {
      console.error('Error:', err.message); // לוג לשגיאה
      alert(err.message);
    }
  };
  

  const handleView = (cardId: string) => {
    navigate(`/cards/${cardId}`); // מעבר לדף פרטי כרטיס
  };

  if (!isLoggedIn) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6" color="error">
          Please log in to view the cards.
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        All Cards
      </Typography>
      <Grid container spacing={2}>
        {cards.map((card) => (
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleView(card._id)}
                >
                  View
                </Button>
                <Button
  variant="text"
  color="secondary"
  onClick={() => handleLike(card._id)}
  startIcon={
    card.likes.includes(localStorage.getItem('userId') || '') ? (
      <FavoriteIcon />
    ) : (
      <FavoriteBorderIcon />
    )
  }
>
  {card.likes.includes(localStorage.getItem('userId') || '') ? 'Unlike' : 'Like'}
</Button>

              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
