/**
 * Servicio de autenticación
 * Maneja login, register y logout
 */

import apiClient from './api/axios';
import type { LoginCredentials, RegisterData, AuthResponse, RegisterResponse } from '../types/auth.types';
import type { ApiSuccessResponse } from '../types/api.types';

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiSuccessResponse<RegisterResponse>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },
};
