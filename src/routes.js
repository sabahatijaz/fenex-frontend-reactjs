// src/routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import SitesPage from './components/Sites/SitesPage';
import SiteDetailsPage from './components/Sites/SiteDetailsPage';
import QuotesPage from './components/Quotes/QuotesPage';
import QuoteDetailsPage from './components/Quotes/QuoteDetailsPage';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ProfilePage from './components/Profile/ProfilePage';
import Canvas from './components/Canvas/CanvasPage'


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/sites" element={<SitesPage />} />
    <Route path="/site/:siteId" element={<SiteDetailsPage />} />
    <Route path="/quote/:quoteId" element={<QuoteDetailsPage />} />
    <Route path="/quotes" element={<QuotesPage />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/canvas" element={<Canvas />}  />
    
    
  </Routes>
);

export default AppRoutes;
