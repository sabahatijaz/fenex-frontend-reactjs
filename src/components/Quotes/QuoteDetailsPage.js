import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuotationById,getversionHistory  } from '../../api/api'; // Updated function
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

const QuoteDetailsPage = () => {
  const { quoteId } = useParams(); // Retrieve quote ID from URL params
  const [quoteDetails, setQuoteDetails] = useState(null); // Changed to handle a single quote object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get the user role from local storage (or use another method if applicable)
  const userRole = localStorage.getItem('role'); // Default to 'User' if no role is set
  useEffect(() => {
    const fetchVersionHistory = async () => {
      try {
        await getversionHistory();
      } catch (error) {
        console.error("Error fetching version history:", error);
      }
    };
  
    fetchVersionHistory();
  }, []);

  useEffect(() => {
    const fetchQuoteDetails = async () => {
      try {
        console.log(`Fetching details for quote ID: ${quoteId}`);
        const data = await getQuotationById(quoteId); // Updated to use getQuotationById
        console.log('Quote details:', data);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!quoteDetails) {
    return <p>No details available</p>;
  }

  const {
    quotation_id,
    site_id,
    product_name,
    height = 0,
    width = 0,
    quantity = 1,
  } = quoteDetails;

  // Calculate total perimeter and area
  const totalPerimeterLF = ((Number(height) + Number(width)) * 2) / 12 || 0;
  const totalSqFt = (Number(height) * Number(width)) / 144 || 0;

  // Unit prices
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

  // Calculate estimates
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

  // Calculate the total cost
  const totalCost = Object.values(estimatedCosts).reduce((acc, cost) => acc + cost, 0);

  

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <DetailsCard>
        <h2>Quote Details</h2>
        <DetailsContent>
          {userRole === 'admin' ? (
            <>
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
            </>
          ) : (
            <>
              <p><strong>Product Name:</strong> {quoteDetails.product.product_name}</p>
              <p><strong>Dimensions:</strong> {height} cm x {width} cm</p>
              <p><strong>Total Perimeter Linear Foot:</strong> {totalPerimeterLF.toFixed(2)} LF</p>
              <p><strong>Total SQ/FT:</strong> {totalSqFt.toFixed(2)} sq/ft</p>
              <p><strong>Quantity:</strong> {quantity}</p>
              <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>

            </>
          )}
        </DetailsContent>
        <BackButton onClick={handleBack}>Go Back</BackButton>
      </DetailsCard>
    </div>
  );
};

export default QuoteDetailsPage;
