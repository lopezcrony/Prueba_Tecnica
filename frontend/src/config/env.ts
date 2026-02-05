/**
 * Configuración centralizada de variables de entorno
 * Tipado y validación en tiempo de ejecución
 */

interface EnvConfig {
  API_URL: string;
}

const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];
  
  if (!value) {
    throw new Error(`Variable de entorno ${key} no está definida`);
  }
  
  return value;
};

export const ENV: EnvConfig = {
  API_URL: getEnvVariable('VITE_API_URL'),
};
