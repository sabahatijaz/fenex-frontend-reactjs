import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'react-modal';
import { getSites, createSite ,getQuotationsBySiteId } from '../../api/api'; 


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

const SitesLabel = styled.h2`
  margin: 0;
  color: #3b5998;
`;

const AddSiteButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #388e3c;
  }
`;

const SitesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

const SiteCard = styled.div`
  position: relative;
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

  .updated-at {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: rgba(255, 255, 255, 0.8);
    padding: 4px 8px; 
    border-radius: 4px;
    font-size: 0.8rem; 
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;

    @media (max-width: 480px) {
      font-size: 0.7rem; 
      padding: 3px 6px; 
    }
  }
`;

const OpenSiteButton = styled.button`
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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 90%;
  max-width: 400px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%; 

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%; 

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #388e3c;
  }
`;

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
  },
};

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; 
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 250px;

  @media (max-width: 768px) {
    width: 100%; 
    font-size: 14px;
  }
`;



Modal.setAppElement('#root');

const SitesPage = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [siteId, setSitesId] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredSites, setFilteredSites] = useState([]); 
  const [productNamesBySite, setProductNamesBySite] = useState({});
  const [quotations,setQuotations] = useState([])
  const [searchQuery, setSearchQuery] = useState(''); 
  const [newSite, setNewSite] = useState({
    sitename: '',
    site_location: {
      street: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
    },
    site_type: 'Commercial',
    risks: [], 
  });

  

  const userID = localStorage.getItem('user_id')
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await getSites();
        setFilteredSites(data); 
        setSites(data);
      } catch (err) {
        setError('Failed to load sites');
      } finally {
        setLoading(false);
      }
    };
    fetchSites();

  }, []);

  const handleOpenSite = (siteId) => {
    navigate(`/site/${siteId}`);
  };

  const handleAddSite = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewSite({
      sitename: '',
      site_location: {
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
      },
      site_type: 'Commercial',
      risks: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address_')) {
      const field = name.replace('address_', '');
      setNewSite((prev) => ({
        ...prev,
        site_location: {
          ...prev.site_location,
          [field]: value,
        },
      }));
    } else if (name === 'risks') {
      setNewSite((prev) => ({
        ...prev,
        risks: value.split(',').map((risk) => risk.trim()),  
      }));
    } else {
      setNewSite((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = sites.filter((site) =>
      [
        site.site_location.street,
        site.site_location.city,
        site.site_location.state,
        site.site_location.country,
        site.site_location.postal_code,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );

    setFilteredSites(filtered);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSiteData = {
        sitename: newSite.sitename,  
        site_location: {
          street: newSite.site_location.street,
          city: newSite.site_location.city,
          state: newSite.site_location.state,
          country: newSite.site_location.country,
          postal_code: newSite.site_location.postal_code,
        },
        site_type: newSite.site_type,
        user_id: userID, 
        risks: newSite.risks, 
      };
      console.log(newSiteData); 
      const newsite=await createSite(newSiteData); 
      setSites([...sites, newsite]); 
      setFilteredSites([...sites, newsite]);
      setNewSite({
        name: '',
        site_location: {
          street: '',
          city: '',
          state: '',
          country: '',
          postal_code: '',
        },
        site_type: 'Commercial',
        risks: '',
      });
      handleCloseModal();
    } catch (err) {
      setError('Failed to add site');
      console.error(err); 
    }
};


useEffect(() => {
  async function fetchProductNames() {
    const productsMap = {};
    for (const site of filteredSites) { 
      try {
        const response = await getQuotationsBySiteId(site.id);
        const quotations = Array.isArray(response) ? response : response.data;
        const productNames = quotations?.map((quotation) => quotation.product.product_name) || [];
        productsMap[site.id] = productNames.length > 0 ? productNames.join(', ') : 'No products available';
      } catch (error) {
        console.error(`Error fetching products for site ${site.id}:`, error);
        productsMap[site.id] = 'No Products';
      }
    }
    setProductNamesBySite(productsMap);
  }

  if (filteredSites.length > 0) {
    fetchProductNames();
  }
}, [filteredSites]); 


  if (loading) {
    return <p>Loading sites...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <ParentCard>
      <HeaderRow>
          <SitesLabel>Sites</SitesLabel>
          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="Search by address..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <AddSiteButton onClick={handleAddSite}>Add New Site</AddSiteButton>
          </SearchWrapper>
        </HeaderRow>

        <SitesWrapper>
          {filteredSites.map((site) => (
           <SiteCard>
           {site.last_updated && (
             <div className="updated-at">
               {
                 new Intl.DateTimeFormat('en-US', {
                   timeZone: 'Asia/Karachi',
                   year: 'numeric',
                   month: 'long',
                   day: '2-digit',
                   hour: '2-digit',
                   minute: '2-digit',
                   second: '2-digit',
                   hour12: true,
                 }).format(new Date(site.last_updated))
               }
             </div>
           )}
         
           <p><strong>Site Id: {site.site_id || 'No Id'}</strong></p>
           <h2><strong>{site.sitename || 'No Name'}</strong></h2>
           <p>
             <strong>Address:</strong> {`${site.site_id} ${site.site_location.street}, ${site.site_location.city}, ${site.site_location.state}, ${site.site_location.country}, ${site.site_location.postal_code}`}
           </p>
           <p><strong>Type:</strong> {site.site_type}</p>
           <p><strong>Risks:</strong> {site.risks.join(', ')}</p>
           <p><strong>Products:</strong> {productNamesBySite[site.id] || 'Fetching...'}</p>
           <OpenSiteButton onClick={() => handleOpenSite(site.id)}>Open Site</OpenSiteButton>
         </SiteCard>
          
          ))}
        </SitesWrapper>
        <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} style={customModalStyles} contentLabel="Add New Site">
          <h2>Add New Site</h2>
          <FormContainer onSubmit={handleSubmit}>
            <label>Site Name</label>
            <Input name="sitename" value={newSite.sitename} onChange={handleInputChange} required />
            <label>Street</label>
            <Input name="address_street" value={newSite.site_location.street} onChange={handleInputChange} required />
            <label>City</label>
            <Input name="address_city" value={newSite.site_location.city} onChange={handleInputChange} required />
            <label>State</label>
            <Input name="address_state" value={newSite.site_location.state} onChange={handleInputChange} required />
            <label>Country</label>
            <Input name="address_country" value={newSite.site_location.country} onChange={handleInputChange} required />
            <label>Postal Code</label>
            <Input name="address_postal_code" value={newSite.site_location.postal_code} onChange={handleInputChange} required />
            <label>Site Type</label>
            <Select name="site_type" value={newSite.site_type} onChange={handleInputChange} required>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
            </Select>
            <label>Risks (comma separated)</label>
            <Input name="risks" value={newSite.risks} onChange={handleInputChange} required /> 
            <SubmitButton type="submit">Add Site</SubmitButton>
          </FormContainer>
        </Modal>
      </ParentCard>
    </div>
  );
};

export default SitesPage;