/**
 * Utilidades para formateo de datos
 * Centraliza la lógica de presentación de datos
 */

/**
 * Formatea una fecha en formato español
 * @param dateString - String de fecha ISO o Date
 * @returns Fecha formateada como "dd/mm/yyyy, hh:mm"
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formatea un número con separadores de miles
 * @param value - Número a formatear
 * @returns Número formateado (ej: 1,234,567)
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-ES').format(value);
};

/**
 * Formatea el tamaño de un archivo
 * @param bytes - Tamaño en bytes
 * @returns Tamaño formateado (ej: "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Formatea una cadena para mostrar solo un extracto
 * @param text - Texto completo
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con "..."
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
