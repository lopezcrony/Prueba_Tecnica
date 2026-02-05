/**
 * Funciones de validación para formularios
 */

export const validators = {
  /**
   * Validar email
   */
  email(value: string): string | null {
    if (!value) {
      return 'El email es requerido';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email inválido';
    }
    return null;
  },

  /**
   * Validar contraseña
   */
  password(value: string): string | null {
    if (!value) {
      return 'La contraseña es requerida';
    }
    if (value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  },

  /**
   * Validar que las contraseñas coincidan
   */
  confirmPassword(password: string, confirmPassword: string): string | null {
    if (!confirmPassword) {
      return 'Debes confirmar la contraseña';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  },

  /**
   * Validar campo requerido
   */
  required(value: string, fieldName: string = 'Este campo'): string | null {
    if (!value || value.trim() === '') {
      return `${fieldName} es requerido`;
    }
    return null;
  },
};
