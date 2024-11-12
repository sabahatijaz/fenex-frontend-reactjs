import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuotationById, getversionHistory, updateQuoations,getWidthByLenght } from '../../api/api'; // Updated functions
import styled from 'styled-components';

// Styled components
const DetailsCard = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 90vw;
  margin: 0 auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  border-radius: 10px;
  min-height: 80vh;
`;

const BackButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const DetailsContent = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  text-align: left;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ModalButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const QuoteDetailsPage = () => {
  const { quoteId } = useParams(); 
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newHeight, setNewHeight] = useState('');
  const [newWidth, setNewWidth] = useState('');
  const navigate = useNavigate();

  const userRole = localStorage.getItem('role'); 



  

  useEffect(() => {
    const fetchQuoteDetails = async () => {
      try {
        const data = await getQuotationById(quoteId);
        setQuoteDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quote details:', error);
        setError('Failed to fetch quote details');
        setLoading(false);
      }
    };

    fetchQuoteDetails();
  }, [quoteId]);

  const handleBack = () => {
    navigate('/');
  };

  const handleUpdateClick = () => {
    setNewHeight(quoteDetails.height);
    setNewWidth(quoteDetails.width);
    setShowModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const updatedQuote = {
        ...quoteDetails,
        height: newHeight,
        width: newWidth,

      };
      await updateQuoations(quoteId, updatedQuote);
      setQuoteDetails(updatedQuote);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating quote:", error);
    }
  };


  // const handleGetWidthByLenghtChange = async (e) => {
  //   try {
  //     const value = e.target.value;
  //     setLengths(value);

  //     if(value === 'selectlenght'){
  //       setWidths([])
  //       setProductID(null)
  //       setIsWidthDisabled(true);
  //     }
  
  //     if (productId) {
  //       const width = await getWidthByLenght(productId, value);
  //       setWidths(width);
  //       setIsWidthDisabled(false);
        
  //     } else {
  //       console.error('Error fetching productID');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching width', error);
  //   }
  // };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!quoteDetails) return <p>No details available</p>;

  const {
    quotation_id,
    site_id,
    product_name,
    height,
    width,
    quantity = 1,
  } = quoteDetails;

  const totalPerimeterLF = ((Number(height) + Number(width)) * 2) / 12 || 0;
  const totalSqFt = (Number(height) * Number(width)) / 144 || 0;

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

  const totalCost = Object.values(estimatedCosts).reduce((acc, cost) => acc + cost, 0);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <DetailsCard>
        <h2>Quote Details</h2>
        <DetailsContent>
          <p><strong>Product Name:</strong> {quoteDetails.product.product_name}</p>
          <p><strong>Dimensions:</strong> {height} cm x {width} cm</p>
          <p><strong>Total Perimeter Linear Foot:</strong> {totalPerimeterLF.toFixed(2)} LF</p>
          <p><strong>Total SQ/FT:</strong> {totalSqFt.toFixed(2)} sq/ft</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>

          {/* Table displaying the cost breakdown */}
          <Table>
            <thead>
              <tr>
                <TableHeader>Product</TableHeader>
                <TableHeader>Estimate</TableHeader>
                <TableHeader>Unit Price Estimate</TableHeader>
              </tr>
            </thead>
            <tbody>
              {Object.entries(estimatedCosts).map(([key, value]) => (
                <tr key={key}>
                  <TableCell>{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                  <TableCell>${value.toFixed(2)}</TableCell>
                  <TableCell>${unitPrices[key] ? unitPrices[key].toFixed(2) : '-'} per {key.includes('Frame') ? 'LF' : 'sq/ft'}</TableCell>
                </tr>
              ))}
            </tbody>
          </Table>

          {userRole === 'admin' && (
            <div style={{ marginTop: '20px' }}>
              <button onClick={handleUpdateClick} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px' }}>Update Dimensions</button>
            </div>
          )}
        </DetailsContent>
        <BackButton onClick={handleBack}>Go Back</BackButton>
      </DetailsCard>

      {/* Update Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContainer>
            <h3>Update Dimensions</h3>
            <div>
              <label>Height (cm):</label>
              <ModalInput
                type="number"
                value={newHeight}
                onChange={(e) => setNewHeight(e.target.value)}
              />
            </div>
            <div>
              <label>Width (cm):</label>
              <ModalInput
                type="number"
                value={newWidth}
                onChange={(e) => setNewWidth(e.target.value)}
              />
            </div>
            <ModalButton onClick={handleUpdateSubmit}>Update</ModalButton>
            <ModalButton onClick={() => setShowModal(false)} style={{ backgroundColor: '#dc3545', marginTop: '10px' }}>Cancel</ModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
};

export default QuoteDetailsPage;
