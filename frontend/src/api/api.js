import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const analyzeStock = async (query, mode = 'balanced') => {
  const response = await apiClient.post('/analyze', { query, mode });
  return response.data;
};
