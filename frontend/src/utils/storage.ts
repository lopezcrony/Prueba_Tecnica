/**
 * Gestión segura de localStorage para JWT
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const storage = {
  /**
   * Guardar token JWT
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error al guardar token:', error);
    }
  },

  /**
   * Obtener token JWT
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  },

  /**
   * Eliminar token JWT
   */
  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error al eliminar token:', error);
    }
  },

  /**
   * Guardar información del usuario
   */
  setUser(user: any): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  },

  /**
   * Obtener información del usuario
   */
  getUser(): any | null {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  /**
   * Eliminar información del usuario
   */
  removeUser(): void {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  },

  /**
   * Limpiar todo el storage de autenticación
   */
  clear(): void {
    this.removeToken();
    this.removeUser();
  },
};
