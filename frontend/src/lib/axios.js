import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:import.meta.env.MODE === "development"? "http://localhost:8080/api/v1" : "https://leetlab-backend-ifrk.onrender.com/",
  withCredentials: true,
});

// "/api/v1",