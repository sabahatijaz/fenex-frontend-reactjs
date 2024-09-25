// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const metrics = [
  { title: 'Total Sites', value: 120 },
  { title: 'Total Quotes', value: 345 },
  { title: 'Total Closed Quotes', value: 210 },
  // Add more metrics as needed
];

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: theme.shape.borderRadius * 2, // Makes corners rounder
  backgroundColor: theme.palette.grey[200], // Light grey background color
  color: theme.palette.text.primary, // Ensures text is readable
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4), // Adds space below the title
  fontWeight: 'bold', // Makes the title bold
  color: theme.palette.primary.main, // Sets the color to the primary theme color
  textAlign: 'center', // Centers the text
}));

const Dashboard = () => (
  <Container>
    <Title variant="h4">
      Welcome to the FENEX Quotation System
    </Title>
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {metric.title}
              </Typography>
              <Typography variant="h4">
                {metric.value}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default Dashboard;
