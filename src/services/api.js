import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

export const analyzeMedia = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const fetchHistory = async () => {
  const response = await apiClient.get('/history');
  return response.data;
};

export const fetchStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export default apiClient;
