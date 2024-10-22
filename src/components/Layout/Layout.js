import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar'; 
import { Link } from 'react-router-dom';

// Styled components for the layout
const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
  overflow-y: auto;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  color: white;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  margin: 0 10px;
 
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
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (image) => {
    setUploadedImage(image); 
  };

  return (
    <LayoutContainer>
      <Sidebar onImageUpload={handleImageUpload} /> 
      <ContentContainer>
        <Navbar>
          <h1>FENEX</h1>
          <NavLinks>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
            
          </NavLinks>
        </Navbar>
        <div style={{ flexGrow: 1,
          
          overflowY: 'auto' 
          }}>
          
          {React.Children.map(children, child => 
            React.isValidElement(child) 
              ? React.cloneElement(child, { uploadedImage }) 
              : child
          )}
        </div>
      </ContentContainer>
    </LayoutContainer>
  );
};

export default Layout;
