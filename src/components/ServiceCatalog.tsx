import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockServices } from '../utils/data';
import { Service } from '../types';

const ServiceCatalog: React.FC = () => {
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'duration'>('popular');
  const navigate = useNavigate();

  const sortedServices = [...mockServices].sort((a, b) => {
    if (sortBy === 'popular') {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.duration - b.duration;
    return 0;
  });

  const handleBookNow = (service: Service) => {
    // Store selected service in localStorage or context
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate('/calendar');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Our Services
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            label="Sort by"
          >
            <MenuItem value="popular">Popular</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="duration">Duration</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {sortedServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {service.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.name}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h2">
                    {service.name}
                  </Typography>
                  {service.popular && <Chip label="Popular" color="primary" size="small" />}
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {service.description}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ${service.price} • {service.duration} min
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleBookNow(service)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ServiceCatalog;
