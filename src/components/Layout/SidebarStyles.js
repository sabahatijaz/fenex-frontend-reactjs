import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh; /* Ensure full height */
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  color: white;
  padding: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  position: relative; /* Use relative positioning */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto; /* Enable scrolling if content exceeds the height */
  border-radius: 0 15px 15px 0;
`;

export const Logo = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #ecf0f1;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 10px 0;
  font-weight: bold;
  padding: 12px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    background-color: #3b5998;
    color: #ecf0f1;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease;
    transform: scaleX(0);
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

export const Footer = styled.footer`
  text-align: center;
  font-size: 14px;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: #bdc3c7;
  margin-top: 20px;
`;
