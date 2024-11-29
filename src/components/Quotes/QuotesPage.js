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
  overflow: hidden;

  &:hover {
    transform: translateY(-5px); 
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); 
  }

 @media (max-width: 1068px) {
    width: calc(50% - 20px); 
    padding: 10px; 
  }

  @media (max-width: 768px) {
    width: calc(100% - 20px); 
    padding: 8px; 
  }

  @media (max-width: 480px) {
    width: 100%; 
    padding: 8px; 
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1); 
  }
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

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #888;
  }
`;

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
`;

const ImageItem = styled.div`
  position: relative;
  width: calc(33.33% - 10px); /* Keeps three items per row */
  padding-top: 40%; /* Further reduce the height by lowering the percentage */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${(props) => (props.isSelected ? '0 4px 12px rgba(0, 123, 255, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.2)')};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.7);
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensures the image fully covers the container */
    border-radius: 8px;
    transition: opacity 0.3s ease-in-out;
  }

  .image-name {
    position: absolute;
    bottom: 5px;
    left: 5px;
    right: 5px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    background-color: rgba(0, 0, 0, 0.6);
    padding: 5px;
    text-align: center;
    border-radius: 4px;
  }

  ${(props) =>
    props.isSelected &&
    `
      border: 3px solid #007bff;
      opacity: 0.7;
    `}
`;



const NextButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05); /* Slight zoom effect on hover */
  }

  &:active {
    background-color: #004085;
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
  const [currentStep, setCurrentStep] = useState(1);
  const [possibleLenght,setPossibleLenght] = useState()  
  const [isWidthDisabled, setIsWidthDisabled] = useState(true);
  const [isLenghtDisabled,setIsLenghtDisabled] = useState(true)
  const [isShapeDisabled , setIsShapeDisabled] = useState(true)
  const [CSVQuotation,setCSVQuotation] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [newQuote, setNewQuote] = useState({
    product_id: 0,
    height: 0,
    width: 0,
    quantity: 1,
    shape: 'A-Flat',
    site_id: 0,
    radius: 60,
  });

  const images =[ 
    {id:4,src:'/images/image5.jpeg', name: 'Oversize windows ' },
    {id:6 , src :'/images/image2.jpeg',name: 'Solarium'  },
    {id :3 , src :'/images/image3.jpeg',name: 'Fire windows' },
    {id:7 ,src : '/images/image4.jpeg',name: 'Flood Wall'  },
    {id:5 ,src : '/images/image1.jpeg',name: 'Walkable Skylight' },
    {id:2 ,src : '/images/image6.jpeg',name: 'Flood windows' },
  ]


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

  const handleImageSelect = async (image) => {
    try {
      setSelectedImage(image); 
      const productLengths = await getPossibleLenght(image.id); 
      setPossibleLenght(productLengths); 
      setProductID(image.id);
      setIsLenghtDisabled(false); 
    } catch (error) {
      console.error('Error fetching possible lengths:', error);
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
    setSelectedImage(null);
    setIsLenghtDisabled(true);
    setIsWidthDisabled(true);
    setCurrentStep(1)
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
  
  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    fetchQuotes();
    fetchProducts();
    fetchSites();


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

  const handleNextStep = () => {
    if (selectedImage) {
      setCurrentStep(2); 
    } else {
      alert('Please select an image first!');
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
      
        <QuotesWrapper>
          {quotes.map((quote) => (
            <QuoteCard key={quote.id}>
              <p><strong>Product:</strong> {quote.product.product_name}</p>
              <p><strong>Dimensions:</strong> {quote.height} cm x {quote.width} cm</p>
              <p><strong>Quantity:</strong> {quote.quantity}</p>
              <p><strong>Created At:</strong> {
                new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Karachi',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                }).format(new Date(quote.created_at)) || 'No Created'
               }</p>
            {quote.updated_at ? (
            <p><strong>Updated At:</strong> {
             new Intl.DateTimeFormat('en-US', {
             timeZone: 'Asia/Karachi',
             year: 'numeric',
             month: 'long',
             day: '2-digit',
             hour: '2-digit',
             minute: '2-digit',
             second: '2-digit',
             hour12: true,
             }).format(new Date(quote.updated_at))
            }</p>
           ) : null}
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
          {currentStep === 1 && (
          <>
           <FormContainer >

           <h3>Select an Image:</h3>
            <ImageGrid>
    {images.map((image) => (
      <ImageItem
        key={image.id}
        isSelected={selectedImage?.id === image.id}
        onClick={() => handleImageSelect(image)}
      >
        <img src={image.src} alt={`Image ${image.id}`} />
        <div className="image-name">{image.name}</div> 
      </ImageItem>
    ))}
  </ImageGrid>
  <NextButton onClick={handleNextStep}>Next</NextButton>
           </FormContainer>

     
          </>
        )}
          {  currentStep === 2 && (
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
<SubmitButton type="submit">Submit Quote</SubmitButton>
<BackButton onClick={handleBackStep}>Back</BackButton>
</FormContainer>


</form>
          ) }
      </Modal>
    </div>
  );
};
export default QuotesPage;
