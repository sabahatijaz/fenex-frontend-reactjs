import React, { useEffect, useState } from 'react';
import { getQuotations, createQuotation, getProducts, getSites } from '../../api/api';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Style for the parent card
const ParentCard = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 90vw; /* Maximum width for the card */
  margin: 0 auto; /* Center horizontally */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Add shadow */
  background-color: #f9f9f9; /* Background color */
  border-radius: 10px;
  min-height: 80vh; /* Minimum height */
`;

// Header row with space between label and button
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

// Label for quotations
const QuotationsLabel = styled.h2`
  margin: 0;
  color: #3b5998;
`;

// Add New Quote button
const AddQuoteButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #388e3c;
  }
`;

// Wrapper for the quotes
const QuotesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

// Style for individual quote cards
const QuoteCard = styled.div`
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: calc(33.333% - 20px); /* Adjust to fit three items per row */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition on hover */

  /* Hover effect */
  &:hover {
    transform: translateY(-5px); /* Slightly lift the card */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Increase shadow */
  }

  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    width: calc(50% - 20px); /* Two items per row */
  }

  @media (max-width: 480px) {
    width: 100%; /* One item per row */
  }
`;

// Open Quote button within the card
const OpenQuoteButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #3b5998;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2d4373;
  }
`;

// Modal Styles
const modalStyles = {
  content: {
    position: 'relative',
    width: '90vw',
    maxWidth: '600px',
    height: '80vh',
    maxHeight: '600px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    overflow: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f8f9fa;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b5998;
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

Modal.setAppElement('#root');

const QuotesPage = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [products, setProducts] = useState([]);
  const [sites, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({
    product_id: '',
    height: 0,
    width: 0,
    quantity: 1,
    shape: 'A-Flat',
    site_id: '',
  });

  // Function to fetch quotes
  const fetchQuotes = async () => {
    try {
      const data = await getQuotations();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to fetch sites
  const fetchSites = async () => {
    try {
      const data = await getSites();
      setSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  useEffect(() => {
    fetchQuotes();
    fetchProducts();
    fetchSites();
  }, []);

  const handleOpenQuote = (quoteId) => {
    navigate(`/quote/${quoteId}`);
  };

  const handleAddQuote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewQuote({
      product_id: '',
      height: 0,
      width: 0,
      quantity: 1,
      shape: 'A-Flat',
      site_id: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuote({ ...newQuote, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdQuote = await createQuotation(newQuote);
      setQuotes([...quotes, createdQuote]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <ParentCard>
        <HeaderRow>
          <QuotationsLabel>Quotations</QuotationsLabel>
          <AddQuoteButton onClick={handleAddQuote}>Add New Quote</AddQuoteButton>
        </HeaderRow>

        {/* Quotes Section */}
        <QuotesWrapper>
          {quotes.map((quote) => (
            <QuoteCard key={quote.id}>
              <p><strong>Product:</strong> {quote.product.product_name}</p>
              <p><strong>Dimensions:</strong> {quote.height} cm x {quote.width} cm</p>
              <p><strong>Quantity:</strong> {quote.quantity}</p>
              <OpenQuoteButton onClick={() => handleOpenQuote(quote.id)}>Open Quote</OpenQuoteButton>
            </QuoteCard>
          ))}
        </QuotesWrapper>
      </ParentCard>

      {/* Modal for adding new quote */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={modalStyles}
        contentLabel="Add New Quote"
      >
        <h2>Add New Quote</h2>
        <form onSubmit={handleSubmit}>
          <FormContainer>
            
            {/* Dropdown for selecting site */}
            <label htmlFor="site_id">Select Site:</label>
            <Select
              name="site_id"
              value={newQuote.site_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.sitename}
                </option>
              ))}
            </Select>



            {/* Dropdown for selecting product */}
            <label htmlFor="product_id">Select Product:</label>
            <Select
              name="product_id"
              value={newQuote.product_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.product_name}
                </option>
              ))}
            </Select>

            {/* Dropdown for selecting shape */}
            <label htmlFor="shape">Select Shape:</label>
            <Select
              name="shape"
              value={newQuote.shape}
              onChange={handleInputChange}
              required
            >
              <option value="A-Flat">A-Flat</option>
              <option value="B-Shape">B-Shape</option>
              <option value="C-Round">C-Round</option>
            </Select>

            {/* Input for height */}
            <label htmlFor="height">Height (cm):</label>
            <Input
              type="number"
              name="height"
              value={newQuote.height}
              onChange={handleInputChange}
              required
            />

            {/* Input for width */}
            <label htmlFor="width">Width (cm):</label>
            <Input
              type="number"
              name="width"
              value={newQuote.width}
              onChange={handleInputChange}
              required
            />

            {/* Input for quantity */}
            <label htmlFor="quantity">Quantity:</label>
            <Input
              type="number"
              name="quantity"
              value={newQuote.quantity}
              onChange={handleInputChange}
              required
            />
          </FormContainer>
          <SubmitButton type="submit">Submit Quote</SubmitButton>
        </form>
      </Modal>
    </div>
  );
};

export default QuotesPage;
