import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout'; // Import the Layout component
import GlobalStyle from './globalStyles'; // Import global styles
import AppRoutes from './routes'; // Import the routes

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
};

export default App;
