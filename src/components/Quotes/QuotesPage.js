import React, { useEffect, useState } from 'react';
import { getQuotations, createQuotation, getProducts, getSites, getShapes,getWidthByLenght,getLenghtByWidth ,getPossibleLenght } from '../../api/api';
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
  const [shapes, setShapes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShapeSelected, setIsShapeSelected] = useState(false);
  const [lengths, setLengths] = useState([]); 
  const [widths, setWidths] = useState([]); 
  const [heights, setHeights] = useState([]); 
  const [possibleLenght,setPossibleLenght] = useState()
  const [isWidthDisabled, setIsWidthDisabled] = useState(true);
  const [newQuote, setNewQuote] = useState({
    product_id: '',
    height: 0,
    width: '',
    quantity: 1,
    shape: 'A-Flat',
    site_id: '',
    radius: 60,
  });


  


  const fetchPossibleLenght = async ()=>{
    try{
      const data = await getPossibleLenght()
      setPossibleLenght(data)
     
      
    } catch (error) {
      console.error('Error fetching possible lenght:', error);
    }
  }

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

  // Function to fetch shapes (when "Shape" is selected)
  const fetchShapes = async () => {
    try {
      const data = await getShapes();
      setShapes(data);
    } catch (error) {
      console.error('Error fetching shapes:', error);
    }
  };

  


  const fetchHeights = async (length) => {
    let data;
    if (length === '100') {
      data = ['30', '40']; 
    } else if (length === '200') {
      data = ['50', '60']; 
    } else if (length === '300') {
      data = ['70', '80']; 
    }
    setHeights(data);
  };

  useEffect(() => {
    fetchQuotes();
    fetchProducts();
    fetchSites();
    fetchPossibleLenght()
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
      custom_shape: '',
      radius:60
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    
    if (name === 'shape') {
      if (value === 'Shape') {
        setIsShapeSelected(true);
        fetchShapes(); 
      } else {
        setIsShapeSelected(false); 
      }
    }


  
    
    setNewQuote({ ...newQuote, [name]: value });
  
 
    if (name === 'custom_shape') {
      setIsShapeSelected(true);
    }

  
  };

  const handleGetWidthByLenghtChange = async (e)=>{
    try{
      const value=e.target.value
      setLengths(value)
      if(value==='selectlenght'){
        setIsWidthDisabled(true)
        setWidths([])
        
        
      }
      
      const width = await getWidthByLenght(value) 
      setWidths(width)
      setIsWidthDisabled(false); 
      
      
    }
    catch (error) {
      console.error('Error fetching width:', error);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(newQuote)
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

            
            <label htmlFor="shape">Select Design:</label>
            <Select
              name="shape"
              value={newQuote.shape}
              onChange={handleInputChange}
              required
            >
              <option value="Flat">Flat</option>
              <option value="Shape">Shape</option>
              <option value="Round">Round</option>
            </Select>

            {/* Conditional rendering: Show custom shape dropdown if "Shape" is selected */}
            {isShapeSelected && (
              <>
                <label htmlFor="custom_shape">Select Custom Shape:</label>
                <Select
                  name="custom_shape"
                  value={newQuote.custom_shape}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Shape</option>
                  {shapes.map((shape) => (
                    <option key={shape} value={shape}>
                      {shape}
                    </option>
                  ))}
                </Select>

               
                <label htmlFor="shape_radius">Shape Radius (cm):</label>
                <Input
                  type="number"
                  name="radius"
                  value={newQuote.radius}
                  onChange={handleInputChange}
                  min="60"
                  required
                />
              </>
            )}

    


          <label htmlFor="length">Select Length:</label>
          <Select
          required
           onChange={handleGetWidthByLenghtChange}
            >
           <option value="selectlenght">Select Length</option>
          {Array.isArray(possibleLenght) && possibleLenght.map((length) => (
           <option key={length} value={length}>
             {length} cm
           </option>
            ))}
          </Select>
        

          <label htmlFor="lenght">Select Width:</label>
          <Select
           name="width"
           value={newQuote.width}
           onChange={handleInputChange}
           disabled={isWidthDisabled} 
           required
         
           >
          <option value="">Select Width</option>
        vvv {widths.map((width) => (
           <option key={width} value={width}>
            {width} cm
           </option>
          ))}
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
