// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// To ensure credentials are included in every request
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
