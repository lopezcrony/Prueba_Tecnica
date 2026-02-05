/**
 * Store de autenticación usando Pinia Option Stores
 * Maneja el estado del usuario y token JWT
 */

import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';
import type { User, LoginCredentials, RegisterData } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  // Estado
  state: (): AuthState => ({
    user: storage.getUser(),
    token: storage.getToken(),
    isAuthenticated: !!storage.getToken(),
    loading: false,
    error: null,
  }),

  // Getters
  getters: {
    isAdmin(): boolean {
      return this.user?.role === 'admin';
    },
    
    userName(): string {
      return this.user?.name || '';
    },
  },

  // Actions
  actions: {
    /**
     * Iniciar sesión
     */
    async login(credentials: LoginCredentials): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);
        
        // Guardar en el store
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;
        
        // Guardar en localStorage
        storage.setToken(response.token);
        storage.setUser(response.user);
      } catch (error: any) {
        this.error = error.response?.data?.error?.message || 'Error al iniciar sesión';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Registrar nuevo usuario
     */
    async register(data: RegisterData): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await authService.register(data);
        // No guardamos nada porque register no devuelve token
        // El usuario debe hacer login después
      } catch (error: any) {
        this.error = error.response?.data?.error?.message || 'Error al registrar usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Cerrar sesión
     */
    logout(): void {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.error = null;
      
      // Limpiar localStorage
      storage.clear();
    },

    /**
     * Restaurar sesión desde localStorage
     */
    restoreSession(): void {
      const token = storage.getToken();
      const user = storage.getUser();

      if (token && user) {
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
      }
    },
  },
});
