import { ENV } from './env';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: ENV.APP_NAME,
      version: ENV.APP_VERSION,
      description: 'API REST para gestión de contactos con importación masiva desde CSV. Incluye autenticación JWT, control de acceso basado en roles (RBAC) y validación de datos en streaming.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${ENV.PORT}${ENV.API_PREFIX}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
