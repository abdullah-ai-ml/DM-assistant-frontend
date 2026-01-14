import axios from 'axios';

const token = localStorage.getItem("token")
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
});

export default apiClient;
