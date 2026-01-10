import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

const BarberInspo: React.FC = () => {
  const images = [
    '0f89c8e73a91bda7d29787e82d8653a5.jpg',
    '1cbaa2dfe955cf7157b9eae69e0f20b0.jpg',
    '2a815864b47f54c0a7b7be092f07bc84.jpg',
    '3a304c45d267701b7464bb876ffd8f63.jpg',
    '3deaadf5bdb86a5301c412bac72c1db0.jpg',
    '015ccfea1bb5f92cd474a27a6047913d.jpg',
    '020a6909a72d5fefc40e64311213105e.jpg',
    '39cc9ca1e11fa627a10cc4a6cbbf472d.jpg',
    '335f9e17922cf54b743791aa749ba30a.jpg',
    '892b55ce910c23c780e7c521ca7ccc0d.jpg',
    '917e814a8d8b5ae825e51feeecb0da52.jpg',
    '960b51f96853c6b7151693712f809d12.jpg',
    '1143c70484bb2dc18a333fd82aa88086.jpg',
    '5362ab09d4590be3820a11da519cd2b1.jpg',
    '52443f55d6950f490256c6332417fc5f.jpg',
    '3457063081123eaffeceeb4961b55875.jpg',
    'Beautiful hair cut style.jpg',
    'bland.jpg',
    'c81668c55b7c376eab6d37d3d6097386.jpg',
    'd4508df2339452d175dd714a3cfba41d.jpg',
    'e0a2a2ebb19ac73485cec0fb08324f13.jpg',
    'e7700318a64e56b77a6e81d87664b160.jpg',
    'ee6fefd7446e8fb98150c49d683a836f.jpg',
    'fdf09453acf5e3753c2b816a22063bec.jpg',
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Barber Inspiration
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`/Barber Inspo/${image}`}
                alt={`Haircut ${index + 1}`}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Haircut Inspiration {index + 1}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BarberInspo;
