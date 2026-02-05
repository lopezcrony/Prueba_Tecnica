/**
 * Utilidad para manejo centralizado de errores
 * Aplica DRY (Don't Repeat Yourself) en el manejo de errores de API
 */

import { closeLoading, showError } from './alerts';

/**
 * Maneja errores de respuestas de API
 * Extrae el mensaje de error del formato estándar del backend
 * 
 * @param error - Error capturado del catch
 * @param defaultMessage - Mensaje por defecto si no hay mensaje en la respuesta
 * @param defaultTitle - Título del alert (opcional)
 */
export const handleApiError = (
  error: any,
  defaultMessage: string = 'Ha ocurrido un error',
  defaultTitle: string = 'Error'
): void => {
  closeLoading();
  
  // Extraer mensaje del formato estándar del backend
  const message = error.response?.data?.error?.message 
    || error.response?.data?.message 
    || error.message 
    || defaultMessage;
  
  showError(message, defaultTitle);
};

/**
 * Wrapper para ejecutar operaciones asíncronas con manejo de errores
 * Útil para reducir boilerplate en componentes
 * 
 * @param operation - Función asíncrona a ejecutar
 * @param errorMessage - Mensaje de error personalizado
 * @returns Resultado de la operación o undefined si falla
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Error al procesar la operación'
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error: any) {
    handleApiError(error, errorMessage);
    return undefined;
  }
};

/**
 * Valida errores de red/conexión
 * @param error - Error capturado
 * @returns true si es un error de red
 */
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

/**
 * Obtiene el código de estado HTTP del error
 * @param error - Error capturado
 * @returns Código de estado o null
 */
export const getErrorStatus = (error: any): number | null => {
  return error.response?.status || null;
};
