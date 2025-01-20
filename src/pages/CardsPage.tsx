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
  Dialog,
  DialogTitle,
  DialogContent,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateCardForm from '../components/CreateCardForm';

interface CardFormData {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  image: { url: string; alt: string };
  address: { state: string; country: string; city: string; street: string; houseNumber: string; zip: string };
}

interface CardData extends CardFormData {
  _id: string;
}

const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editCard, setEditCard] = useState<CardData | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/cards/my-cards', {
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

  const handleCreateCard = async (card: CardFormData) => {
    try {
      const response = await fetch('http://localhost:5000/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(card),
      });

      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      const newCard = await response.json();
      setCards((prevCards) => [...prevCards, newCard]);
      setShowDialog(false);
      alert('Card created successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditCard = async (updatedCard: CardData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cards/${updatedCard._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedCard),
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      const updatedData = await response.json();
      setCards((prevCards) =>
        prevCards.map((card) => (card._id === updatedData._id ? updatedData : card))
      );
      setEditCard(null);
      alert('Card updated successfully!');
    } catch (err: any) {
      alert(err.message);
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
                <Button variant="contained" color="primary" onClick={() => setEditCard(card)}>
                  Edit
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDeleteCard(card._id)}>
                  Delete
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowDialog(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Create New Card</DialogTitle>
        <DialogContent>
          <CreateCardForm onCreate={(card) => handleCreateCard(card as CardFormData)} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!editCard} onClose={() => setEditCard(null)}>
        <DialogTitle>Edit Card</DialogTitle>
        <DialogContent>
          {editCard && (
            <CreateCardForm
              initialData={editCard}
              onCreate={(updatedCard) => handleEditCard(updatedCard as CardData)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CardsPage;
