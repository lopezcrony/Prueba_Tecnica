import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from './config/env';
import { swaggerOptions } from './config/swagger';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: ENV.CORS_CREDENTIALS,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.RATE_LIMIT_MAX_REQUESTS,
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde',
});
app.use(limiter);

// Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(`${ENV.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use(`${ENV.API_PREFIX}/auth`, authRoutes);
app.use(`${ENV.API_PREFIX}/documents`, documentRoutes);
app.use(`${ENV.API_PREFIX}/uploads`, uploadRoutes);

// Manejo de errores (debe ser el último middleware)
app.use(errorHandler);

export default app;
