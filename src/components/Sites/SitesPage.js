import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'react-modal';
import { getSites, createSite } from '../../api/api'; 


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
  gap: 15px; /* Increased gap for better spacing */
  width: 90%; /* Take 90% of the screen width */
  max-width: 400px; /* Maximum width for the form */
  max-height: 70vh; /* Maximum height for the form */
  overflow-y: auto; /* Enable vertical scrolling if content exceeds height */
  padding: 15px; /* Added padding */
  background-color: white; /* Background color to contrast modal */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Add a shadow for depth */

  @media (max-width: 480px) {
    padding: 10px; /* Reduce padding on smaller screens */
  }
`;



const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%; /* Full width */

  @media (max-width: 480px) {
    font-size: 14px; /* Smaller font on mobile */
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%; /* Full width */

  @media (max-width: 480px) {
    font-size: 14px; /* Smaller font on mobile */
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

Modal.setAppElement('#root');

const SitesPage = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        risks: value.split(',').map((risk) => risk.trim()),  // Convert to array on change
      }));
    } else {
      setNewSite((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit new site to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSiteData = {
        sitename: newSite.sitename,  // Add sitename field
        site_location: {
          street: newSite.site_location.street,
          city: newSite.site_location.city,
          state: newSite.site_location.state,
          country: newSite.site_location.country,
          postal_code: newSite.site_location.postal_code,
        },
        site_type: newSite.site_type,
        user_id: userID, 
        risks: newSite.risks, // Convert risks to 
      };
      console.log(newSiteData); 
      const newsite=await createSite(newSiteData); // Call the API to create the site
      setSites([...sites, newsite]); // Update state with the new site
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
      console.error(err); // Log the error for debugging
    }
};

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
          <AddSiteButton onClick={handleAddSite}>Add New Site</AddSiteButton>
        </HeaderRow>

        <SitesWrapper>
          {sites.map((site) => (
            <SiteCard key={site.id}>
              <h2>{site.sitename || 'No Name'}</h2>
              <p>
                <strong>Address:</strong> {`${site.site_location.street}, ${site.site_location.city}, ${site.site_location.state}, ${site.site_location.country}, ${site.site_location.postal_code}`}
              </p>
              <p><strong>Type:</strong> {site.site_type}</p>
              <p><strong>Risks:</strong> {site.risks.join(', ')}</p>
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
            <Input name="risks" value={newSite.risks} onChange={handleInputChange} required /> {/* Join array to show in input */}
            <SubmitButton type="submit">Add Site</SubmitButton>
          </FormContainer>
        </Modal>
      </ParentCard>
    </div>
  );
};

export default SitesPage;