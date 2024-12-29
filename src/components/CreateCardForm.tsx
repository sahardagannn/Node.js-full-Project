import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

interface Card {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  image: { url: string; alt: string };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
  };
}

interface CardFormProps {
  onCreate: (card: Card) => void;
}

const CreateCardForm: React.FC<CardFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState<Card>({
    title: '',
    subtitle: '',
    description: '',
    phone: '',
    email: '',
    web: '',
    image: { url: '', alt: '' },
    address: { state: '', country: '', city: '', street: '', houseNumber: '', zip: '' },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create New Card
      </Typography>
      <TextField label="Title" name="title" fullWidth margin="normal" value={formData.title} onChange={handleInputChange} />
      <TextField label="Subtitle" name="subtitle" fullWidth margin="normal" value={formData.subtitle} onChange={handleInputChange} />
      <TextField label="Description" name="description" fullWidth margin="normal" value={formData.description} onChange={handleInputChange} />
      <TextField label="Phone" name="phone" fullWidth margin="normal" value={formData.phone} onChange={handleInputChange} />
      <TextField label="Email" name="email" fullWidth margin="normal" value={formData.email} onChange={handleInputChange} />
      <TextField label="Website" name="web" fullWidth margin="normal" value={formData.web} onChange={handleInputChange} />
      <TextField label="Image URL" name="image.url" fullWidth margin="normal" value={formData.image.url} onChange={handleInputChange} />
      <TextField label="Image Alt" name="image.alt" fullWidth margin="normal" value={formData.image.alt} onChange={handleInputChange} />
      <TextField label="State" name="address.state" fullWidth margin="normal" value={formData.address.state} onChange={handleInputChange} />
      <TextField label="Country" name="address.country" fullWidth margin="normal" value={formData.address.country} onChange={handleInputChange} />
      <TextField label="City" name="address.city" fullWidth margin="normal" value={formData.address.city} onChange={handleInputChange} />
      <TextField label="Street" name="address.street" fullWidth margin="normal" value={formData.address.street} onChange={handleInputChange} />
      <TextField label="House Number" name="address.houseNumber" fullWidth margin="normal" value={formData.address.houseNumber} onChange={handleInputChange} />
      <TextField label="Zip" name="address.zip" fullWidth margin="normal" value={formData.address.zip} onChange={handleInputChange} />
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
        Create Card
      </Button>
    </Box>
  );
};

export default CreateCardForm;
