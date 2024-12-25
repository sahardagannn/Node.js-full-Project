/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';

interface CardData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: { url: string; alt: string };
  address: { country: string; city: string; street: string; houseNumber: string };
}

const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/cards', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
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

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      // Remove the deleted card from the state
      setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
      alert('Card deleted successfully');
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchCards();
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
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Cards
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => alert(`View card: ${card._id}`)}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteCard(card._id)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsPage;