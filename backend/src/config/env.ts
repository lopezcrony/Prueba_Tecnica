import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.APP_NAME || 'ProyectoFullstack',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  
  // Server
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || '0.0.0.0',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USER: process.env.DB_USER || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || 'admin123',
  DB_NAME: process.env.DB_NAME || 'proyecto_db',
  DB_LOGGING: process.env.DB_LOGGING === 'true',
  DB_SSL: process.env.DB_SSL === 'true',
  DB_MAX_CONNECTIONS: parseInt(process.env.DB_MAX_CONNECTIONS || '100', 10),
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-in-production',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
  
  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Bcrypt
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '10', 10),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_FORMAT: process.env.LOG_FORMAT || 'json',
  LOG_DIR: process.env.LOG_DIR || './logs',
  
  // Seeds
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || 'admin123',
} as const;
