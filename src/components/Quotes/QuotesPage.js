import React, { useEffect, useState } from 'react';
import { getQuotations, createQuotation, getProducts, getSites, getShapes,getWidthByLenght,getLenghtByWidth ,getPossibleLenght,getProductById} from '../../api/api';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UploadCSV from './UploadCSV';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';



const ParentCard = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 90vw; 
  margin: 0 auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9; 
  border-radius: 10px;
  min-height: 80vh; 
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const QuotationsLabel = styled.h2`
  margin: 0;
  color: #3b5998;
`;

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

const QuotesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

const QuoteCard = styled.div`
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: calc(33.333% - 20px); 
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease; 


  &:hover {
    transform: translateY(-5px); 
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); 
  }


  @media (max-width: 768px) {
    width: calc(50% - 20px); 
  }

  @media (max-width: 480px) {
    width: 100%; 
`;


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

const showErrorToast = (message) => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};


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
  const [productId,setProductID] =useState(null)
  const [possibleLenght,setPossibleLenght] = useState()  
  const [isWidthDisabled, setIsWidthDisabled] = useState(true);
  const [isLenghtDisabled,setIsLenghtDisabled] = useState(true)
  const [isShapeDisabled , setIsShapeDisabled] = useState(true)
  const [CSVQuotation,setCSVQuotation] = useState([])
  const [newQuote, setNewQuote] = useState({
    product_id: 0,
    height: 0,
    width: 0,
    quantity: 1,
    shape: 'A-Flat',
    site_id: 0,
    radius: 60,
  });

  const fetchQuotes = async () => {
    try {
      const data = await getQuotations();
      setQuotes(data);
    } catch (error) {
      showErrorToast(`Error fetching Quotes: ${error.message}`);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      showErrorToast(`Error fetching Products: ${error.message}`);
    }
  };

  const fetchSites = async () => {
    try {
      const data = await getSites();
      setSites(data);
    } catch (error) {
      showErrorToast(`Error fetching sites: ${error.message}`);
    }
  };

  const fetchShapes = async () => {
    try {
      const data = await getShapes();
      setShapes(data);
    } catch (error) {
      showErrorToast(`Error fetching shapes: ${error.message}`);
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

  const handleOpenQuote = (quoteId) => {
    navigate(`/quote/${quoteId}`);
  };

  const handleAddQuote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewQuote({
      product_id: 0,
      height: 0,
      width: 0,
      quantity: 1,
      shape: 'A-Flat',
      site_id: 0,
      custom_shape: '',
      radius:60
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  

    
    if (name === 'shape') {
      if (value === 'Shape') {
        setIsShapeSelected(true);
        setIsShapeDisabled(false)
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

  const handleGetWidthByLenghtChange = async (e) => {
    try {
      const value = e.target.value;
      setLengths(value);

      if(value === 'selectlenght'){
        setWidths([])
        setProductID(null)
        setIsWidthDisabled(true);
      }
  
      if (productId) {
        const width = await getWidthByLenght(productId, value);
        setWidths(width);
        setIsWidthDisabled(false);
        
      } else {
        console.error('Error fetching productID');
      }
    } catch (error) {
      console.error('Error fetching width', error);
    }
  };
  
  const handleLenghtByProduct = async(e)=>{
      try{
        const value = e.target.value
        setProductID(value)
        const productlengths = await getPossibleLenght(value)
        setPossibleLenght(productlengths)
        setIsLenghtDisabled(false)

        if(value === 'selectproduct'){
          setProductID(null)
          setIsLenghtDisabled(true)
        }
      }
      catch (error) {
        console.error('Error fetching possible lenghts:', error);
      }
  }

  useEffect(() => {
    fetchQuotes();
    fetchProducts();
    fetchSites();
    handleLenghtByProduct()


  }, []);


  useEffect(() => {
    fetchQuotes();
    fetchProducts();
    fetchSites();

  }, []);
  useEffect(() => {
  setNewQuote((prev) => ({ ...prev, product_id: productId , height : lengths }));
}, [productId,lengths]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdQuote = await createQuotation(newQuote);
      showSuccessToast(`Quotation Data Successfully Submitted`)
      setQuotes([...quotes, createdQuote]);
      handleCloseModal();
    } catch (error) {
      showErrorToast(`Error Create Quotation: ${error.message}`);
    }
  };

  const handleGetQuoatation=(data)=>{
    setCSVQuotation(data)
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <ParentCard>
        <HeaderRow>
          <QuotationsLabel>Quotations</QuotationsLabel>
          <UploadCSV quotationresponse={handleGetQuoatation} /> 
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

          {
            CSVQuotation.map((quote)=>(
              <QuoteCard key={quote.id}>
              <p><strong>Product:</strong> {quote.product.product_name}</p>
              <p><strong>Dimensions:</strong> {quote.height} cm x {quote.width} cm</p>
              <p><strong>Quantity:</strong> {quote.quantity}</p>
              <OpenQuoteButton onClick={() => handleOpenQuote(quote.id)}>Open Quote</OpenQuoteButton>
            </QuoteCard>

            ))
          }
        </QuotesWrapper>
      </ParentCard>

      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={modalStyles}
        contentLabel="Add New Quote"
      >
        <h2>Add New Quote</h2>
        <form onSubmit={handleSubmit}>
          <FormContainer>
            
         
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
              value={productId}
              onChange={handleLenghtByProduct}
              required
            >
              <option value="selectproduct">Select Product</option>
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

                <label htmlFor="custom_shape">Select Custom Shape:</label>
                <Select
                  name="custom_shape"
                  value={newQuote.custom_shape}
                  onChange={handleInputChange}
                  disabled={isShapeDisabled}
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
            
          <label htmlFor="length">Select Height:</label>
          <Select
          required
          disabled={isLenghtDisabled}
           onChange={handleGetWidthByLenghtChange}
            >
           <option value="selectlenght">Select Height</option>
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
            {widths.map((width) => (
            <option key={width} value={width}>
            {width} cm
           </option>
          ))}
          </Select>

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
