import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import 'tailwindcss/tailwind.css';
import { getSites, addQuotations, getProductIdsByNames } from '../../api/api';
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

const sanitizeQuotes = (str) => {
  return str.replace(/’|‘|["']/g, "'").trim(); 
};

const UploadCSV = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [sites, setSites] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSite('');
    setCsvFile(null);
  };

  const handleFileChange = (e) => setCsvFile(e.target.files[0]);

  const fetchSites = async () => {
    try {
      const data = await getSites();
      setSites(data);
    } catch (error) {
      showErrorToast(`Error fetching sites: ${error.message}`);
    }
  };

  const parseFile = async (file) => {
    const fileExtension = file.name.split('.').pop();

    const parseCSV = async (file) => {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const productNames = Array.from(new Set(results.data.map(row => sanitizeQuotes(row.product_name)).filter(name => name)));

          if (productNames.length === 0) {
            showErrorToast('No valid product names found.');
            return;
          }

          try {
            const productResponse = await getProductIdsByNames(productNames);
            const productIdsMap = {};
            Object.entries(productResponse).forEach(([productName, productId]) => {
              productIdsMap[productName] = productId; 
            });

            const quotations = results.data.map(row => {
              const productId = productIdsMap[sanitizeQuotes(row.product_name)];
              console.log('productId',productId);
              
              if (!productId) {
                // showErrorToast(`Product names "${sanitizeQuotes(row.product_name)}" not found.`);
                return null; 
              }

              return {
                site_id: selectedSite,
                product_id: productId, 
                width: row.width ? parseFloat(row.width) : null,
                height: row.height ? parseFloat(row.height) : null,
                shape: row.shape || null,
                custom_shape: row.custom_shape || null,
                radius: row.radius ? parseInt(row.radius) : null,
                quantity: row.quantity ? parseInt(row.quantity) : null,
                linear_foot: row.linear_foot ? parseFloat(row.linear_foot) : null,
                square_foot: row.square_foot ? parseFloat(row.square_foot) : null,
              };
            }).filter(quotation => quotation !== null); 

            if (quotations.length > 0) {
              handleQuotations(quotations);
            } else {
              showErrorToast('No valid quotations found in the file.');
            }
          } catch (error) {
            showErrorToast(`Error fetching product IDs: ${error.message}`);
          }
        },
        error: (error) => showErrorToast(`Error parsing CSV: ${error.message}`),
      });
    };

    const parseExcel = async (file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const productNames = Array.from(new Set(jsonData.slice(1).map(row => sanitizeQuotes(row[0])))).filter(name => name);

        if (productNames.length === 0) {
          showErrorToast('No valid product names found.');
          return;
        }

        try {
          const productResponse = await getProductIdsByNames(productNames);
          const productIdsMap = {};
          Object.entries(productResponse).forEach(([productName, productId]) => {
            productIdsMap[productName] = productId; 
          });

          const quotations = jsonData.slice(1).map(row => {
            const productId = productIdsMap[sanitizeQuotes(row[0])];
            if (!productId) {
              showErrorToast(`Product names "${sanitizeQuotes(row[0])}" not found.`);
              return null; 
            }

            return {
              site_id: selectedSite,
              product_id: productId,
              width: row[1] ? parseFloat(row[1]) : null,
              height: row[2] ? parseFloat(row[2]) : null,
              shape: row[3] || null,
              custom_shape: row[4] || null,
              radius: row[5] ? parseInt(row[5]) : null,
              quantity: row[6] ? parseInt(row[6]) : null,
              linear_foot: row[7] ? parseFloat(row[7]) : null,
              square_foot: row[8] ? parseFloat(row[8]) : null,
            };
          }).filter(quotation => quotation !== null);

          if (quotations.length > 0) {
            handleQuotations(quotations);
          } else {
            showErrorToast('No valid quotations found in the file.');
          }
        } catch (error) {
          showErrorToast(`Error fetching product IDs: ${error.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    if (fileExtension === 'csv') {
      await parseCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      await parseExcel(file);
    } else {
      showErrorToast('Unsupported file format');
    }
  };

  const handleUpload = () => {
    if (!csvFile || !selectedSite) return;
    parseFile(csvFile);
    handleCloseModal();
  };

  const handleQuotations = async (quotations) => {
    try {
      await addQuotations(selectedSite, quotations);
      showSuccessToast('Quotation added successfully!');
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
