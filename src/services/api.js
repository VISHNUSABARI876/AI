import axios from 'axios';

// Try to determine the correct API base URL.
// In dev mode (Vite proxy), use relative '/api'.
// If accessed directly via Flask (port 5000), still use relative '/api'.
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout (model inference can be slow)
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error — backend is probably not running
      return Promise.reject(new Error(
        'Cannot connect to GodsEye backend. Make sure the Flask server is running on port 5000 (python app.py).'
      ));
    }
    return Promise.reject(error);
  }
);

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
