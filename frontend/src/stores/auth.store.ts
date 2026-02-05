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
  state: (): AuthState => ({
    user: storage.getUser(),
    token: storage.getToken(),
    isAuthenticated: !!storage.getToken(),
    loading: false,
    error: null,
  }),

  getters: {
    isAdmin(): boolean {
      return this.user?.role === 'admin';
    },
    
    userName(): string {
      return this.user?.name || '';
    },
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);
        
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;
        
        storage.setToken(response.token);
        storage.setUser(response.user);
      } catch (error: any) {
        this.error = error.response?.data?.error?.message || 'Error al iniciar sesión';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(data: RegisterData): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await authService.register(data);
      } catch (error: any) {
        this.error = error.response?.data?.error?.message || 'Error al registrar usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout(): void {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.error = null;
      
      storage.clear();
    },

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
