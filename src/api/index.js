import axios from 'axios';

// Get the API URL from environment variables, fallback to default if not set
const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // You can add auth headers or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Upload asset with progress tracking
export const uploadAsset = (formData, onProgress) =>
  api.post('/assets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress?.(progress);
    },
  });

// Get assets with optional filters
export const getAssets = (params) => api.get('/assets', { params });

// Download asset by ID
export const downloadAsset = async (id, filename) => {
  try {
    const response = await api.get(`/assets/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Delete asset by ID
export const deleteAsset = (id) => api.delete(`/assets/${id}`);

// Get supported file types from environment variable
export const getSupportedFileTypes = () => {
  const types = process.env.REACT_APP_SUPPORTED_FILE_TYPES;
  return types ? types.split(',') : [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4'
  ];
};

// Get max file size from environment variable
export const getMaxFileSize = () => {
  return parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10 * 1024 * 1024; // Default 10MB
};

export default api; 