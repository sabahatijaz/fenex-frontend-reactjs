import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSiteById, getQuotationsBySiteId, createQuotation, getProducts,getQuotations,getPossibleLenght, getSites, getShapes,getWidthByLenght } from '../../api/api';
import styled from 'styled-components';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #3b5998;
`;

const Detail = styled.p`
  font-size: 18px;
`;

const QuotationList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const QuotationItem = styled.li`
  margin: 10px 0;
  padding: 10px;
  background: #f4f4f4;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #3b5998;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #2a4373;
  }
`;

const NoQuotationsMessage = styled.p`
  font-size: 18px;
  color: #ff0000;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddQuoteButton = styled(Button)`
  background-color: #4caf50;
  &:hover {
    background-color: #388e3c;
  }
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

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

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


const SiteDetailsPage = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [sites, setSites] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShapeSelected, setIsShapeSelected] = useState(false);
  const [lengths, setLengths] = useState([]); 
  const [widths, setWidths] = useState([]); 
  // const [heights, setHeights] = useState([]); 
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

  // Unit prices (move this outside the component if they are constants)
  const unitPrices = {
    GlassGeneralSpecBigMacClear: 90.0,
    ShippingFromGlassSupplier: 9.0,
    AluminumFrameAveragePrice: 40.0,
    LocalShipping: 10.0,
    PaintAluminiumFrame: 16.0,
    CutAssembleFrame: 25.0,
    CaulkSettingBlockAnchorAndGasket: 4.0,
    InstallGlassIntoFrame: 8.0,
    FixCost: 55.0,
  };

  // Fetch site details and quotations
  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        const siteData = await getSiteById(siteId);
        if (siteData) {
          setSite(siteData);
          try {
            const quotationsData = await getQuotationsBySiteId(siteId);
            setQuotations(quotationsData);
          } catch (quotationsError) {
            if (quotationsError.response && quotationsError.response.status === 404) {
              setQuotations([]);
            } else {
              throw quotationsError;
            }
          }
        } else {
          setError('Site not found.');
        }
      } catch (err) {
        setError('Failed to fetch site details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchSiteDetails();
    fetchProducts();
  }, [siteId]);

  // Helper function to calculate total cost for each quote
  const calculateTotalCost = (quotation) => {
    const height = Number(quotation.height);
    const width = Number(quotation.width);
    const totalPerimeterLF = ((height + width) * 2) / 12;
    const totalSqFt = (height * width) / 144;

    const estimatedCosts = {
      GlassGeneralSpecBigMacClear: totalSqFt * unitPrices.GlassGeneralSpecBigMacClear,
      ShippingFromGlassSupplier: totalSqFt * unitPrices.ShippingFromGlassSupplier,
      AluminumFrameAveragePrice: totalPerimeterLF * unitPrices.AluminumFrameAveragePrice,
      LocalShipping: 200.0,
      PaintAluminiumFrame: totalPerimeterLF * unitPrices.PaintAluminiumFrame,
      CutAssembleFrame: 900 + (totalPerimeterLF * unitPrices.CutAssembleFrame),
      CaulkSettingBlockAnchorAndGasket: totalSqFt * unitPrices.CaulkSettingBlockAnchorAndGasket,
      InstallGlassIntoFrame: totalSqFt * unitPrices.InstallGlassIntoFrame,
      FixCost: totalSqFt * unitPrices.FixCost,
    };
    return Object.values(estimatedCosts).reduce((acc, cost) => acc + cost, 0);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenQuote = (quoteId) => {
    navigate(`/quote/${quoteId}`);
  };

  // const handleAddQuote = () => {
  //   setIsModalOpen(true);
  // };

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

  // Handlers for modal and form
  const handleAddQuote = () => {
    setIsModalOpen(true);
  };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewQuote({ ...newQuote, [name]: value });
  // };

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
      setQuotations([...quotations,createdQuote])
      handleCloseModal();
    } catch (error) {
      showErrorToast(`Error Create Quotation: ${error.message}`);
    }
  };

  const handleGetQuoatation=(data)=>{
    setCSVQuotation(data)
  }


  // Show loading or error state
  if (loading) return <p>Loading site details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Title>{site.sitename} Detail</Title>
      <Detail>
        <strong>Address:</strong> {`${site.site_location.street}, ${site.site_location.city}, ${site.site_location.state}, ${site.site_location.country}, ${site.site_location.postal_code}`}
      </Detail>
      <Detail><strong>Type:</strong> {site.site_type}</Detail>
      <Detail><strong>Risks:</strong> {site.risks.join(', ')}</Detail>

      <HeaderRow>
        <Title>Quotations</Title>
        <AddQuoteButton onClick={handleAddQuote}>Add New Quote</AddQuoteButton>
      </HeaderRow>

      {quotations.length > 0 ? (
        <QuotationList>
        {quotations.map((quotation) => {
          const totalCost = calculateTotalCost(quotation);
          return (
            <QuotationItem key={quotation.id}>
              <div>
                <Detail><strong>Product Name:</strong> {quotation.product.product_name}</Detail>
                <Detail><strong>Dimensions:</strong> {quotation.height} cm x {quotation.width} cm</Detail>
                <Detail><strong>Quantity:</strong> {quotation.quantity}</Detail>
                <Detail><strong>Shape:</strong> {quotation.shape}</Detail>
                <Detail><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</Detail>
              </div>
              <Button onClick={() => navigate(`/quote/${quotation.id}`)}>Open Quote</Button>
            </QuotationItem>
          );
        })}
      </QuotationList>
      ) : (
        <NoQuotationsMessage>No quotations found for this site.</NoQuotationsMessage>
      )}

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
    </Container>
  );
};

export default SiteDetailsPage;
