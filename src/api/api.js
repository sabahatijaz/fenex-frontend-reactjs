import axios from 'axios';


const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.26:8000', 
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); 
    console.log('Token retrieved from localStorage:', token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding token to request headers:', config.headers);
    } else {
        console.log('No token found in localStorage.');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const createUser = async (newUser) => {
    const response = await api.post('/auth/signup', newUser);
    return response.data;
};

export const getUsers = async (skip = 0, limit = 10) => {
    const response = await api.get(`/users?skip=${skip}&limit=${limit}`);
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};


export const createSite = async (site) => {
    console.log("fite: ",site)
    const response = await api.post('/sites/', site);
    return response.data;
};

export const getSites = async (skip = 0, limit = 10) => {
    const response = await api.get(`/sites?skip=${skip}&limit=${limit}`);
    console.log("sites: ", response)
    return response.data;
};

export const getSiteById = async (siteId) => {
    const response = await api.get(`/sites/${siteId}`);
    return response.data;
};

export const updateSite = async (siteId, site) => {
    const response = await api.put(`/sites/${siteId}`, site);
    return response.data;
};

export const deleteSite = async (siteId) => {
    const response = await api.delete(`/sites/${siteId}`);
    return response.data;
};

export const createProduct = async (product) => {
    const response = await api.post('/products/', product);
    return response.data;
};

export const getProducts = async (skip = 0, limit = 10) => {
    const response = await api.get(`/products?skip=${skip}&limit=${limit}`);
    return response.data;
};

export const getProductById = async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
};

export const createQuotation = async (quotation) => {
    const response = await api.post('/quotations/', quotation);
    return response.data;
};

export const getQuotations = async (skip = 0, limit = 10) => {
    const response = await api.get(`/quotations?skip=${skip}&limit=${limit}`);
    return response.data;
};

export const getQuotationById = async (quotationId) => {
    const response = await api.get(`/quotations/${quotationId}`);
    return response.data;
};

export const updateQuotation = async (quotationId, quotation) => {
    const response = await api.put(`/quotations/${quotationId}`, quotation);
    return response.data;
};

export const deleteQuotation = async (quotationId) => {
    const response = await api.delete(`/quotations/${quotationId}`);
    return response.data;
};

export const getLenghtByWidth = async (width) =>{
    const response = await api.get(`/length-by-width/${width}`)
    return response.data
    
}

export const getWidthByLenght = async (productId,length) =>{
    const response = await api.get(`/width-by-length/${productId}/${length}`)
    return response.data
}

export const getPossibleLenght = async (product_id) =>{
    const response = await api.get(`/possible-lengths/${product_id}`)
    return response.data
}

export const getQuotationsByUserId = async (userId) => {
    const response = await api.get(`/quotations/user/${userId}`);
    return response.data;
};

export const getQuotationsBySiteId = async (siteId) => {
    const response = await api.get(`/quotations/site/${siteId}`);
    return response.data;
};

export const getShapes = async (siteId) => {
    const response = await api.get(`/shapes`);
    return response.data;
};

export const addQuotations = async (site_id, quotations) => {
    const response = await api.post(`/quotations/site/${site_id}`, quotations );
    return response.data;
};

export default api;
