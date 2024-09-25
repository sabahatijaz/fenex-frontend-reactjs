import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar'; 
import { Link } from 'react-router-dom';

// Styled components for the layout
const LayoutContainer = styled.div`
  display: flex;
  height: 100vh; /* Ensure the layout takes full viewport height */
  font-family: Arial, sans-serif;
`;

const ContentContainer = styled.div`
  flex: 1; /* This allows it to fill the remaining space */
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4; /* Light background for contrast */
  overflow-y: auto; /* Allow scrolling for content */
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  color: white;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Enhanced shadow for depth */
  border-radius: 10px; /* Rounded corners */
  border-bottom: 1px solid rgba(0, 0, 0, 0.3); /* More pronounced border */
  margin: 0 10px; /* Margin to create space from the edges of the page */

  position: relative; /* Ensure positioning context */
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 12px; /* Match or exceed the border-radius */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.1));
    z-index: -1;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <ContentContainer>
        <Navbar>
          <h1>FENEX</h1>
          <NavLinks>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </NavLinks>
        </Navbar>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}> {/* Ensure content is scrollable */}
          {children}
        </div>
      </ContentContainer>
    </LayoutContainer>
  );
};

export default Layout;
