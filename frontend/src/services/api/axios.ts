/**
 * Instancia de Axios configurada con interceptors
 * Manejo centralizado de autenticación y errores
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../../config/env';
import { storage } from '../../utils/storage';
import type { ApiResponse } from '../../types/api.types';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: agregar token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;
    
    // Si el error es 401 Y NO es una petición de login/register
    // significa que el token expiró o es inválido
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      storage.clear();
      window.location.href = '/login';
    }

    // Retornar el error formateado
    return Promise.reject(error);
  }
);

export default apiClient;
