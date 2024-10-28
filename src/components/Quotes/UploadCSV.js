import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import 'tailwindcss/tailwind.css';
import { getSites, addQuotations } from '../../api/api';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const modalStyles = {
  content: {
    position: 'relative',
    width: '90vw',
    maxWidth: '600px',
    height: 'auto',
    margin: 'auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export const showErrorToast = (message) => {
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

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

const UploadCSV = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [sites, setSites] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSite('');
    setCsvFile(null);
    setShowAlert(false);
  };

  const handleFileChange = (e) => setCsvFile(e.target.files[0]);

  const handleUpload = () => {
    if (!csvFile || !selectedSite) return;

    const fileExtension = csvFile.name.split('.').pop();

    const parseFile = (file) => {
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const quotations = results.data
              .filter(row => row.product_id && row.width && row.height)
              .map(row => ({
                site_id: selectedSite,
                product_id: row.product_id || null,
                width: row.width ? parseFloat(row.width) : null,
                height: row.height ? parseFloat(row.height) : null,
                shape: row.shape || null,
                custom_shape: row.custom_shape || null,
                radius: row.radius ? parseInt(row.radius) : null,
                quantity: row.quantity ? parseInt(row.quantity) : null,
                linear_foot: row.linear_foot ? parseFloat(row.linear_foot) : null,
                square_foot: row.square_foot ? parseFloat(row.square_foot) : null,
              }));

            if (quotations.length > 0) {
              handleQuotations(quotations);
            } else {
              showErrorToast('No valid quotations found in the file.');
            }
          },
          error: (error) => showErrorToast(`Error parsing CSV: ${error.message}`),
        });
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const quotations = jsonData.slice(1)
            .filter(row => row[0] && row[1] && row[2])
            .map(row => ({
              site_id: selectedSite,
              product_id: row[0] || null,
              width: row[1] ? parseFloat(row[1]) : null,
              height: row[2] ? parseFloat(row[2]) : null,
              shape: row[3] || null,
              custom_shape: row[4] || null,
              radius: row[5] ? parseInt(row[5]) : null,
              quantity: row[6] ? parseInt(row[6]) : null,
              linear_foot: row[7] ? parseFloat(row[7]) : null,
              square_foot: row[8] ? parseFloat(row[8]) : null,
            }));

          if (quotations.length > 0) {
            handleQuotations(quotations);
          } else {
            showErrorToast('No valid quotations found in the file.');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        showErrorToast('Unsupported file format');
      }
    };

    parseFile(csvFile);
    handleCloseModal();
  };

  const fetchSites = async () => {
    try {
      const data = await getSites();
      setSites(data);
    } catch (error) {
      showErrorToast(`Error fetching sites: ${error.message}`);
    }
  };

  const handleQuotations = async (quotations) => {
    try {
      await addQuotations(selectedSite, quotations);
      showSuccessToast('Quotation added successfully!');
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      showErrorToast(`Error submitting quotations: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition"
      >
        Upload CSV
        <FontAwesomeIcon icon={faUpload} className="ml-2" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={modalStyles}
        contentLabel="Upload CSV File"
      >
        <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
        <label className="block mb-2" htmlFor="site_id">Select Site:</label>
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          required
          className="block w-full border border-gray-300 rounded-md p-2 mb-4"
        >
          <option value="">Select Site</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.sitename}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileChange}
          required
          className="block w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <div className="flex justify-between">
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 transition"
          >
            Upload
          </button>
          <button
            onClick={handleCloseModal}
            className="bg-gray-500 text-white py-2 px-4 rounded-md shadow hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default UploadCSV;
