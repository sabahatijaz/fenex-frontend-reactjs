import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSiteById, getQuotationsBySiteId, createQuotation, getProducts } from '../../api/api';
import styled from 'styled-components';
import Modal from 'react-modal';

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

const SiteDetailsPage = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({
    product_name: '',
    height: 0,
    width: 0,
    quantity: 1,
    shape: 'A-Flat',
  });
  const [products, setProducts] = useState([]);

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

  // Handlers for modal and form
  const handleAddQuote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuote({ ...newQuote, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      newQuote.site_id=siteId
      const createdQuote = await createQuotation(newQuote);
      setQuotations([...quotations, createdQuote]);
      setNewQuote({ product_name: '', height: 0, width: 0, quantity: 1, shape: 'A-Flat' });
      handleCloseModal();
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  // Show loading or error state
  if (loading) return <p>Loading site details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Title>{site.sitename} Details</Title>
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
              <option value="C-Bend">C-Bend</option>
            </Select>

            {/* Input for height */}
            <label htmlFor="height">Height (cm):</label>
            <Input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={newQuote.height}
              onChange={handleInputChange}
              required
            />

            {/* Input for width */}
            <label htmlFor="width">Width (cm):</label>
            <Input
              type="number"
              name="width"
              placeholder="Width (cm)"
              value={newQuote.width}
              onChange={handleInputChange}
              required
            />

            {/* Input for quantity */}
            <label htmlFor="quantity">Quantity:</label>
            <Input
              type="number"
              name="quantity"
              placeholder="Quantity"
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
