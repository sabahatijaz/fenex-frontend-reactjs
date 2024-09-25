// src/components/Layout/Card.js
import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px; /* Slightly more rounded corners for a softer look */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 20px;
  padding: 20px;
  width: 320px; /* Increased width for more content */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative; /* Allows for absolute positioning of elements inside */
  cursor: pointer; /* Indicate it's clickable */

  &:hover {
    transform: translateY(-10px); /* More noticeable elevation on hover */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Enhanced shadow effect */
  }

  /* Optional: Add a subtle gradient to the background */
  background: linear-gradient(135deg, #ffffff, #f9f9f9);

  /* Optional: Adding a border for a clean and defined look */
  border: 1px solid #e0e0e0;

  /* Optional: Add a slight opacity change on hover for depth */
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    opacity: 0.95;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 90%; /* Adjust width for smaller screens */
    margin: 10px auto; /* Center the card on smaller screens */
  }
`;


const Card = ({ children }) => {
  return <CardContainer>{children}</CardContainer>;
};

export default Card;
