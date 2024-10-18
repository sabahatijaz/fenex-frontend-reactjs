import React from 'react';
import { SidebarContainer, Logo, Nav, NavLink, Footer } from './SidebarStyles';

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>FENEX</Logo>
      <Nav>
        <NavLink to="/">Dashoboard</NavLink>
        <NavLink to="/sites">Sites</NavLink>
        <NavLink to="/quotes">Quotes</NavLink>
        <NavLink to="/canvas">Canvas</NavLink>
       
        
      </Nav>
      <Footer>
        <p>&copy; 2024 FENEX</p>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;
