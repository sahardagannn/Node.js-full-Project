import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

interface CardItemProps {
  title: string;
  description: string;
  image: string;
}

const CardItem: React.FC<CardItemProps> = ({ title, description, image }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 345, margin: '1rem' }}>
        <CardMedia component="img" height="140" image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardItem;
