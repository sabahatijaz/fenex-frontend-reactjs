import React from 'react';
import { useLocation } from 'react-router-dom'; 
import { SidebarContainer, Logo, Nav, NavLink, Footer } from './SidebarStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import "./UploadCardStyle.css";

const Sidebar = ({ onImageUpload }) => {
  const location = useLocation(); 

  const handleAddImage = (e) => {
    let imgObj = e.target.files[0];
    let render = new FileReader();
    render.readAsDataURL(imgObj);
    render.onload = (event) => {
      onImageUpload(event.target.result);
    };
  };

  return (
    <SidebarContainer>
      <Logo>FENEX</Logo>
      <Nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/sites">Sites</NavLink>
        <NavLink to="/quotes">Quotes</NavLink>
        <NavLink to="/canvas">Canvas</NavLink>
      </Nav>

      {location.pathname === '/canvas' && (
        <div style={{ margin: '20px 0' }}>
          <div className='upload-card'>
            <input
              type="file"
              accept="image/*"
              id="file-input"
              style={{ display: 'none' }}
              onChange={handleAddImage}
            />
            <label
              htmlFor="file-input"
              className='upload-label flex items-center cursor-pointer'
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              <div className='upload-content'>
                <h4 className="inline">Upload Image</h4>
                
              </div>
            </label>
          </div>
        </div>
      )}

      <Footer>
        <p>&copy; 2024 FENEX</p>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;
